const { upload } = require("../model/upload")
const express = require("express");
const router = express.Router();

router.post('/', async function (req, res) {
    try {
        res.status(200).json(await upload(req.body))
        res.end()
    } catch (err) {
        console.error(err)
        res.status(400).json(err)
    }
});


module.exports = router