import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

export default new DataSource({
	type: "postgres",

	host: process.env.DB_HOST || "localhost",
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,

	synchronize: false,
	logging: true,
	entities: ["src/entities/**/*.ts"],
	migrations: ["src/migrations/**/*.ts"],
	subscribers: [],
});
