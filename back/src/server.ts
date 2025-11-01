import express from "express";
import "reflect-metadata";
import "./database/data-source";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";

const app = express();
app.use(express.json());

app.get("/", (_, res) => res.send("API is running 🚀"));

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
