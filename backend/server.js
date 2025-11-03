const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = 3000;

const app = express();

app.get('/', (req,res) => {
    res.send('Server is running.')
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})