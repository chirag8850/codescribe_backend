import type { CompiledEmail, EmailPayload } from '../../email.types.js';
import { EmailType } from '../../email.types.js';
import { welcomeTemplate } from '../welcome.template.js';
import { verifyEmailTemplate } from '../verifyEmail.template.js';

const templates: Record<EmailType, (data: Record<string, unknown>) => CompiledEmail> = {
    [EmailType.WELCOME]: welcomeTemplate,
    [EmailType.VERIFY_EMAIL]: verifyEmailTemplate,
};

export const loadTemplate = (payload: EmailPayload): CompiledEmail =>
    templates[payload.type](payload.data);
