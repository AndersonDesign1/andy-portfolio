'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Validate inputs
    if (!name || !email || !message) {
      return { 
        success: false, 
        message: 'All fields are required' 
      };
    }

    const data = await resend.emails.send({
      from: 'Anderson Joseph <hello@andersonjoseph.com>',
      to: ['josanderson25@gmail.com'],
      reply_to: email,
      subject: `Portfolio Contact: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    if (data.error) {
      return {
        success: false,
        message: data.error.message || 'Failed to send email'
      };
    }

    return { 
      success: true, 
      message: 'Email sent successfully!' 
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to send email'
    };
  }
}