let express = require('express');
let router = express.Router();
let broadcastQueries = require('../queries/broadcast')

// getBroadcasterById: get a single broadcaster by socket ID.
router.get("/:socket_id", async (req, res, next) => {
    try {
        const socketId = req.params.socket_id
        const broadcaster = await broadcastQueries.getBroadcasterById(socketId);
        console.log(broadcaster)
        res.json({
            status: "success",
            message: `Broadcaster ${socketId} retrieved!`,
            payload: broadcaster
        });
    } catch (err) {
        res.json({
            status: "failure",
            message: "Oops! All Errors!!",
            payload: null
        })
        throw err;
    }
});

// getAllBroadcastersByActive: get all active broadcasters.
router.get("/active", async (req, res, next) => {
    try {
        const broadcasters = await broadcastQueries.getAllBroadcastersByActive();
        console.log(broadcasters)
        res.json({
            status: "success",
            message: `All active broadcasters retrieved!`,
            payload: broadcasters
        });
    } catch (err) {
        res.json({
            status: "failure",
            message: "Oops! All Errors!!",
            payload: null
        })
        throw err;
    }
});

// createRecipe: create a new core recipe instance
router.post("/new/:socket_id", async (req, res, next) => {
    try {
        const socket_id = req.params.socket_id;
        const username = req.body.username;
        const response = await broadcastQueries.createBroadcaster({
            socket_id: socket_id,
            username: username
        });
        res.json({
            status: "success",
            message: `New broadcaster, ${user_name} created!`,
            payload: response
        });
    } catch (err) {
        res.json({
            status: "failure",
            message: "Oops! All Errors!",
            payload: null
        })
        throw err;
    }
});

//  deactivateBroadcaster: edit a broadcaster's active setting to remove them from the JOIN room
router.patch("/:socket_id", async (req, res, next) => {
    const id = req.params.socket_id;
    try {
        const editedBroadcaster = await broadcastQueries.deactivateBroadcaster({
            id,
            ...req.body
        })
        res.json({
            status: `Successfully deactivated broadcaster ${id}`,
            payload: editedBroadcaster,
            error: null
        })

    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: "Oops! All Errors!",
            payload: null
        })
        throw err;
    }
});

module.exports = router