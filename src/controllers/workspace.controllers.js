import ENVIRONMENT from "../config/environment.config.js"
import MemberWorkspaceRepository from "../repositories/membersWorkspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspacesRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import { validarId } from "../utils/validations.utils.js"
import jwt from 'jsonwebtoken'

class WorkspaceController {
    static async getAll(request, response) {
        try {
            const workspaces = await MemberWorkspaceRepository.getAllWorkspacesByUserId(request.user.id)
            response.json(
                {
                    status: 'OK',
                    message: 'Lista de espacios de trabajo obtenida correctamente',
                    data: {
                        workspaces: workspaces
                    }
                }
            )
        }
        catch (error) {
            console.log(error)
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }

    }

    static async getById(request, response) {
        try {
            const workspace_id = request.params.workspace_id

            if (inNan(workspace_id)) {
                const workspace = await WorkspacesRepository.getById(workspace_id)

                if (!workspace) {

                    throw new ServerError(
                        400,
                        `Workspace con id ${workspace_id} no encontrado`
                    )
                }
                else {

                    return response.json(
                        {
                            ok: true,
                            message: `Workspace con id ${workspace._id} obtenido`,
                            data: {
                                workspace: workspace
                            }
                        }
                    )
                }
            }
            else {
                throw new ServerError(
                    400,
                    'el workspace_id debe ser un id valido'
                )
            }
        }
        catch (error) {
            console.log(error)
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }


    }

    static async post(request, response) {
        try {

            //request.body es donde esta la carga util enviada por el cliente
            //si aplicamos express.json() en nuestra app body siempre sera de tipo objeto
            const name = request.body.name
            const url_img = request.body.url_img
            //Validar que name este y que sea valido (por ejemplo un string no VACIO de no mas de 30 caracteres)
            if (!name || typeof (name) !== 'string' || name.length > 30) {
                throw new ServerError(
                    400,
                    "el campo 'name' debe ser un string de menos de 30 caracteres"
                )
            }
            else if (!url_img || typeof (url_img) !== 'string') {
                throw new ServerError(
                    400,
                    "el campo 'url_img' debe ser un string de menos de 30 caracteres"
                )
            }
            else {
                //Creamos el workspace con el repository
                const workspace_id_created = await WorkspacesRepository.createWorkspace(name, url_img)
                
                if(workspace_id_created){
                    throw new ServerError(
                        500,
                        'Error al crear el workspace'
                    )
                }
                await MemberWorkspaceRepository.create( request.user.id, 'admin')
                //Si todo salio bien respondemos:
                return response.status(201).json({
                    ok: true,
                    status: 201,
                    message: 'Workspace creado con exito'
                })
            }
        }
        catch (error) {
            console.log(error)
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }

    }

}

export default WorkspaceController