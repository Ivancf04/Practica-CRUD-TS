export type LoginBody = {
    email: string;
    password: string;
};

export type VerifyBody = {
    email: string;
    code: string;
};
