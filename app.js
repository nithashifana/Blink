const express = require('express');
require('dotenv').config();

const { connectDataBase } = require('./config/db');
const urlRoute = require('./routes/shortenRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/", urlRoute);

connectDataBase();
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});