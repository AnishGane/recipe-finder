import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import "dotenv/config";
import UserRegistrationEmail from "../email/templates/UserRegistrationEmail";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready ✅");
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Flavorly" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export async function sendRegistrationEmail(userEmail: string, name: string) {
  try {
    const subject = "Welcome to Flavorly! 🎉";

    const html = await render(
      UserRegistrationEmail({
        userName: name,
        userEmail: userEmail,
      }),
    );

    const text = `Hi ${name},\n\nWelcome to Flavorly! Your account has been created successfully.\n\nBest regards,\nThe Flavorly Team`;

    await sendEmail(userEmail, subject, text, html);
    console.log(`✅ Registration email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Failed to send registration email:", error);
    throw error;
  }
}
