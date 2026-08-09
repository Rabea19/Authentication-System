import { MailtrapClient } from "mailtrap";

const createMailtrapClient = () => {
  const apiToken = process.env.MAILTRAP_API_TOKEN;

  const inboxId = Number(process.env.MAILTRAP_INBOX_ID);

  if (!apiToken) {
    throw new Error("MAILTRAP_API_TOKEN is missing");
  }

  if (!Number.isInteger(inboxId) || inboxId <= 0) {
    throw new Error("MAILTRAP_INBOX_ID is invalid");
  }

  const mailtrapClient = new MailtrapClient({
    token: apiToken,
    sandbox: true,
    testInboxId: inboxId,
  });

  return mailtrapClient;
};

export { createMailtrapClient };
