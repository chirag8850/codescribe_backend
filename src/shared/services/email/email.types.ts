export enum EmailType {
    WELCOME = 'WELCOME',
    VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export interface EmailRecipient {
    email: string;
    name?: string;
}

export interface EmailPayload {
    type: EmailType;
    to: EmailRecipient;
    data: Record<string, unknown>;
}

export interface CompiledEmail {
    subject: string;
    htmlContent: string;
}
