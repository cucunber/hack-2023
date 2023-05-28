import axios, {
    Axios,
    AxiosInstance,
    AxiosRequestConfig,
    CreateAxiosDefaults,
  } from "axios";
  
  type APIInstance = AxiosInstance;
  
  type TInterceptor = {
    type: "response" | "request";
    interceptorId: number;
  };
  
  class Api {
    instance: APIInstance;
  
    private interceptors: TInterceptor[] = [];
  
    constructor(config: CreateAxiosDefaults) {
      this.instance = axios.create(config);
    }
  
    resetInterceptors() {
      this.interceptors.forEach(({ type, interceptorId }) =>
        this.instance.interceptors[type].eject(interceptorId)
      );
    }
    setRequestInterceptor(
      ...params: Parameters<Axios["interceptors"]["request"]["use"]>
    ) {
      const interceptorId = this.instance.interceptors.request.use(...params);
      this.interceptors.push({ type: "request", interceptorId });
      return interceptorId;
    }
    setResponseInterceptor(
      ...params: Parameters<Axios["interceptors"]["response"]["use"]>
    ) {
      const interceptorId = this.instance.interceptors.response.use(...params);
      this.interceptors.push({ type: "response", interceptorId });
      return interceptorId;
    }
    setResponseEject(id: number) {
      this.instance.interceptors.response.eject(id);
    }
    get<T = any>(url: string, config?: AxiosRequestConfig) {
      return this.instance.get<T>(url, config);
    }
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
      return this.instance.post<T>(url, data, config);
    }
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
      return this.instance.patch<T>(url, data, config);
    }
    delete<T = any>(url: string, config?: AxiosRequestConfig) {
      return this.instance.get<T>(url, config);
    }
  }
  
  export { Api };