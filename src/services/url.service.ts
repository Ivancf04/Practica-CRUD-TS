import crypto from "crypto";
import { UrlData } from "../db/UrlData";
import { UserData } from "../db/UserData";
import { Url } from "../db/entity/Url";
import { ServiceResponse } from "../utils/service.types";

// Genera un código corto aleatorio de 6 caracteres (base64url)
function generateShortCode(): string {
    return crypto.randomBytes(4).toString("base64url").slice(0, 6);
}

// Reintenta hasta 10 veces para evitar colisiones de hash
async function createUniqueShortUrl(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt++) {
        const shortUrl = generateShortCode();
        const existing = await UrlData.findOneBy({ shortUrl });
        if (!existing) return shortUrl;
    }
    throw new Error("No se pudo generar una URL corta única. Intenta de nuevo.");
}

export const urlService = {

    // Registra una nueva URL corta vinculada al usuario por email
    async register(email: string, originalUrl: string): Promise<ServiceResponse<Url>> {
        try {
            const user = await UserData.findOneBy({ email });
            if (!user) {
                return { data: null, message: "Usuario no encontrado", status: 404 };
            }

            const shortUrl = await createUniqueShortUrl();
            const newUrl = UrlData.create({ originalUrl, shortUrl, isActive: true, user });
            const saved = await UrlData.save(newUrl);

            return { data: saved, message: "URL registrada", status: 201 };
        } catch {
            return { data: null, message: "Error al registrar la URL", status: 500 };
        }
    },

    // Busca una URL por su código corto y verifica que esté activa
    async getByShortUrl(shortUrl: string): Promise<ServiceResponse<Url>> {
        try {
            const url = await UrlData.findOneBy({ shortUrl });
            if (!url) {
                return { data: null, message: "URL no encontrada", status: 404 };
            }

            if (!url.isActive) {
                return { data: null, message: "Esta URL ha sido desactivada", status: 410 };
            }

            return { data: url, message: "URL encontrada", status: 200 };
        } catch {
            return { data: null, message: "Error al consultar la URL", status: 500 };
        }
    },

    // Desactiva una URL por ID
    async deactivate(id: number): Promise<ServiceResponse<Url>> {
        try {
            const url = await UrlData.findOneBy({ id });
            if (!url) return { data: null, message: "URL no encontrada", status: 404 };
            if (!url.isActive) return { data: null, message: "La URL ya está desactivada", status: 400 };

            url.isActive = false;
            const saved = await UrlData.save(url);
            return { data: saved, message: "URL desactivada", status: 200 };
        } catch {
            return { data: null, message: "Error al desactivar la URL", status: 500 };
        }
    },

    // Activa una URL por ID
    async activate(id: number): Promise<ServiceResponse<Url>> {
        try {
            const url = await UrlData.findOneBy({ id });
            if (!url) return { data: null, message: "URL no encontrada", status: 404 };
            if (url.isActive) return { data: null, message: "La URL ya está activa", status: 400 };

            url.isActive = true;
            const saved = await UrlData.save(url);
            return { data: saved, message: "URL activada", status: 200 };
        } catch {
            return { data: null, message: "Error al activar la URL", status: 500 };
        }
    },
};
