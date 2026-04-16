import "reflect-metadata";

import express, { Application, Router } from "express";

import authMiddleware from "./middleware/authMiddleware";
import tokenMiddleware from "./middleware/tokenMiddleware";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import urlRoutes from "./routes/url";
import { AppDataSource } from "./data-source";

const app: Application = express();

app.use(express.json());

// Rutas públicas (sin middleware de seguridad)
app.use("/auth", authRoutes);
app.use("/url", urlRoutes);

// Rutas protegidas: requieren header "authorization" y "token" (métodos no-GET)
const protectedRouter = Router();
protectedRouter.use(authMiddleware);
protectedRouter.use(tokenMiddleware);
protectedRouter.use("/users", userRoutes);
app.use(protectedRouter);

// Inicializar conexión con la BD y arrancar el servidor
const PORT: number = 3000;

AppDataSource.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch((error) => console.log(error));
