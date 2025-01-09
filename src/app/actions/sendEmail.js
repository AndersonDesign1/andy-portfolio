'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  try {
    const data = await resend.emails.send({
      from: 'Your Name <hello@andersonjoseph.com>', // Updated from address
      to: ['josanderson25@gmail.com'], // Updated to address
      subject: `New message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
      `
    });
    console.log(data);
    return { success: true, message: 'Email sent successfully!' }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email. Please try again.' }
  }
}
