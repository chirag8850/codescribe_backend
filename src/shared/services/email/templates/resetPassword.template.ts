import type { CompiledEmail } from '../email.types.js';
import { baseLayout } from './layouts/base.layout.js';

export const resetPasswordTemplate = (data: Record<string, unknown>): CompiledEmail => {
    const name = String(data['name']);
    const resetUrl = typeof data['resetUrl'] === 'string' ? data['resetUrl'] : '#';

    const body = /* html */ `
        <h1>Reset Your Password, ${name}! 🔑</h1>
        <p>
            We received a request to reset the password for your CodeScribe account.
            Click the button below to set a new password.
        </p>
        <p>
            This link is valid for 1 hour. If it expires, you can request a new one.
        </p>

        <div class="btn-wrapper">
            <a href="${resetUrl}" class="btn">Reset Password</a>
        </div>

        <hr class="divider" />

        <p style="font-size:14px; color:#71717a;">
            If you did not request a password reset, you can safely ignore this email.
            Your password will remain unchanged.
        </p>
    `;

    return {
        subject: `Reset your CodeScribe password, ${name}`,
        htmlContent: baseLayout(body),
    };
};
