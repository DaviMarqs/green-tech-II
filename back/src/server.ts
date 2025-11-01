import "reflect-metadata";
import AppDataSource from "./data-source";
import express from "express";

AppDataSource.initialize()
	.then(() => {
		console.log("Data Source inicializado com sucesso!");

		const app = express();

		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`Servidor rodando na porta ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Erro durante a inicialização do Data Source:", err);
	});
