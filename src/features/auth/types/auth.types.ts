export interface SignupPayload {
    avatar?: string;
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginWithPasswordPayload {
    identifier: string;
    password: string;
}

export interface SendOtpPayload {
    identifier: string;
}

export interface VerifyOtpPayload {
    identifier: string;
    otp: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    userId: string;
    token: string;
    newPassword: string;
}

export interface ChangePasswordPayload {
    newPassword: string;
}

export interface JwtTokenPayload {
    userId: string;
    role: string;
    email: string;
    username: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        avatar?: string;
        name: string;
        username: string;
        email: string;
        isVerified: boolean;
        role: string;
    };
}
