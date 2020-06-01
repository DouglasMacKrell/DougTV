// DATABASE CONNECTION
const db = require('../db')

//GET 
const getBroadcasterById = async (broadcasterId) => {
    const getQuery = `SELECT * FROM broadcasters WHERE socket_id = $1;`;
    let broadcaster = await db.any(getQuery, [broadcasterId]);
    return broadcaster
}

//GET
const getAllBroadcastersByActive = async () => {
    const getQuery = `SELECT * FROM broadcasters WHERE active = true;`;
    let broadcasters = await db.any(getQuery)
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
    let { user_name, active } = broadcaster;
    try {
        let patchQuery = `UPDATE broadcasters SET `
        if (user_name) {
            patchQuery += `user_name = $/user_name/,`
        }
        if (active) {
            patchQuery += `active = $/active/,`
        }

        patchQuery = patchQuery.slice(0, patchQuery.length - 1);

        patchQuery += ` WHERE id = $/id/ RETURNING *`
        return await db.one(patchQuery, broadcaster);
    } catch (err) {
        throw (err);
    }
}

/* EXPORT */
module.exports = {
    getBroadcasterById,
    getAllBroadcastersByActive,
    createBroadcaster,
    deactivateBroadcaster
}