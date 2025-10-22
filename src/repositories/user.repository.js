import Users from "../models/user.model.js";
import AuthController  from "../controllers/auth.controller.js";
import pool from "../config/mysql.config.js";


class UserRepository {

    //VERSION MYSQL
    static async createUser(name, email, password){
        //Porq usamos el ? en la query - Podemos insertar valores mediante el metodo execute (nos permite hacer chequeos)
        // Inyeccion SQL: cuando me insertan dentro de una consulta codigo SQL
        const query = ` 
            INSERT INTO Users(email, name, password) VALUES ( ?, ?, ?)
        
        `
        const [result, field_packet] = await pool.execute(query,[email, name, password])
        const user_created = await UserRepository.getById(result.insertId)
        console.log(user_created)
        return user_created
    }
    

    static async getById (user_id){
        const query = `
        SELECT * FROM Users WHERE _ID = ?
        `
        const [result] = await pool.execute(query, [user_id])
        const user_found = result [0]
        if(!user_found){
            return null
        }
        return user_found
    }


    static async getAll (){
        //.find es un metodo para hacer filtro en una coleccion
        const users = await Users.find()
        return users
    }


    static async deleteById(user_id){
        const query = `
        DELETE * FROM Users WHERE _id = ? `
        const [result] = await pool.execute(query, [user_id])
        
        return result.affectedRows > 0;
    }


    static async updateById(user_id, new_values) {
        
        const update_fields = Object.keys(new_values)
        const fields_querys = update_fields
        .map(
            field => `${field}= ? `
        )
        .join(' , ')
        const values = Object.values(new_values)
        const query = `UPDATE Users SET  ${fields_querys} WHERE _id = ? `
        pool.execute(query, [...values, user_id])
    }


    static async getByEmail(email){
        const query = `
            SELECT * FROM Users WHERE email = ?
        `
        const [result] = await pool.execute(query, [email])
        const user_found = result [0];
        if(!user_found){
            return null
        }
        return user_found
    }

    }

    /*VERSION MONGO DB
    static async createUser(name, email, password){
        //Logica de interaccion con la DB para crear el usuario
        const result = await Users.insertOne({
            name: name,
            email: email,
            password: password,
        })
        return result
    }*/

    /*static async getById (user_id){
        const user_found = await Users.findById(user_id)
        return user_found
    }
    */
    /*static async deleteById (user_id){
        await Users.findByIdAndDelete(user_id)
        return true
    }*/

    /*static async updateById (user_id, new_values){
        const user_updated = await Users.findByIdAndUpdate(
            user_id, 
            new_values, 
            {
                new: true //Cuando se haga la actualizacion nos traiga el objeto actualizado
            } 
        )

        return user_updated
    }
    */
    
    /*static async getByEmail (email){
        const user = await Users.findOne({email: email})
        return user
    }
}*/





export default UserRepository


//Un metodo o propiedad estatica puede ser llamada desde la clase, sin necesidad de instanciar dicha clase
//Por que usar estaticos? para no tener mas de una instancia del userRepository




