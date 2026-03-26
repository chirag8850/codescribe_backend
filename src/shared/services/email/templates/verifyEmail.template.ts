import type { CompiledEmail } from '../email.types.js';
import { baseLayout } from './layouts/base.layout.js';

export const verifyEmailTemplate = (data: Record<string, unknown>): CompiledEmail => {
    const name = String(data['name']);
    const verifyUrl = typeof data['verifyUrl'] === 'string' ? data['verifyUrl'] : '#';

    const body = /* html */ `
        <h1>Verify Your Email, ${name}! ✉️</h1>
        <p>
            Welcome to CodeScribe! To complete your signup and secure your account,
            please verify your email address.
        </p>
        <p>
            This link is valid for 24 hours. Click the button below to verify:
        </p>

        <div class="btn-wrapper">
            <a href="${verifyUrl}" class="btn">Verify Email</a>
        </div>

        <hr class="divider" />

        <p style="font-size:14px; color:#71717a;">
            If you did not sign up for CodeScribe, you can safely ignore this email.
            The link will securely expire in 24 hours.
        </p>
    `;

    return {
        subject: `Verify your CodeScribe account, ${name}`,
        htmlContent: baseLayout(body),
    };
};
