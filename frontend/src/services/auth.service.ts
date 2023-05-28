import { userAPI } from "../api/user";
import { authKeys } from "../config/lsKeys";
import { UserStore } from "../store/user.store";
import { IToken } from "../types/user";

type LoginRequestPayload = {
  username: string;
  password: string;
};

export class AuthService {
  constructor(private userStore: UserStore) {}
  private async refreshTokens() {
    if (this.userStore.tokens) {
      const data = await userAPI.refreshToken({
        refresh: this.userStore.tokens?.refresh,
      });
      return data;
    }
    return [true, null] as [true, null];
  }
  private clearTokens() {
    this.userStore.tokens = null;
    this.userStore.rootStore.backend.resetInterceptors();
    localStorage.removeItem(authKeys.access);
    localStorage.removeItem(authKeys.refresh);
  }
  updateTokens(tokens: IToken) {
    this.userStore.tokens = tokens;
    localStorage.setItem(authKeys.access, tokens.access);
    localStorage.setItem(authKeys.refresh, tokens.refresh);
    this.userStore.rootStore.backend.setRequestInterceptor((config) => {
      if (tokens.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
      return config;
    });
    const interceptorId =
      this.userStore.rootStore.backend.setResponseInterceptor(
        (config) => config,
        (error) => {
          if (error.response.status !== 401) {
            return Promise.reject(error);
          }
          this.userStore.rootStore.backend.setResponseEject(interceptorId);
          if (!this.userStore.tokens) {
            this.clearTokens();
            return Promise.reject(error);
          }
          return this.refreshTokens().then(([error_, data]) => {
            if (error_) {
              this.clearTokens();
              return Promise.reject(error);
            }
            this.userStore.tokens = {
              refresh: tokens.refresh,
              access: data.access,
            };
            error.response.config.headers.Authorization = `Bearer ${data.access}`;
            return this.userStore.rootStore.backend.instance(
              error.response.config
            );
          });
        }
      );
  }
  async loginWithCred(payload: LoginRequestPayload) {
    const [tokensError, tokensData] = await userAPI.createToken(payload);
    if (tokensError) {
      this.clearTokens();
      return true;
    }
    this.updateTokens(tokensData);
    return false;
  }
  async loginWithTokens(payload: IToken) {
    const [tokensError, tokensData] = await userAPI.refreshToken({
      refresh: payload.refresh,
    });
    if (tokensError) {
      this.clearTokens();
      return;
    }
    this.updateTokens({ refresh: payload.refresh, access: tokensData.access });
  }
  logout() {
    this.clearTokens();
    this.userStore.user = null;
  }
}
