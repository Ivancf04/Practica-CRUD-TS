import { Router, Request, Response } from "express";
import users from "../data/users";
import { User } from "../models/Users";

const router = Router();

// Obtener todos los usuarios
router.get("/", (req: Request, res: Response) => {
    if (users.length === 0) {
        return res.status(404).json({ message: "No hay usuarios disponibles" });
    }

    res.json(users);
});

// Obtener un usuario por ID
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const user = users.find((u: User) => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
});

// Crear un nuevo usuario
router.post("/", (req: Request, res: Response) => {

    const newUser: User = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday
    };

    users.push(newUser);

    res.status(201).json(newUser);
});

// Actualizar un usuario
router.put("/:id", (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const user = users.find((u: User) => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.birthday = req.body.birthday || user.birthday;

    res.json(user);
});

// Eliminar un usuario
router.delete("/:id", (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const index = users.findIndex((u: User) => u.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const deletedUser = users.splice(index, 1);

    res.json({
        message: "Usuario eliminado",
        user: deletedUser
    });
});

export default router;