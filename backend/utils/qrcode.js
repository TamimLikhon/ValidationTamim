// pages/api/otp-setup.js
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Parse JSON body manually
  let body = '';
  await new Promise((resolve) => {
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', resolve);
  });

  const { email } = JSON.parse(body);

  const service = 'AppValidation';
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, service, secret);
  const qrCodeDataURL = await QRCode.toDataURL(otpauth);

  return res.status(200).json({
    secret,
    qrCodeDataURL,
  });
}
