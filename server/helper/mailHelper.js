const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const sendOtpMail = async ({ otp, email }) => {
    try {
        const config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        };
        const transport = nodemailer.createTransport(config);
        const MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: "Mailgen",
                link: 'https://mailgen.js/'
            }
        });
        const responsePage = {
            body: {
                name: "OTP Verification",
                intro: `Dear User,
    
                    Your security is our utmost concern. To ensure the safety of your account, we kindly request you to verify your email address,
                    Your OTP : `+ otp + `
                    Please note that the verification OTP is only valid for the next 5 minutes for security reasons. If you don't complete the process within this time frame, you may need to request another email.`,
                outro: "Thank you for choosing us, and we appreciate your trust in our services"
            }
        };

        const mail = MailGenerator.generate(responsePage);

        const message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP Verification',
            html: mail
        };
        await transport.sendMail(message);
        console.log('success');
        return { status: "ok" };
    } catch (error) {
        console.log(error)
        return { status: "error", message: error?.message };
    }
};

const sendResetPasswordMail= async (request, email, token) => {
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    };
    const transport = nodemailer.createTransport(config);
    const MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: "Mailgen",
            link: 'https://mailgen.js/'
        }
    });
    const responsePage = {
        body: {
            name: "Email Conformation Success!",
            intro: `Dear User,

            Your security is our utmost concern. To ensure the safety of your account, we kindly request you to verify your email address and reset your password using the following steps:
            Click the below button. 
            You will be directed to a secure page where you can confirm your email address.
            After email verification, you'll be prompted to set a new password for your account.
            
            Please note that the verification link is only valid for the next 10 minutes for security reasons. If you don't complete the process within this time frame, you may need to request another email.`,
            action: {
                button: {
                    color: '#22BC66',
                    text: 'Change Your Password',
                    link: `http://localhost:5173/auth/reset_password?token=${token}`
                }
            },
            outro: "Thank you for choosing us, and we appreciate your trust in our services"
        }
    };
    const mail = MailGenerator.generate(responsePage);
    const message = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Password',
        html: mail
    };
    try {
        await transport.sendMail(message);
        return { status: "ok" };
    } catch (error) {
        return { status: "error", message: error?.message };
    }
};

module.exports = { sendOtpMail, sendResetPasswordMail }