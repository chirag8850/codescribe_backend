/**
 * Base HTML layout that wraps all email templates.
 * All templates inject their content here via the `body` parameter.
 */
export const baseLayout = (body: string): string => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="x-apple-disable-message-reformatting" />
        <title></title>
        <!--[if mso]>
        <noscript>
            <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
        </noscript>
        <![endif]-->
        <style>
            /* Reset */
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
            body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }

            /* Base */
            body { background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            .email-wrapper { width: 100%; background-color: #f4f4f7; }
            .email-content { max-width: 600px; margin: 0 auto; }

            /* Header */
            .email-header { background-color: #1a1a2e; padding: 32px 40px; text-align: center; border-radius: 8px 8px 0 0; }
            .email-header .logo { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; text-decoration: none; }
            .email-header .logo span { color: #6c63ff; }

            /* Body */
            .email-body { background-color: #ffffff; padding: 40px; border-left: 1px solid #e4e4e7; border-right: 1px solid #e4e4e7; }
            .email-body h1 { color: #1a1a2e; font-size: 24px; font-weight: 700; margin-bottom: 16px; line-height: 1.3; }
            .email-body p { color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .email-body p:last-child { margin-bottom: 0; }

            /* Button */
            .btn-wrapper { text-align: center; margin: 32px 0; }
            .btn { display: inline-block; background-color: #6c63ff; color: #ffffff !important; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 6px; letter-spacing: 0.3px; }
            .btn:hover { background-color: #5a52d5; }

            /* Divider */
            .divider { border: none; border-top: 1px solid #e4e4e7; margin: 24px 0; }

            /* Footer */
            .email-footer { background-color: #f4f4f7; padding: 24px 40px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e4e4e7; border-top: none; }
            .email-footer p { color: #a1a1aa; font-size: 13px; line-height: 1.5; margin-bottom: 8px; }
            .email-footer a { color: #6c63ff; text-decoration: none; }
        </style>
    </head>
  <body>
    <table class="email-wrapper" role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table class="email-content" role="presentation" cellpadding="0" cellspacing="0" width="600">

            <!-- Header -->
            <tr>
              <td class="email-header">
                <a href="#" class="logo">Code<span>Scribe</span></a>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="email-body">
                ${body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="email-footer">
                <p>You received this email because you signed up for <strong>CodeScribe</strong>.</p>
                <p>
                  <a href="#">Privacy Policy</a> &nbsp;&middot;&nbsp;
                  <a href="#">Terms of Service</a>
                </p>
                <p style="margin-top:8px;">&copy; ${new Date().getFullYear()} CodeScribe. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
