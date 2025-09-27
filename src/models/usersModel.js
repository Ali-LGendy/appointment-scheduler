import db from "../db/knex.js"

export const createUser = async ({email, password_hash, name, role = "user", service_type = null}) => {
    const [user] = await db('users')
        .insert({
            email,
            password_hash,
            name,
            role: role || 'user',
            service_type: service_type || null,
        })
        .returning('*');

    return user;
}

export const getUserByEmail = async (email) => {
    const [user] = await db('users').where({ email }).first();
    return user;
}

export const getUserByID = async (id) => {
    const [user] = await db('users').where({ id }).first();
    return user;
}