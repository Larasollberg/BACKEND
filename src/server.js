import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongoDB.config.js";
import workspace_router from "./routes/workspace.route.js";

connectMongoDB()

import express from 'express';
import UserRepository from "./repositories/user.repository.js";
import WorkspacesRepository from "./repositories/workspace.repository.js";
import { validarId } from "./utils/validations.utils.js";
import mongoose from "mongoose";
import auth_router from "./routes/auth.router.js";
import jwt from 'jsonwebtoken'
import cors from 'cors'
import authMiddleware from './middleware/auth.middleware.js';
import MemberWorkspaceRepository from './repositories/membersWorkspace.repository.js';

/*
Sing: se usa p firmar tokens
    .- payload: carga util, info que lleva el token (es el objeto que sera guardado dentro del token, NO apto info sensible)
    
    .- clave secreta para firmar: si roban esta clave, los tokens son inseguros

    .- configuraciones: por ej, fecha de expiraciones
*/


const app = express()


app.use(cors())
app.use(express.json())



app.use('/api/workspace', workspace_router)
app.use('/api/auth', auth_router)



app.get('/ruta-protegida', authMiddleware, (request, response) => {
    console.log(request.user)
    response.send({
        ok: true
    })
})


app.listen(
    8080, 
    () => {
        console.log("Esto esta funcionado")
    }
)


//UserRepository.createUser('Test2', 'larisollberg@gmail.com', 'lara5565')
UserRepository.getByEmail('lsollberg@gmail.com').then(result => console.log(result))



