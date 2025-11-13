import 'dotenv/config'

connectMongoDB()

import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/configMongoDB.config.js";
import workspace_router from "./routes/workspace.router.js";
import express from 'express'
import auth_router from "./routes/auth.router.js";
import cors from 'cors'
import authMiddleware from "./middleware/auth.middleware.js";
import member_router from "./routes/member.router.js";
import AuthController from "./controllers/auth.controller.js"


const app = express()

app.use(cors())
app.use(express.json())
app.get('/auth/verify/:token', AuthController.verifyEmail)

//app.use('/auth', auth_router)
app.use('/api/workspace', workspace_router)
app.use('/api/members', member_router)

app.get('/api/status', (request, response) => {
    response.send({
        ok: true,
        message: 'Esto esta funcionando'
    })
})

app.get('/api/ping', (request, response) => {
    response.send({
        ok: true,
        message: 'pong'
    })
})



app.get('/ruta-protegida', authMiddleware, (request, response) => {
    console.log(request.user)
    response.send({
        ok: true
    })
})



app.listen(
    3000, 
    () => {
        console.log("Esto esta funcionado")
    }
)


export default app
