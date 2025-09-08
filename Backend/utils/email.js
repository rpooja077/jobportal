import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const createTransporter = () => {
  // For development, use Gmail SMTP
  // For production, you can use services like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email transporter is ready to send emails");
    console.log("📧 Email configuration:", {
      user: process.env.EMAIL_USER || "",
      service: "gmail",
    });
  } catch (error) {
    console.error("❌ Email transporter verification failed:", error);
  }
};

// Call verification on module load
verifyTransporter();

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, fullname) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification OTP - Job Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Job Portal</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="padding: 30px 20px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullname}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with Job Portal. To complete your registration, please verify your email address using the OTP below:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 18px;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              <strong>Important:</strong> This OTP will expire in 10 minutes. Please enter it in the verification form to complete your registration.
            </p>
            
            <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                <strong>Security Tip:</strong> Never share this OTP with anyone. Job Portal will never ask for your OTP over phone or email.
              </p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">© 2024 Job Portal. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; opacity: 0.7;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, fullname) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to Job Portal - Email Verified!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Welcome to Job Portal!</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Your email has been successfully verified</p>
          </div>
          
          <div style="padding: 30px 20px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullname}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! Your email address has been successfully verified. You can now access all features of Job Portal.
            </p>
            
            <div style="background: white; border: 2px solid #28a745; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h3 style="color: #28a745; margin: 0 0 15px 0;">✅ Email Verification Complete</h3>
              <p style="color: #333; margin: 0;">Your account is now fully activated!</p>
            </div>
            
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h4 style="color: #28a745; margin: 0 0 10px 0;">What's Next?</h4>
              <ul style="color: #333; margin: 0; padding-left: 20px;">
                <li>Complete your profile</li>
                <li>Upload your resume</li>
                <li>Browse and apply for jobs</li>
                <li>Connect with recruiters</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0;">© 2024 Job Portal. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; opacity: 0.7;">Thank you for choosing Job Portal!</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
