import express, { Application } from "express";

import authMiddleware from "./middleware/authMiddleware";
import tokenMiddleware from "./middleware/tokenMiddleware";
import userRoutes from "./routes/users";

const app: Application = express();

app.use(express.json());

// Middleware de autenticación y token
app.use(authMiddleware);
app.use(tokenMiddleware);

// Rutas
app.use("/users", userRoutes);

// Iniciar servidor
const PORT: number = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});