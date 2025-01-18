'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData) {
  console.log('Server action started'); // Added logging
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    console.log('Form data received:', { name, email, message }); // Added logging

    // Validate inputs
    if (!name || !email || !message) {
      return { 
        success: false, 
        message: 'All fields are required' 
      };
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return {
        success: false,
        message: 'Email service is not properly configured'
      };
    }

    console.log('Attempting to send email...'); // Added logging
    const data = await resend.emails.send({
      from: 'Anderson Joseph <hello@andersonjoseph.com>', // This is the sender
      to: ['hello@andersonjoseph.com'], // Changed to your desired recipient
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

    console.log('Resend response:', data); // Added logging

    if (data.error) {
      console.error('Resend error:', data.error); // Added logging
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