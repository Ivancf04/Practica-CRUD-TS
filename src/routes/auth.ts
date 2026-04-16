import { Router, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { CreateUserDTO } from "../utils/user.types";
import { LoginBody, VerifyBody } from "../utils/auth.types";

const router = Router();

// POST /auth/register — DTO: name, email, password
router.post("/register", async (req: Request<{}, {}, CreateUserDTO>, res: Response) => {
    const result = await authService.register(req.body);
    res.status(result.status).json({ message: result.message, data: result.data });
});

// POST /auth/login — DTO: email, password
router.post("/login", async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(result.status).json({ message: result.message, data: result.data });
});

// POST /auth/verify — DTO: email, code
router.post("/verify", async (req: Request<{}, {}, VerifyBody>, res: Response) => {
    const { email, code } = req.body;
    const result = await authService.verify(email, code);
    res.status(result.status).json({ message: result.message, data: result.data });
});

export default router;
