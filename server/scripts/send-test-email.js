import "dotenv/config";

import { sendVerificationEmail } from "../services/email.service.js";

const sendTestEmail = async () => {
  try {
    console.log("Sending test email through Mailtrap API...");

    const result = await sendVerificationEmail({
      to: "rabea@example.com",
      code: "012345",
    });

    console.log("Test email sent successfully:", result);
  } catch (error) {
    console.error("Test email failed:", {
      name: error.name,
      message: error.message,
      status: error.status,
      response: error.response,
    });

    process.exitCode = 1;
  }
};

sendTestEmail();
