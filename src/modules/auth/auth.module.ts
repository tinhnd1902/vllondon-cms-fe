export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}