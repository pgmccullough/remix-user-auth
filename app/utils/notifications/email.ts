import { createTransport } from 'nodemailer'

export type SMTPData = {
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string,
    },        
}

export const emailSender = async (email: {
  from: string,
  to: string, 
  subject: string, 
  text: string, 
  html: string
}) => {
  const smtpData: SMTPData = {
    host: 'localhost',
    port: 4569,
    secure: false,
    auth: {
      user: 'dummy-user',
      pass: 'dummy-password',
    },
  }
  const { from, to, subject, text, html } = email;
  const { sendMail } = createTransport(smtpData)
  console.log(to, subject, text, html)
  try {
    await sendMail({from, to, subject, html})
    console.log("SEND RESPONSE?", "i dunno");
  } catch(error) {
    console.error(error)
  }
}