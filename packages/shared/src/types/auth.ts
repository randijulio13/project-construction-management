export interface UserSession {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: UserSession;
}
