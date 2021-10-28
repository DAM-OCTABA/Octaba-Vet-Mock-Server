const express = require('express');
const ngrok = require('ngrok');
const app = express();
const { auth, requiredScopes, claimCheck } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

if (!process.env.ISSUER_BASE_URL || !process.env.AUDIENCE) {
  throw ' Omplir ISSUER_BASE_URL i AUDIENCE al fitxer .env';
}

const checkJwt = auth();

app.get('/api/auth', checkJwt, function(req, res) {
  res.json({
    message: 'Si pots llegir això, has enviat el token correctament al servidor'
  });
});

const readPets = claimCheck((claims) => claims.permissions && (claims.permissions === 'read:pets' || claims.permissions.includes('read:pets')));

app.get('/api/pets', checkJwt, readPets, function(req, res) {
  res.json({
    message: 'Aquest és un missatge només per veterinaris obtingut del servidor'
  });
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.set(err.headers).status(err.status).json({ message: err.message });
});

const server = app.listen(0, async () => {
    const url = await ngrok.connect(server.address().port);
    console.log(`Adreça Ngrok: ${url}`);
});
