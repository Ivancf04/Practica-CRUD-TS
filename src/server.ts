import express, { Application } from "express";

import authMiddleware from "./middleware/authMiddleware";
import tokenMiddleware from "./middleware/tokenMiddleware";
import userRoutes from "./routes/users";

const app: Application = express();

app.use(express.json());

// Middleware de autenticación y token para proteger las rutas. El middleware de autenticación verifica que el header "authorization" tenga el valor correcto, mientras que el middleware de token verifica que el header "token" tenga el valor correcto para métodos que no sean GET. Si alguna de las validaciones falla, se devuelve un error con el mensaje correspondiente.
app.use(authMiddleware);
app.use(tokenMiddleware);

// Manjeo de rutas para usuarios. Todas las rutas relacionadas con usuarios estarán protegidas por los middlewares de autenticación y token, lo que garantiza que solo los usuarios autorizados puedan acceder a estas rutas.
app.use("/users", userRoutes);

// Aqui se inicializa el servidor y despues de correrlo se muestra un mensaje en la consola indicando que el servidor esta corriendo y en que puerto se encuentra disponible. En este caso, el puerto es el 3000.
const PORT: number = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});