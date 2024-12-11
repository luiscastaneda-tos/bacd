const router_Open = require("./router/chatgpt.js")
const router_excel = require("./router/excel.js")
const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const app = express()

const port = process.env.PORT || 3000

/*
const {obtenerAcces} = require("./configs/zoho.js")
(async ()=>{
await obtenerAcces()
})()
*/
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use( "/chat" , router_Open )
app.use( "/excel" , router_excel )

app.use((err, req, res, next) => {
    const statuscode = err.statuscode || 500;
})
app.listen(port, () => {
    console.log("server iniciado")
})