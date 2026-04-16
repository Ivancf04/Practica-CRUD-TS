import { AppDataSource } from "../data-source";
import { Url } from "./entity/Url";

export const UrlData = AppDataSource.getRepository(Url);
