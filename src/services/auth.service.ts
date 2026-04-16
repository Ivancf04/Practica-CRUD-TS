import * as bcrypt from "bcryptjs";
import { UserData } from "../db/UserData";
import { CreateUserDTO, SafeUser } from "../utils/user.types";
import { ServiceResponse } from "../utils/service.types";

const SALT_ROUNDS = 10;

export const authService = {

    // Registra un nuevo usuario con contraseña encriptada y código de verificación
    async register(dto: CreateUserDTO): Promise<ServiceResponse<SafeUser>> {
        try {
            const existing = await UserData.findOneBy({ email: dto.email });
            if (existing) {
                return { data: null, message: "El email ya está registrado", status: 409 };
            }

            const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            const user = UserData.create({
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                isVerified: false,
                verificationCode,
            });

            const saved = await UserData.save(user);
            const { password, ...safeUser } = saved;

            return {
                data: safeUser as SafeUser,
                message: `Usuario registrado. Código de verificación: ${verificationCode}`,
                status: 201,
            };
        } catch {
            return { data: null, message: "Error al registrar el usuario", status: 500 };
        }
    },

    // Valida credenciales y que el usuario esté verificado
    async login(email: string, password: string): Promise<ServiceResponse<SafeUser>> {
        try {
            const user = await UserData.findOneBy({ email });
            if (!user) {
                return { data: null, message: "Usuario no encontrado", status: 404 };
            }

            if (!user.isVerified) {
                return { data: null, message: "El usuario no ha verificado su cuenta", status: 403 };
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return { data: null, message: "Contraseña incorrecta", status: 401 };
            }

            const { password: _, ...safeUser } = user;
            return { data: safeUser as SafeUser, message: "Usuario válido", status: 200 };
        } catch {
            return { data: null, message: "Error al iniciar sesión", status: 500 };
        }
    },

    // Verifica el código de 6 dígitos y activa la cuenta
    async verify(email: string, code: string): Promise<ServiceResponse<SafeUser>> {
        try {
            const user = await UserData.findOneBy({ email });
            if (!user) {
                return { data: null, message: "Usuario no encontrado", status: 404 };
            }

            if (user.isVerified) {
                return { data: null, message: "El usuario ya está verificado", status: 400 };
            }

            if (user.verificationCode !== code) {
                return { data: null, message: "Código de verificación incorrecto", status: 400 };
            }

            user.isVerified = true;
            user.verificationCode = null;

            const saved = await UserData.save(user);
            const { password, ...safeUser } = saved;

            return { data: safeUser as SafeUser, message: "Cuenta verificada correctamente", status: 200 };
        } catch {
            return { data: null, message: "Error al verificar la cuenta", status: 500 };
        }
    },
};
