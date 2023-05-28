import { userAPI } from "../api/user";
import { IUser } from "../types/user";

export class RegisterService {
    async register(payload: Omit<IUser, 'id'>) {
        const data = await userAPI.createUser(payload);
        return data;
    }
}