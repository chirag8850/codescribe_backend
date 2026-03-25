import type { CompiledEmail, EmailPayload } from '../../email.types.js';
import { EmailType } from '../../email.types.js';
import { welcomeTemplate } from '../welcome.template.js';

const templates: Record<EmailType, (data: Record<string, unknown>) => CompiledEmail> = {
    [EmailType.WELCOME]: welcomeTemplate,
};

export const loadTemplate = (payload: EmailPayload): CompiledEmail =>
    templates[payload.type](payload.data);
