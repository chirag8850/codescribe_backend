import { BrevoClient } from '@getbrevo/brevo';
import { config } from '@/shared/config/config.js';
import logger from '@/shared/utils/logger.js';
import { loadTemplate } from './templates/loaders/template.loader.js';
import type { EmailPayload } from './email.types.js';

class EmailService {
    private readonly client: BrevoClient;

    constructor() {
        this.client = new BrevoClient({
            apiKey: config.email.brevoApiKey,
            maxRetries: 2,
            timeoutInSeconds: 30,
        });
    }

    async send(payload: EmailPayload): Promise<void> {
        const compiled = loadTemplate(payload);

        try {
            await this.client.transactionalEmails.sendTransacEmail({
                sender: { email: config.email.senderEmail, name: config.email.senderName },
                to: payload.to,
                subject: compiled.subject,
                htmlContent: compiled.htmlContent,
                bcc: [{ email: config.email.bccLogEmail, name: config.email.bccLogName }],
            });

            const recipientEmails = payload.to.map((r) => r.email).join(', ');
            logger.info(`Email sent [${payload.type}] to ${recipientEmails}`);
        } catch (err) {
            logger.error(`Email send failed [${payload.type}]`, { error: err });
        }
    }
}

export const emailService = new EmailService();
