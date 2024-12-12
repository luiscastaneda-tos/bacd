const { crearExcel } = require("../model/excel")
const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        await crearExcel(req, res)
    } catch (error) {
        console.log(error)
    }
});

module.exports = router