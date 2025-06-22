"use client";
import axios from 'axios';
import { ApiResponse,  } from '@/modules/api/api.module';
import { ApiErrorResponse } from '@/modules/api/api.module';
import useAppRouter from '@/hooks/useAppRouter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const baseAxios = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

baseAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

baseAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            useAppRouter().goToLogin();
            // window.location.href = '/login';
            useAppRouter().logout();
        }
        return Promise.reject(error);
    }
);

const handlerResponse = (response: any) => {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    }
    console.error(`[BaseService] --> Error: ${response.message}`, response);
    throw new ApiErrorResponse(response.statusCode, response.message);
}

const buildUrlWithParams = (url: string, params?: Record<string, any>) => {
    if (!params || Object.keys(params).length === 0) return url;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
}

const GET = async <T>(url: string, params?: any) => {
    try {
        const fullUrl = buildUrlWithParams(url, params);        
        const response = await baseAxios.get<ApiResponse<T>>(fullUrl);
        return handlerResponse(response)
    } catch (err) {
        throw new ApiErrorResponse(500, '[BaseService] --> GET: An error occurred', err);
    }
}

const POST = async <T>(url: string, payload?: any) => {
    try {
        const response = await baseAxios.post<ApiResponse<T>>(`${url}`, payload);
        return handlerResponse(response)
    } catch (err) {
        throw new ApiErrorResponse(500, '[BaseService] --> POST: An error occurred', err);
    }
}

const PUT = async <T>(url: string, payload?: any) => {
    try {
        const response = await baseAxios.put<ApiResponse<T>>(`${url}`, payload);
        return handlerResponse(response)
    } catch (err) {
        throw new ApiErrorResponse(500, '[BaseService] --> PUT: An error occurred', err);
    }
}

const PATCH = async <T>(url: string, payload?: any) => {
    try {
        const response = await baseAxios.patch<ApiResponse<T>>(`${url}`, payload);
        return handlerResponse(response)
    } catch (err) {
        throw new ApiErrorResponse(500, '[BaseService] --> PATCH: An error occurred', err);
    }
}

const DELETE = async <T>(url: string, payload?: any) => {
    try {
        const response = await baseAxios.delete<ApiResponse<T>>(`${url}`, payload);
        return handlerResponse(response)
    } catch (err) {
        throw new ApiErrorResponse(500, '[BaseService] --> DELETE: An error occurred', err);
    }
}

const BaseAPI = {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
};

export default BaseAPI;