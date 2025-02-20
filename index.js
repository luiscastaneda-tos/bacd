const router_upload = require("./router/upload")
const router_Open = require("./router/chatgpt")
const router_excel = require("./router/excel")
const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const app = express();

const port = process.env.PORT || 3000
const corsOptions = {
  origin: ['http://localhost:5173', 'https://noktos-backend.vercel.app', 'https://noktos-chat.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// const { getTicketDataVuelo } = require("./helpers/zoho");

// (async () => {
// const id = "603403000021835708" //En este si se puede obtener la imagen creo
// const id = "603403000021989001" //No se puede extrañamente porque el canal es por correo electronico
// const data = await getTicketDataVuelo({ ticketId: id })
// console.log(data)
// })()

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/upload', router_upload);
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
  console.log("corriendo en el puerto: " + port)
})