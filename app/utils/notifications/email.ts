export const sendEmail = async (
    to: string, 
    htmlBody: string, 
    textBody?: string, 
    cc?: string,
    bcc?: string,
) => {
    console.log(to, htmlBody, textBody, cc, bcc);
}