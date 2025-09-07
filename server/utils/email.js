const nodemailer = require('nodemailer');
const { logger } = require('./logger');

// Create transporter
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    // Use SendGrid
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (process.env.SMTP_HOST) {
    // Use SMTP
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Use Ethereal for development
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@adultplatform.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

// Email templates
const emailTemplates = {
  welcome: (username) => ({
    subject: 'Welcome to AdultPlatform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Welcome to AdultPlatform!</h1>
        <p>Hi ${username},</p>
        <p>Welcome to our platform! We're excited to have you join our community.</p>
        <p>Get started by exploring content from our verified creators.</p>
        <p>Best regards,<br>The AdultPlatform Team</p>
      </div>
    `
  }),

  emailVerification: (username, verificationUrl) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Verify Your Email</h1>
        <p>Hi ${username},</p>
        <p>Please click the button below to verify your email address:</p>
        <p>
          <a href="${verificationUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The AdultPlatform Team</p>
      </div>
    `
  }),

  passwordReset: (username, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Reset Your Password</h1>
        <p>Hi ${username},</p>
        <p>You requested a password reset. Click the button below to create a new password:</p>
        <p>
          <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The AdultPlatform Team</p>
      </div>
    `
  }),

  subscriptionConfirmation: (username, creatorName, tier) => ({
    subject: 'Subscription Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Subscription Confirmed!</h1>
        <p>Hi ${username},</p>
        <p>Your ${tier} subscription to ${creatorName} has been confirmed!</p>
        <p>You now have access to their exclusive content.</p>
        <p>Enjoy your subscription!</p>
        <p>Best regards,<br>The AdultPlatform Team</p>
      </div>
    `
  }),

  contentApproved: (username, contentTitle) => ({
    subject: 'Content Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Content Approved!</h1>
        <p>Hi ${username},</p>
        <p>Your content "${contentTitle}" has been approved and is now live on the platform!</p>
        <p>Keep creating amazing content for your audience.</p>
        <p>Best regards,<br>The AdultPlatform Team</p>
      </div>
    `
  }),

  contentRejected: (username, contentTitle, reason) => ({
    subject: 'Content Requires Review',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Content Requires Review</h1>
        <p>Hi ${username},</p>
        <p>Your content "${contentTitle}" requires some adjustments before it can be published.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please make the necessary changes and resubmit your content.</p>
        <p>Best regards,<br>The AdultPlatform Team</p>
      </div>
    `
  })
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  const template = emailTemplates.welcome(username);
  return sendEmail({
    to: email,
    ...template
  });
};

// Send email verification
const sendEmailVerification = async (email, username, verificationUrl) => {
  const template = emailTemplates.emailVerification(username, verificationUrl);
  return sendEmail({
    to: email,
    ...template
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, username, resetUrl) => {
  const template = emailTemplates.passwordReset(username, resetUrl);
  return sendEmail({
    to: email,
    ...template
  });
};

// Send subscription confirmation
const sendSubscriptionConfirmation = async (email, username, creatorName, tier) => {
  const template = emailTemplates.subscriptionConfirmation(username, creatorName, tier);
  return sendEmail({
    to: email,
    ...template
  });
};

// Send content moderation emails
const sendContentApproved = async (email, username, contentTitle) => {
  const template = emailTemplates.contentApproved(username, contentTitle);
  return sendEmail({
    to: email,
    ...template
  });
};

const sendContentRejected = async (email, username, contentTitle, reason) => {
  const template = emailTemplates.contentRejected(username, contentTitle, reason);
  return sendEmail({
    to: email,
    ...template
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSubscriptionConfirmation,
  sendContentApproved,
  sendContentRejected
};