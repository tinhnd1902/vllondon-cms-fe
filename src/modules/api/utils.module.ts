export interface BooleanResponse {
    success: boolean;
    message: string;
}

export interface MetaResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T;
    meta: MetaResponse;
}