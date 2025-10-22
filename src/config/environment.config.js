import dotenv from 'dotenv'
//Carga todas las variables de entorno dentro de process.env
dotenv.config()


//Creamos una constante de facil acceso a mis variables de entorno
const ENVIRONMENT = {
    MONGODB_URI_STRING: process.env.MONGODB_URI_STRING,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    URL_API_BACKEND: process.env.URL_API_BACKEND,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_USERNAME: process.env.MYSQL_USERNAME,  /*usuario de aplicacion*/
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE
}

export default ENVIRONMENT