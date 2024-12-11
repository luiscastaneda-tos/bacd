require("dotenv").config()

const config = {
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'refresh_token',
}

async function obtenerAcces() {
    try {
        console.log(config)
        const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(config),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener el access token');
        }

        console.log(data);
        return data.access_token;

    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {config, obtenerAcces}