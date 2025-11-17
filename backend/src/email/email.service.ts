import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string, acceptLanguage: string) {
    console.log('diddy', acceptLanguage);
    // Email translations
    const translations = {
      en: {
        subject: 'Welcome to JobXHub!',
        greeting: 'Welcome',
        message:
          "We're thrilled to have you join us. Let us know if you need anything.",
        signOff: 'Cheers,<br>The Team',
      },
      kh: {
        subject: 'សូមស្វាគមន៍មកកាន់ JobXHub!',
        greeting: 'សូមស្វាគមន៍',
        message:
          'យើងរីករាយណាស់ដែលបានស្វាគមន៍អ្នក។ សូមប្រាប់យើងប្រសិនបើអ្នកត្រូវការអ្វីមួយ។',
        signOff: 'សូមគោរព,<br>ក្រុមការងារ',
      },
      de: {
        subject: 'Willkommen bei JobXHub!',
        greeting: 'Willkommen',
        message:
          'Wir freuen uns sehr, dass Sie bei uns sind. Lassen Sie uns wissen, wenn Sie etwas benötigen.',
        signOff: 'Mit freundlichen Grüßen,<br>Das Team',
      },
    };

    // Default to English if locale not found
    const content =
      translations[acceptLanguage as keyof typeof translations] ||
      translations.en;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: content.subject,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${content.greeting}, ${name}!</h1>
        <p>${content.message}</p>
        <p style="color: #666;">${content.signOff}</p>
      </div>
    `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    acceptLanguage: string,
  ) {
    const translations = {
      en: {
        subject: 'Password Reset Request',
        title: 'Password Reset Request',
        message:
          'You requested a password reset. Click the button below to reset your password:',
        button: 'Reset Password',
        expiry: 'This link will expire in 15 minutes',
        ignore: "If you didn't request this, please ignore this email.",
        fallback:
          "If the button doesn't work, copy and paste this link into your browser:",
      },
      kh: {
        subject: 'ការស្នើសុំកំណត់ពាក្យសម្ងាត់ឡើងវិញ',
        title: 'ការស្នើសុំកំណត់ពាក្យសម្ងាត់ឡើងវិញ',
        message: `អ្នកបានស្នើសុំកំណត់ពាក្យសម្ងាត់ឡើងវិញ។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីកំណត់ពាក្យសម្ងាត់របស់អ្នកឡើងវិញ៖ ${resetUrl}`,
        button: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
        expiry: 'តំណនេះនឹងផុតកំណត់ក្នុងរយៈពេល 15 នាទី',
        ignore: 'ប្រសិនបើអ្នកមិនបានស្នើសុំនេះទេ សូមអើពើអ៊ីមែលនេះ។',
        fallback:
          'ប្រសិនបើប៊ូតុងមិនដំណើរការទេ សូមចម្លងនិងដាក់តំណនេះទៅក្នុងកម្មវិធីរុករករបស់អ្នក៖',
      },
      de: {
        subject: 'Anfrage zum Zurücksetzen des Passworts',
        title: 'Anfrage zum Zurücksetzen des Passworts',
        message:
          'Sie haben das Zurücksetzen Ihres Passworts angefordert. Klicken Sie auf die Schaltfläche unten, um Ihr Passwort zurückzusetzen:',
        button: 'Passwort zurücksetzen',
        expiry: 'Dieser Link läuft in 15 Minuten ab.',
        ignore:
          'Wenn Sie dies nicht angefordert haben, ignorieren Sie bitte diese E-Mail.',
        fallback:
          'Wenn die Schaltfläche nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:',
      },
    };

    const lang = translations[acceptLanguage] || translations.en;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: lang.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${lang.title}</h1>
          <p>${lang.message}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              ${lang.button}
            </a>
          </div>
          <p style="color: #666;">${lang.expiry}</p>
          <p style="color: #666;">${lang.ignore}</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            ${lang.fallback}<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
