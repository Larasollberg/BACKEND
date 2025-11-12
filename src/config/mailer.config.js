
import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'


const createTransporter = () => {
    // Si necesitas asegurarte de que el ambiente se lea justo antes de usarse:
    // **NOTA:** Esto asume que ENVIRONMENT.js ya ha cargado process.env
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENVIRONMENT.GMAIL_USER,
            pass: ENVIRONMENT.GMAIL_PASSWORD // Usará las variables cargadas
        }
    });
};

export default createTransporter







/*const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: ENVIRONMENT.GMAIL_USER,
            pass: ENVIRONMENT.GMAIL_PASSWORD
        },
    /*tls: {
        rejectUnauthorized: false 
        export default transporter
    }*/



