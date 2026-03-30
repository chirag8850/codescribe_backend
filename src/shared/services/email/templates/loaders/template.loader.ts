import type { CompiledEmail, EmailPayload } from '../../email.types.js';
import { EmailType } from '../../email.types.js';
import { welcomeTemplate } from '../welcome.template.js';
import { verifyEmailTemplate } from '../verifyEmail.template.js';
import { loginOtpTemplate } from '../loginOtp.template.js';
import { resetPasswordTemplate } from '../resetPassword.template.js';

const templates: Record<EmailType, (data: Record<string, unknown>) => CompiledEmail> = {
    [EmailType.WELCOME]: welcomeTemplate,
    [EmailType.VERIFY_EMAIL]: verifyEmailTemplate,
    [EmailType.LOGIN_OTP]: loginOtpTemplate,
    [EmailType.RESET_PASSWORD]: resetPasswordTemplate,
};

export const loadTemplate = (payload: EmailPayload): CompiledEmail => templates[payload.type](payload.data);
