import { User } from "../db/entity/user";

// ─── Entity-based types ───────────────────────────────────────────────────────

export type SafeUser = Omit<User, "password">;

export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
};

export type UpdateUserDTO = {
    name?: string;
    email?: string;
    password?: string;
    isVerified?: boolean;
    birthday?: string | null;
};
