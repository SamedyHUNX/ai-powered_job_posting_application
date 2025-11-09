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

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Password Reset Request</h1>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666;">This link will expire in 1 hour.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
