const { main, getThread } = require("../model/chatgpt.js")
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.json(await getThread(req.query))
        res.end()
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

router.post('/', async function (req, res) {
    try {
        res.json(await main(req.body))
        res.end()
    } catch (err) {
        console.error(err)
        res.status(400).json(err)
    }
});


module.exports = router