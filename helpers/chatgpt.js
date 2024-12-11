const { getNombres, checkEmpalme, historialHoteles, generarReporte } = require("./database.js");
const { getCiudadesYEstados, getRowPoliticas } = require("./fileSystem.js");
const { appendDataToSpreed, appendDataToSpreedNoches } = require("./google.js");
const { createATicket } = require("./zoho.js")
const { getQueryParams } = require("./general.js")

//Maneja las llamadas de funcion
async function handleRequiresAction(run, openai) {

    //Verifica si hay acciones por hacer
    if (
        run.required_action &&
        run.required_action.submit_tool_outputs &&
        run.required_action.submit_tool_outputs.tool_calls
    ) {

        // Promise.all recibe un array y espera a que todas las promesas de ahi se cumplan
        const toolOutputs = await Promise.all(

            //El array que le vamos a mandar son todas las acciones que se deben realizar y que se encuentran en tool_calls
            run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {

                let arguments = JSON.parse(tool.function.arguments)

                if (tool.function.name === "getNombres") {
                    const output = await getNombres(arguments.nombre);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "checkEmpalme") {
                    const output = await checkEmpalme(arguments.nombre, arguments.check_in, arguments.check_out);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "historialHoteles") {
                    const output = await historialHoteles(arguments.nombre);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "getCiudadesYEstados") {
                    const output = await getCiudadesYEstados();
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "getRowPoliticas") {
                    const output = await getRowPoliticas(arguments.row);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "createATicket") {
                    const output = await createATicket(arguments);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "handleColumns") {
                    const output = await handleColumns(arguments);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "getQueryParams") {
                    const output = await getQueryParams(arguments);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "generarReporte") {
                    const output = await generarReporte(arguments);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "appendDataToSpreed") {
                    const output = await appendDataToSpreed(arguments);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                } else if (tool.function.name === "appendDataToSpreedNoches") {
                    const output = await appendDataToSpreedNoches(arguments);
                    console.log(output)
                    return {
                        tool_call_id: tool.id,
                        output: output
                    };

                }
            })
        );

        if (toolOutputs.length > 0) {
            new_run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
                run.thread_id,
                run.id,
                { tool_outputs: toolOutputs },
            );
            console.log("Tool outputs submitted successfully.");

        } else {
            console.log("No tool outputs to submit.");
        }
        return await handleRunStatus(new_run, openai);
    }
};

//Esta función se encarga de manejar lo que ocurre una vez que se realiza el run para saber si ocurrio todo bien o necesita realizar una acción
async function handleRunStatus(run, openai) {

    if (run.status === "completed") {

        let messages = await openai.beta.threads.messages.list(run.thread_id);
        return {
            response: {
                thread_id: run.thread_id,
                message: messages.data[0]
            },
            metadata: {
                run
            },
            ok: true
        }

    } else if (run.status === "requires_action") {

        return await handleRequiresAction(run, openai);

    } else {

        console.error("Run did not complete:", run);

    }
};

module.exports = {
    handleRequiresAction,
    handleRunStatus
}