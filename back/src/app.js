import express from "express";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./users/users.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Middleware
app.use((err, req, res, next) => {
	console.error(err);

	if (err.statusCode) {
		return res.status(err.statusCode).json({ message: err.message });
	}

	res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
});

export default app;
