import db from "../db/knex.js"

export const insertToken = async ({user_id, token_hash, expires_at}) => {
    const [row] = await db("refreshToken")
        .insert({user_id, token_hash, expires_at})
        .returning("id, user_id, token_hash, expires_at, revoked");

    return row;
}

export const findByHash = async (token_hash) => {
    const result = await db("refreshToken")
        .where({ token_hash })
        .first();

    return result;
}

export const revokeByHash = async (token_hash) => {
    const result = await db("refreshToken")
        .update({ revoked: true })
        .where({ token_hash })

    return result;
}

export const revokeByID = async (id) => {
    const result = await db("refreshToken")
        .update({ revoked: true })
        .where({ id })

    return result;
}

export const revokeAllForUser = async (user_id) => {
    const result = await db("refreshToken")
        .where({ user_id })
        .update({ revoked: true });

    return result;
}