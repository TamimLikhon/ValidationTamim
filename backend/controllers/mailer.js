import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.DEV_MAIL,
		pass: process.env.DEV_MAIL_PASSWORD,
	},
});

export default transport;
