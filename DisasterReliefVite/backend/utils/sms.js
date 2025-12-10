// utils/sms.js
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSMS(to, message) {
  if (!to) throw new Error('No phone number provided');
  return client.messages.create({
    body: message,
    from: fromNumber,
    to: to.startsWith('+') ? to : `+91${to}` // Default to India country code
  });
}
