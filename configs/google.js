const { google } = require('googleapis');
require("dotenv").config()

const spreadsheetId = '1veqa7zsBtyTHbICJi_IUXRwsyOw1UXPXHFCTa1P-UnA'
// const spreadsheetReservas = '1NbCSS7QRoCO2yHEvG9wx8kcHIx4h6ygCfQ-OUrgUbS4'; //Este es para otro

function connectGoogleApi() {

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: process.env.google_type,
      project_id: process.env.google_project_id,
      private_key_id: process.env.google_private_key_id,
      private_key: process.env.google_private_key.replace(/\\n/g, '\n'),
      client_email: process.env.google_client_email,
      client_id: process.env.google_client_id,
      auth_uri: process.env.google_auth_uri,
      token_uri: process.env.google_token_uri,
      auth_provider_x509_cert_utl: process.env.google_auth_provider_x509_cert_url,
      client_x590_cert_url: process.env.google_client_x509_cert_url,
      universe_domain: process.env.google_universe_domain
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const sheets = google.sheets({ version: "v4", auth });

  return { sheets }
}

module.exports = {
  connectGoogleApi,
  spreadsheetId
}