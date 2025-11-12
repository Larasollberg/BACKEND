/*import transporter from "../config/mailer.config.js"
import UserRepository from "../repositories/user.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ENVIRONMENT from "../config/environment.config.js"*/

/*class AuthService {
    static async register(name, email, password) {
        console.log(name, email, password)

        const user = await UserRepository.getByEmail(email)
        
        if (user) {
            throw new ServerError(400, 'Email ya en uso')
        }

        
        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.createUser(name, email, password_hashed)
        const user_id_created = user_created._id
        
        const verification_token = jwt.sign(
            { user_id: user_id_created },
            ENVIRONMENT.JWT_SECRET_KEY
            
        )
        //Enviar un mail de verificacion
        await transporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: email,
            subject: 'Verificacion de correo electronico',
            html: `
            <h1>¡Bienvenido!</h1>
            <p>Haz click en el enlace para verificar tu email</p>
            <a href='${ENVIRONMENT.URL_API_BACKEND}/verify-email/${verification_token}'>Verificar email</a>
            `
        })
        
        return
    }


    static async verifyEmail(verification_token){
        try{
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)
            
            const {user_id} = payload 
            if(!user_id){
                throw new ServerError (400, 'Accion denegada, token con datos insuficientes')
            }
            const user_found = await UserRepository.getById(user_id)
            if(!user_found){
                throw new ServerError(404, 'Usuario inexistente')
            }
            if(user_found.verified_email){
                throw new ServerError (400, 'Usuario ya validado')
            }

            await UserRepository.updateById(user_id, {verified_email: true})

            return 

        }
        catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                throw new  ServerError(400, 'Token invalido')
            }
            throw error
        }
    }

    static async login(email, password){

        const user = await UserRepository.getByEmail(email)
        if(!user){
            throw new ServerError(404, 'Email no registrado')
        }
        if(user.verified_email === false){
            throw new ServerError(401, 'Email no verificado')
        }
        
        const is_same_password = await bcrypt.compare(password, user_found.password)
        if(!is_same_password){
            throw new ServerError(401, 'Contraseña incorrecta')
        }
        const auth_token = jwt.sign(
            {
                id: user_found._id,
                name: user_found.name,
                email: user_found.email
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '30d'
            }
        )

        return {
            auth_token: auth_token
        }

    }
}*/

import UserRepository from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import ENVIRONMENT from '../config/environment.config.js'
import { ServerError } from '../utils/customError.utils.js'
import createTransporter from '../config/mailer.config.js';

class AuthService {
    static async register(username, email, password) {
        // Verificar si existe
        console.log ('Email recibido:', email, 'Tipo', typeof email)
        const existingUser = await UserRepository.findByEmail(email);
        console.log('Usuario encontrado:', existingUser)
        if (existingUser) {
            throw new ServerError(400, 'El email ya está registrado');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generar token
        const verification_token = crypto.randomBytes(32).toString('hex')
        
        
        const transporter = createTransporter()
        // Crear usuario
        await UserRepository.createUser({
            name: username,
            email,
            password: hashedPassword,
            verification_token,
            isVerified: false,
        });

        // Enviar email (configura nodemailer como antes)
        //const transporter = nodemailer.createTransport({ /* config */ });
        
        await transporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta',
            html: `<a href="${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}">Verificar</a>`,
        });
    }

    static async verifyEmail(verification_token) {
        const user = await UserRepository.findByVerificationToken(verification_token);
        if (!user) {
            throw new ServerError(400, 'Token inválido');
        }
        user.isVerified = true;
        user.verification_token = undefined;
        await user.save();
    }

    static async login(email, password) {
        // Tu lógica existente, pero agrega verificación de isVerified
        const user = await UserRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ServerError(401, 'Credenciales inválidas');
        }
        if (!user.isVerified) {
            throw new ServerError(403, 'Verifica tu email antes de iniciar sesión');
        }
        const auth_token = jwt.sign({ userId: user._id }, ENVIRONMENT.JWT_SECRET, { expiresIn: '1h' });
        return { auth_token };
    }

    
}

export default AuthService
