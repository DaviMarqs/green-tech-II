import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,

	entities: [`${__dirname}/../entities/**/*.entity{.ts,.js}`],
	migrations: ["src/database/migrations/*.ts"],
	synchronize: false,
});

AppDataSource.initialize()
	.then(() => console.log("📦 Database connected"))
	.catch((err) => console.error("❌ Database connection error:", err));
