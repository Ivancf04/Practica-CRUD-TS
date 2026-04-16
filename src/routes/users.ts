import { Router, Request, Response } from "express";
import { userService } from "../services/user.service";
import { UpdateUserDTO } from "../utils/user.types";

const router = Router();

// GET /users — Obtiene todos los usuarios (sin passwords)
router.get("/", async (_req: Request, res: Response) => {
    const result = await userService.getAll();
    res.status(result.status).json({ message: result.message, data: result.data });
});

// GET /users/:id — Obtiene un usuario por ID (sin password)
router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params["id"]);
    const result = await userService.getById(id);
    res.status(result.status).json({ message: result.message, data: result.data });
});

// PUT /users/:id — DTO: UpdateUserDTO (todos los campos opcionales)
router.put("/:id", async (req: Request<{ id: string }, {}, UpdateUserDTO>, res: Response) => {
    const id = Number(req.params["id"]);
    const result = await userService.update(id, req.body);
    res.status(result.status).json({ message: result.message, data: result.data });
});

// DELETE /users/:id — Elimina un usuario
router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params["id"]);
    const result = await userService.remove(id);
    res.status(result.status).json({ message: result.message, data: result.data });
});

export default router;