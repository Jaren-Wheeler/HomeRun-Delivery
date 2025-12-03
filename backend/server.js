const express = require('express');
const app = express();
const cors = require('cors');

app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

require('dotenv').config();

const db = require("./config/db"); // initialize the database
const initDb = require("./config/dbSync");

const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


// import routes
const mapRoutes = require('./routes/mapRoutes');
app.use("/api", mapRoutes);

const deliveryRoutes = require('./routes/deliveryRoutes');
app.use("/api", deliveryRoutes);

const userRoutes = require('./routes/userRoutes');
app.use("/api/users", userRoutes);

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

const sequelize = require("./config/db");

sequelize.authenticate()
  .then(() => console.log("✅ SQL Server connected"))
  .catch(err => console.error("❌ Connection failed:", err));


  
startServer();