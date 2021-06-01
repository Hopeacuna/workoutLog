const Express = require('express');
const router = Express.Router();
const {Log} = require('../models');
let validateJWT = require("../middleware/validate-jwt");


router.get('/', async(req, res) => {
    try {
        const allLogs = await Log.findAll();
        res.status(200).json(allLogs);
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

router.get("/:id", (req, res) => {
    Log.findOne({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then((log) => res.status(200).json(log))
    .catch((err) => res.status(500).json({
        error: err
    }))
})

router.post('/', validateJWT, async(req, res) => {
    const {
        description, 
        definition, 
        result
        // owner_id
    } = req.body.log
    const {id} = req.user;
    const logEntry = {
        description, 
        definition, 
        result, 
        owner: id
    }
    try {
        const log = await Log.create({
            description, 
            definition, 
            result
            // owner_id
        })
        res.status(201).json({
            msg: `Log created`,
            log
        })
    }
    catch (err) {
        res.status(500).json({
            msg:`Log creation failed: ${err}`
        })
    }
})


router.delete('/:id', validateJWT, async (req,res) => {
    try {
        const locatedLog = await Log.destroy({
            where: {id: req.params.id}
        })
        .then(result => {
            res.status(200).json({
                msg: `Log destroyed!`,
                deletedLog: result
            })
        })
    } catch (error) {
        res.status(500).json({
            msg: `Unable to delete: ${error}`
        })
    }
})

router.put("/update/:id", validateJWT, async (req, res) => {
    const { description, definition, result} = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner: userId
        }
    };

    const updatedlog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await Log.update(updatedJournal, query);
        res.status(200).json(update);
    }
    catch (err) {
    res.status(500).json({ error: err});
}
});


module.exports = router;
