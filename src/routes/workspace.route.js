import express from 'express'
import WorkspacesRepository from '../repositories/workspace.repository.js'
import { validarId } from '../utils/validations.utils.js'
import { ServerError } from '../utils/customError.utils.js'
import WorkspaceController from '../controllers/workspace.controllers.js'
import authMiddleware from '../middleware/auth.middleware.js'

//Manejar consultas referidas a workspace

const workspace_router = express.Router()

workspace_router.use(authMiddleware)

workspace_router.get('/', WorkspaceController.getAll )


workspace_router.get('/:workspace_id', WorkspaceController.getById )

workspace_router.post(
    '/:workspace_id/invite', 
    workspaceMiddleware(['admin']),
    WorkspaceController.inviteMember
)


//Este es el endpoint para crear workspaces
workspace_router.post('/', authMiddleware, WorkspaceController.post)




export default workspace_router