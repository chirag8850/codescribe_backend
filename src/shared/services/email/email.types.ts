export enum EmailType {
    WELCOME = 'WELCOME',
    VERIFY_EMAIL = 'VERIFY_EMAIL',
    LOGIN_OTP = 'LOGIN_OTP',
    RESET_PASSWORD = 'RESET_PASSWORD',
}

export interface EmailRecipient {
    email: string;
    name?: string;
}

export interface EmailPayload {
    type: EmailType;
    to: EmailRecipient[];
    data: Record<string, unknown>;
    bcc?: EmailRecipient[];
}

export interface CompiledEmail {
    subject: string;
    htmlContent: string;
}
