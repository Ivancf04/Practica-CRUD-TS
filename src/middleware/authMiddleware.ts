import { RequestHandler } from "express";

const authMiddleware: RequestHandler = (req, res, next) => {
    const authorization = req.headers["authorization"];

    if (!authorization || authorization !== "fha5HpDXSXSjKU0QCbdXiz1a") {
        return res.status(401).json({ message: "No autorizado" });
    }

    next();
};

export default authMiddleware;