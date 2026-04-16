export type ServiceResponse<T> = {
    data: T | null;
    message: string;
    status: number;
};
