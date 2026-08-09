import { createMailtrapClient } from "../config/mailtrap.js";

const sendVerificationEmail = async ({ to, code }, client) => {
  const mailClient = client ?? createMailtrapClient();

  const fromName = process.env.EMAIL_FROM_NAME || "Authentication System";

  const fromAddress = process.env.EMAIL_FROM_ADDRESS || "no-reply@example.com";

  const message = {
    from: {
      name: fromName,
      email: fromAddress,
    },

    to: [
      {
        email: to,
      },
    ],

    subject: "Verify your email address",

    text: `Your verification code is ${code}. ` + "It expires in 10 minutes.",

    html: `
      <div>
        <h2>Verify your email address</h2>

        <p>Your verification code is:</p>

        <p>
          <strong style="font-size: 24px;">
            ${code}
          </strong>
        </p>

        <p>
          This code expires in 10 minutes.
        </p>
      </div>
    `,
  };

  const result = await mailClient.send(message);

  return result;
};

const sendPasswordResetEmail = async ({ to, token }, client) => {
  const mailClient = client ?? createMailtrapClient();

  const fromName = process.env.EMAIL_FROM_NAME || "Authentication System";

  const fromAddress = process.env.EMAIL_FROM_ADDRESS || "no-reply@example.com";

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const resetUrl =
    `${clientUrl}/reset-password` + `?token=${encodeURIComponent(token)}`;

  const message = {
    from: {
      name: fromName,
      email: fromAddress,
    },

    to: [
      {
        email: to,
      },
    ],

    subject: "Reset your password",

    text:
      "We received a request to reset " +
      "your password.\n\n" +
      `Reset your password here: ${resetUrl}\n\n` +
      "This link expires in 15 minutes.",

    html: `
        <div>
          <h2>Reset your password</h2>

          <p>
            We received a request to reset
            your password.
          </p>

          <p>
            <a href="${resetUrl}">
              Reset Password
            </a>
          </p>

          <p>
            This link expires in
            15 minutes.
          </p>

          <p>
            If you did not request this,
            you can ignore this email.
          </p>
        </div>
      `,
  };

  const result = await mailClient.send(message);

  return result;
};

export { sendVerificationEmail, sendPasswordResetEmail };
