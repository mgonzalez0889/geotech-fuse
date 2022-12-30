export interface ApiResponseInterface<T> {
    code: number;
    data: T;
    message: string;
    status: boolean;
}
