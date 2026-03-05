import { RequestHandler } from "express";

const tokenMiddleware: RequestHandler = (req, res, next) => {
    if (req.method !== "GET") {
        const token = req.headers["token"];

        if (!token || token !== "HIZe4D32twWOUP9h0I1IVTlr") {
            return res.status(403).json({
                message: "Token invalido o no proporcionado"
            });
        }
    }

    next();
};

export default tokenMiddleware;