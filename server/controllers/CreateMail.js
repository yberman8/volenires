import nodeMailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

class AutoMail {
    constructor() { }
    static sendEmail(to, password, serverHost) {
        let transformMail = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: "ybdevltd@gmail.com",
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let details = {
            from: "ybdevltd@gmail.com",
            to: to,
            subject: "אתר חיבורים - ההרשמה בוצעה בהצלחה!",
            text: "תודה שהצטרפתם לאתר חיבורים" + "\n" + "כניסה לאתר: " + serverHost + "\n" + "שם משתמש: " + to + "\n" + "סיסמה: " + password
        }

        transformMail.sendMail(details, (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("success");
            }
        })

    }
}

export default AutoMail;
