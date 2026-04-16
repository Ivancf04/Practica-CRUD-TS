import "dotenv/config";
import { join } from "path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env["DB_HOST"] ?? "127.0.0.1",
    port: Number(process.env["DB_PORT"] ?? 3306),
    username: process.env["DB_USER"] ?? "root",
    password: process.env["DB_PASSWORD"] ?? "",
    database: process.env["DB_NAME"] ?? "short_url",
    synchronize: true,
    logging: true,
    entities: [join(__dirname, "db/entity/*.{ts,js}")],
    subscribers: [],
    migrations: [],
});