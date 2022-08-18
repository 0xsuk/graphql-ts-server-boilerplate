import * as nodemailer from "nodemailer";
export const sendEmail = async (
  recipient: string,
  subject: string,
  text: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailContents = {
    from: process.env.GMAIL_EMAIL,
    to: recipient,
    subject,
    text,
  };

  transporter.sendMail(mailContents, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("email sent to", recipient);
  });
};
