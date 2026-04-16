import { UserData } from "../db/UserData";
import { SafeUser, UpdateUserDTO } from "../utils/user.types";
import { ServiceResponse } from "../utils/service.types";

export const userService = {

    // Obtiene todos los usuarios sin exponer passwords
    async getAll(): Promise<ServiceResponse<SafeUser[]>> {
        try {
            const users = await UserData.find();

            if (users.length === 0) {
                return { data: [], message: "No hay usuarios disponibles", status: 404 };
            }

            const safeUsers = users.map(({ password, ...u }) => u as SafeUser);
            return { data: safeUsers, message: "Usuarios obtenidos", status: 200 };
        } catch {
            return { data: null, message: "Error al obtener los usuarios", status: 500 };
        }
    },

    // Obtiene un usuario por ID sin exponer password
    async getById(id: number): Promise<ServiceResponse<SafeUser>> {
        try {
            const user = await UserData.findOneBy({ id });
            if (!user) {
                return { data: null, message: "Usuario no encontrado", status: 404 };
            }

            const { password, ...safeUser } = user;
            return { data: safeUser as SafeUser, message: "Usuario obtenido", status: 200 };
        } catch {
            return { data: null, message: "Error al obtener el usuario", status: 500 };
        }
    },

    // Actualiza un usuario. Valida unicidad de email si cambia
    async update(id: number, dto: UpdateUserDTO): Promise<ServiceResponse<SafeUser>> {
        try {
            const user = await UserData.findOneBy({ id });
            if (!user) {
                return { data: null, message: "Usuario no encontrado", status: 404 };
            }

            if (dto.email && dto.email !== user.email) {
                const emailTaken = await UserData.findOneBy({ email: dto.email });
                if (emailTaken) {
                    return { data: null, message: "El email ya está en uso", status: 409 };
                }
            }

            UserData.merge(user, dto);
            const saved = await UserData.save(user);
            const { password, ...safeUser } = saved;

            return { data: safeUser as SafeUser, message: "Usuario actualizado", status: 200 };
        } catch {
            return { data: null, message: "Error al actualizar el usuario", status: 500 };
        }
    },

    // Elimina un usuario y retorna sus datos sin password
    async remove(id: number): Promise<ServiceResponse<SafeUser>> {
        try {
            const user = await UserData.findOneBy({ id });
            if (!user) {
                return { data: null, message: "Usuario no encontrado", status: 404 };
            }

            await UserData.remove(user);
            const { password, ...safeUser } = user;

            return { data: safeUser as SafeUser, message: "Usuario eliminado", status: 200 };
        } catch {
            return { data: null, message: "Error al eliminar el usuario", status: 500 };
        }
    },
};
