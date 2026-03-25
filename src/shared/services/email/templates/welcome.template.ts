import type { CompiledEmail } from '../email.types.js';
import { baseLayout } from './layouts/base.layout.js';

export const welcomeTemplate = (data: Record<string, unknown>): CompiledEmail => {
    const name = String(data['name']);
    const loginUrl = typeof data['loginUrl'] === 'string' ? data['loginUrl'] : '#';

    const body = /* html */ `
        <h1>Welcome to CodeScribe, ${name}! 🎉</h1>
        <p>
            We're thrilled to have you on board. CodeScribe is your AI-powered coding assistant
            — designed to help you write, document, and understand code faster than ever.
        </p>
        <p>
            Your account is all set up and ready to go. Click below to log in and start exploring.
        </p>

        <div class="btn-wrapper">
            <a href="${loginUrl}" class="btn">Get Started</a>
        </div>

        <hr class="divider" />

        <p style="font-size:14px; color:#71717a;">
            If you did not create this account, you can safely ignore this email.
            If you have any questions, reply to this email or contact our support team.
        </p>
    `;

    return {
        subject: `Welcome to CodeScribe, ${name}!`,
        htmlContent: baseLayout(body),
    };
};
