import cors from "cors";
import express from "express";
import "reflect-metadata";
import "./database/data-source";

import addressRoutes from "./modules/address/address.routes";
import authRoutes from "./modules/auth/auth.routes";
import orderRoutes from "./modules/orders/orders.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import productRoutes from "./modules/product/product.routes";
import userRoutes from "./modules/users/users.routes";
import paymentMethodRoutes from "./modules/payment-methods/paymentMethod.routes";

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true, // deixe true se for usar cookies/autenticação via browser
	}),
);
app.use(express.json());

app.get("/", (_, res) => res.send("API is running 🚀"));
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);

app.use((_, res) => {
	res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
