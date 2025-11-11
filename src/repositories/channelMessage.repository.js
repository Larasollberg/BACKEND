import ChannelMessage from '../models/MessageChannel.model.js';

class ChannelMessageRepository {
    
    /**
     * @param {string} channelId - ID del canal para obtener los mensajes.
     * @returns {Promise<Array>} Lista de mensajes con información del usuario.
     */
    static async getAllByChannelId(channelId) {
        try {
            // 1. Buscar documentos donde el campo 'channel' coincida con channelId.
            // 2. Ordenar por fecha de creación (ascendente).
            // 3. Usar .populate('user', 'username email') para reemplazar el JOIN:
            //    Esto trae los campos 'username' y 'email' de la colección 'User'.
            const messages = await ChannelMessageModel
                .find({ channel: channelId })
                .sort({ createdAt: 1 })
                .populate('user', 'username email'); 
                
            return messages;
        } catch (error) {
            console.error('Error al obtener mensajes por ID de canal:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo mensaje.
     */
    static async createMessage(userId, channelId, content) {
        try {
            const newMessage = await ChannelMessageModel.create({
                user: userId,
                channel: channelId,
                content: content
            });
            return newMessage;
        } catch (error) {
            console.error('Error al crear el mensaje:', error);
            throw error;
        }
    }
}

export default ChannelMessageRepository


































/*import pool from "../config/mysql.config.js"
import { MEMBER_WORKSPACE_TABLE } from "./memberWorkspace.repository.js";
import { USERS_TABLE } from "./user.repository.js";

export const MESSAGE_TABLE = {
    NAME: 'MessagesChannel',
    COLUMNS: {
        MEMBER_ID: 'member',
        ID: "_id",
        CHANNEL_ID: "channel",
        CONTENT: "content",
        CREATED_AT: 'created_at'
    }
}

class ChannelMessageRepository {
    static async create(content, channel_id, member_id) {
        console.log(channel_id)
        const query = `
        INSERT INTO ${MESSAGE_TABLE.NAME}
        (${MESSAGE_TABLE.COLUMNS.CONTENT}, ${MESSAGE_TABLE.COLUMNS.CHANNEL_ID}, ${MESSAGE_TABLE.COLUMNS.MEMBER_ID})
        VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
            content,
            channel_id,
            member_id,
        ]);
        return result.insertId;
    }

    static async getAllByChannelId(channel_id) {
        console.log(channel_id)
        const query = `
            SELECT
                ${MESSAGE_TABLE.NAME}.${MESSAGE_TABLE.COLUMNS.CONTENT} as message_content,
                ${MESSAGE_TABLE.NAME}.${MESSAGE_TABLE.COLUMNS.CREATED_AT} as message_created_at,
                ${MEMBER_WORKSPACE_TABLE.NAME}.${MEMBER_WORKSPACE_TABLE.COLUMNS.ID} as member_id,
                ${USERS_TABLE.NAME}.${USERS_TABLE.COLUMNS.NAME} as user_name,
                ${USERS_TABLE.NAME}.${USERS_TABLE.COLUMNS.ID} as user_id

            FROM ${MESSAGE_TABLE.NAME}
            JOIN ${MEMBER_WORKSPACE_TABLE.NAME} ON ${MESSAGE_TABLE.COLUMNS.MEMBER_ID} = ${MEMBER_WORKSPACE_TABLE.NAME}.${MEMBER_WORKSPACE_TABLE.COLUMNS.ID} 
            JOIN ${USERS_TABLE.NAME} ON ${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_USER} = ${USERS_TABLE.NAME}.${USERS_TABLE.COLUMNS.ID}
            WHERE ${MESSAGE_TABLE.COLUMNS.CHANNEL_ID} = ?
            ORDER BY ${MESSAGE_TABLE.NAME}.${MESSAGE_TABLE.COLUMNS.CREATED_AT} ASC
        `

        console.log(query)
        const [result] = await pool.execute(query, [channel_id])

        
        Result tendra este formato
        Lista donde cada mensaje tendra esta informacion
        - user_name -> Users
        - user_id -> MembersWorkspace/Users
        - member_id -> MessagesChannel/MembersWorkspace
        - message_content -> MessagesChannel
        - message_created_at -> MessagesChannel
        
        return result
    }
}

export default ChannelMessageRepository*/