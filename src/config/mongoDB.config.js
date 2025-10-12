import mongoose from 'mongoose'
import ENVIRONMENT from './environment.config.js'


async function connectMongoDB() {
    try{
        await mongoose.connect(ENVIRONMENT.MONGODB_URI_STRING, {
        /*      useNewUrlParser: true, 
            useUnifiedTopology: true,  */
            timeoutMS: 60000 //60s
        })
        console.log('Conexion con MongoDB fue exitosa')
    }
    catch(error){
        console.error('La conexion con MongoDB fallo')
        console.log(error)
    }
}


export default connectMongoDB