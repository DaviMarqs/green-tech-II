import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Usuario } from "../entities/user/users.entity";
import { Produto } from "../entities/store/product.entity";
import { Avaliacao } from "../entities/store/available.entity";
import { Pedido } from "../entities/store/order.entity";
import { PedidoProduto } from "../entities/junctions/orderProduct.entity";
import { NotaFiscal } from "../entities/store/invoice.entity";
import { ProdutoNotaFiscal } from "../entities/junctions/productInvoice.entity";

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
