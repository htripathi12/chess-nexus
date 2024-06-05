const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 6969;

const db = require('./database');
app.use(express.json());
app.use(cors());

app.use("/database", db);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});