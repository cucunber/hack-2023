import { makeAutoObservable } from "mobx";
import { IToken, IUser } from "../types/user";
import { TRootStore } from "./store";
import { AuthService } from "../services/auth.service";
import { authKeys } from "../config/lsKeys";
import { RegisterService } from "../services/register.service";

const getTokensFromLS = () => {
  const refresh = localStorage.getItem(authKeys.refresh);
  const access = localStorage.getItem(authKeys.access);
  if (!(access && refresh)) {
    return null;
  }
  return {
    refresh,
    access,
  };
};

export class UserStore {
  user: IUser | null = null;
  tokens: IToken | null = getTokensFromLS();
  authService: AuthService;
  registerService: RegisterService;
  constructor(public rootStore: TRootStore) {
    makeAutoObservable(this);
    this.authService = new AuthService(this);
    this.registerService = new RegisterService();
    if (this.tokens) {
      this.loginWithTokens(this.tokens);
    }
  }

  async loginWithTokens(tokens: IToken) {
    this.authService.loginWithTokens(tokens);
  }

  async login(data: { username: string; password: string }) {
    return await this.authService.loginWithCred(data);
  }

  async logout() {
    this.authService.logout();
  }

  get isAuth() {
    return this.tokens;
  }
}
