import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      ...options,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  await sendEmail({
    to: email,
    subject: 'Verify your email',
    text: `Please verify your email by clicking this link: ${verificationUrl}`,
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    text: `Please reset your password by clicking this link: ${resetUrl}`,
    html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `,
  });
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Welcome to Pet Care Platform',
    text: `Welcome ${name} to our pet care platform!`,
    html: `
      <h1>Welcome to Pet Care Platform</h1>
      <p>Dear ${name},</p>
      <p>Thank you for joining our pet care platform. We're excited to help you take care of your pets!</p>
      <p>You can now:</p>
      <ul>
        <li>Add your pets to your profile</li>
        <li>Book pet care services</li>
        <li>Track your pet's health records</li>
        <li>And much more!</li>
      </ul>
    `,
  });
}; 