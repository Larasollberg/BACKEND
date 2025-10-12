import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'


//Configuracion para nuestro mailer

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user:'lsollberg@gmail.com',
            pass: ENVIRONMENT.GMAIL_PASSWORD
        }
    }
)

export default transporter
