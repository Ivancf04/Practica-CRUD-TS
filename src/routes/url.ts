import { Router, Request, Response } from "express";
import { urlService } from "../services/url.service";
import { RegisterUrlDTO, UrlIdDTO } from "../utils/url.types";

const router = Router();

// POST /url/register — DTO: email, originalUrl
router.post("/register", async (req: Request<{}, {}, RegisterUrlDTO>, res: Response) => {
    const { email, originalUrl } = req.body;
    const result = await urlService.register(email, originalUrl);
    res.status(result.status).json({ message: result.message, data: result.data });
});

// PUT /url/deactivate — DTO: id
router.put("/deactivate", async (req: Request<{}, {}, UrlIdDTO>, res: Response) => {
    const result = await urlService.deactivate(req.body.id);
    res.status(result.status).json({ message: result.message, data: result.data });
});

// PUT /url/activate — DTO: id
router.put("/activate", async (req: Request<{}, {}, UrlIdDTO>, res: Response) => {
    const result = await urlService.activate(req.body.id);
    res.status(result.status).json({ message: result.message, data: result.data });
});

// GET /url/:shortUrl — Redirige a la URL original si está activa
// Va al final para que los PUT específicos no sean capturados por el wildcard
router.get("/:shortUrl", async (req: Request, res: Response) => {
    const shortUrl = req.params["shortUrl"] as string;
    const result = await urlService.getByShortUrl(shortUrl);

    if (result.status !== 200 || !result.data) {
        return res.status(result.status).json({ message: result.message });
    }

    res.redirect(result.data.originalUrl);
});

export default router;
