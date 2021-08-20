// let express = require('express');
let router = require('express-promise-router')();
let broadcastQueries = require('../queries/broadcast')

// getAllBroadcastersByActive: get all active broadcasters.
router.get("/active", async (req, res, next) => {
    try {
        const broadcasters = await broadcastQueries.getAllBroadcasters();
        res.json({
            status: "success",
            message: "All active broadcasters retrieved!",
            payload: broadcasters
        });
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: "Oops! All Errors!!",
            payload: null
        })
        throw err;
    }
});

// getBroadcasterById: get a single broadcaster by socket ID.
router.get("/:socket_id", async (req, res, next) => {
    try {
        const socketId = req.params.socket_id
        const broadcaster = await broadcastQueries.getBroadcasterById(socketId);
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
            message: `New broadcaster, ${username} created!`,
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
    const socket_id = req.params.socket_id;
    try {
        const editedBroadcaster = await broadcastQueries.deactivateBroadcaster({
            socket_id,
            ...req.body
        })
        res.json({
            status: `Successfully deactivated broadcaster ${socket_id}`,
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

router.delete("/wipeout", async (req, res, next) => {
  try {
    const deletedBroadcasters = await broadcastQueries.deleteAll();
    res.json({
      status: "success",
      message: "All broadcasters have been deleted!",
      payload: deletedBroadcasters,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "Oops! All Errors!!",
      payload: null,
    });
    throw err;
  }
});

module.exports = router;