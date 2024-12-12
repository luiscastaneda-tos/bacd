const OpenAI = require("openai");
require("dotenv").config()

//Esta función conecta con chatgpt y regresa la conexión
function connectOpenAI() {
  console.log("entrando a conectar")
  console.log({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.ORGANIZATION,
    project: process.env.ID_PROJECT
  })
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.ORGANIZATION,
    project: process.env.ID_PROJECT
  });
  return openai
}
//Guardamos las variables de los asistentes
const assistants = {
  assistant_id: "asst_bzwg7fR39wMhTewlkd10Su4K",
  assistant_reportes: "asst_duBrruFXQaelQe0pyXEXhqsh",
  assistant_cotizaciones: "asst_A9o41hHE0OGDa7fTs6kihshz",
}

module.exports = {
  connectOpenAI,
  assistants
}