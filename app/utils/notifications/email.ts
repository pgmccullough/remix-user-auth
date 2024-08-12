import { createTransport } from 'nodemailer';

export type SMTPData = {
    service: string,
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string,
    },        
}

export const sendEmail = async (
  from: string,
  to: string, 
  subject: string, 
  text: string, 
  html: string,
  smtpData: SMTPData
) => {
  const { sendMail } = createTransport(smtpData)
  console.log(to, subject, text, html);
  try {
    await sendMail({from, to, subject, html})
  } catch(error) {
    console.error(error);
  }
}