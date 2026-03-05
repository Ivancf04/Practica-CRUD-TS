import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authorization = req.headers["authorization"];

    if (!authorization || authorization !== "fha5HpDXSXSjKU0QCbdXiz1a") {
        res.status(401).json({
            message: "No autorizado"
        });
        return;
    }

    next();
};

export default authMiddleware;