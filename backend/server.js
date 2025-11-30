const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require("./config/db"); // initialize the database
const initDb = require("./config/dbSync");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

// import routes
const mapRoutes = require('./routes/mapRoutes');
app.use("/api", mapRoutes);

const deliveryRoutes = require('./routes/deliveryRoutes');
app.use("/api", deliveryRoutes);

app.get('/', (req,res) => {
    res.send('Server is running.')
})

// starts the server, initializes the database
const startServer = async () => {
    try {
        await initDb(); // asyncronously create/update the database tables when starting the server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to initialize database", error)
    };
};

startServer();