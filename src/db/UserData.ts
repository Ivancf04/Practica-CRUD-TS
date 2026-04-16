import { AppDataSource } from "../data-source";
import { User } from "./entity/user";

export const UserData = AppDataSource.getRepository(User);
