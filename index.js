const router_Open = require("./router/chatgpt")
const router_excel = require("./router/excel")
const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const app = express()

const port = process.env.PORT || 3000
const corsOptions = {
    origin: ['http://localhost:5173', 'https://noktos-backend.vercel.app', 'https://noktos-chat.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/chat", router_Open)
app.use("/excel", router_excel)
app.get('/', async function (req, res) {
    try {
        res.send("ya estoy")
        res.end()
    } catch (err) {
        console.error(err)
    }
});

app.use((err, req, res, next) => {
    const statuscode = err.statuscode || 500;
})
app.listen(port, () => {
    console.log("server iniciado")
})