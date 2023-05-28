import axios, { AxiosError } from "axios";
import { IToken } from "../types/user";
import { userAPI } from "../api/user";
import { Api } from "../utils/api";

export const apiInstance = new Api({ baseURL: process.env.REACT_APP_BASE_API });

export const dadataInstance = axios.create({
  baseURL:
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Token " + process.env.REACT_APP_DADATA_AUTH_TOKEN,
  },
});
