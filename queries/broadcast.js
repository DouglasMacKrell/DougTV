// DATABASE CONNECTION
const db = require('../db')

//GET 
const getBroadcasterById = async (broadcasterId) => {
    const getQuery = `SELECT * FROM broadcasters WHERE socket_id = $1;`;
    let broadcaster = await db.one(getQuery, [broadcasterId]);
    return broadcaster
}

//GET
const getAllBroadcasters = async () => {
    return await db.any(`SELECT * FROM broadcasters WHERE broadcaster_active = true;`)
}

//POST
const createBroadcaster = async (bodyObj) => {
    const postQuery = `
        INSERT INTO broadcasters (
            socket_id,
            username
        ) VALUES ($1, $2)
        RETURNING *;`;

    let broadcaster = await db.one(postQuery, [bodyObj.socket_id, bodyObj.username]);

    return broadcaster
}

//PATCH
const deactivateBroadcaster = async (broadcaster) => {
    let { user_name, broadcaster_active } = broadcaster;
    try {
        let patchQuery = `UPDATE broadcasters SET `
        if (user_name) {
            patchQuery += `user_name = $/user_name/,`
        }
        if (broadcaster_active) {
            patchQuery += `broadcaster_active = $/broadcaster_active/,`
        }

        patchQuery = patchQuery.slice(0, patchQuery.length - 1);

        patchQuery += ` WHERE socket_id = $/socket_id/ RETURNING *`
        return await db.one(patchQuery, broadcaster);
    } catch (err) {
        throw (err);
    }
}

//DELETE ALL
const deleteAll = async () => {
    try {
        return await db.any(`DELETE FROM broadcasters RETURNING *;`)
    } catch (err) {
        throw (err)
    }
}

/* EXPORT */
module.exports = {
    getBroadcasterById,
    getAllBroadcasters,
    createBroadcaster,
    deactivateBroadcaster,
    deleteAll
}