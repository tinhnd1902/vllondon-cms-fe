export interface BooleanResponse {
    success: boolean;
    message: string;
}

export interface MetaResponse {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedResponse<T> {
    items: T;
    meta: MetaResponse;
}