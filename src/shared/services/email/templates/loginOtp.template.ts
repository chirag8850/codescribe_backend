import type { CompiledEmail } from '../email.types.js';
import { baseLayout } from './layouts/base.layout.js';

export const loginOtpTemplate = (data: Record<string, unknown>): CompiledEmail => {
    const name = String(data['name']);
    const otp = String(data['otp']);

    const body = /* html */ `
        <h1>Your Login Code, ${name}! 🔐</h1>
        <p>
            Use the code below to log in to your CodeScribe account.
            This code is valid for 5 minutes.
        </p>

        <div style="text-align:center; margin:32px 0;">
            <span style="
                display:inline-block;
                font-size:32px;
                font-weight:700;
                letter-spacing:8px;
                color:#1a1a2e;
                background-color:#f4f4f7;
                padding:16px 32px;
                border-radius:8px;
                border:2px dashed #6c63ff;
            ">${otp}</span>
        </div>

        <hr class="divider" />

        <p style="font-size:14px; color:#71717a;">
            If you did not request this code, you can safely ignore this email.
            Someone may have entered your email address by mistake.
        </p>
    `;

    return {
        subject: `${otp} is your CodeScribe login code`,
        htmlContent: baseLayout(body),
    };
};
