const { connectOpenAI, assistants } = require("../configs/chatgpt");
const { handleRunStatus } = require("../helpers/chatgpt");

async function main({ thread_id, content, assistantID = assistants.assistant_id }) {
   try {
      //Obtenemos la conexión y el asistente
      const openai = connectOpenAI()

      //Extraemos al asistente que se encuentre en nuestro id de asistente
      let assistant = await openai.beta.assistants.retrieve(
         assistantID
      )

      //Revisamos si existe un hilo actual y si no creamos uno para tener un hilo de mensajes
      let thread
      if (!thread_id) {
         thread = await openai.beta.threads.create();
      } else {
         thread = await openai.beta.threads.retrieve(thread_id);
      }

      //Creamos el mensaje que se agrega al hilo con el id que enviamos y le enviamos el contenido recibido del body
      const message = await openai.beta.threads.messages.create(
         thread.id,
         {
            role: "user",
            content
         }
      );

      //Corres el mensaje con este objeto para saber que paso cuando corriste el mensaje
      let run = await openai.beta.threads.runs.createAndPoll(
         thread.id,
         {
            assistant_id: assistant.id,
            instructions: assistant.instructions
         }
      );

      console.log("\n\nTHREAD\n\n")
      console.dir(thread)
      console.log("\n\nASSISTANT\n\n")
      console.dir(assistant)
      console.log("\n\nMESSAGE\n\n")
      console.dir(message)
      console.log("\n\nRUN\n\n")
      console.dir(run)

      // console.log("run\n", run)
      //Retornamos lo que nos de al revisar lo que tiene el run y enviamos el openai autorizado
      return await handleRunStatus(run, openai)

   } catch (error) {
      return console.log(error)
   }
}

async function getThread({ thread_id }) {
   try {
      const openai = await connectOpenAI()
      thread = await openai.beta.threads.messages.list(thread_id);
      console.dir(thread)
      let mensajes = thread.body.data.map(element => {
         return {
            role: element.role,
            content: element.content[0].text.value
         }
      });
      return mensajes.reverse()
   } catch (error) {
      console.log(error)
      return {
         error,
         ok: false,
         message: "no se encontro un hilo con el id " + thread_id
      }
   }
}

module.exports = {
   main,
   getThread,
}