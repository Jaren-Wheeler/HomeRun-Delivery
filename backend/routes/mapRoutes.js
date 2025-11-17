const express = require('express');
const router = express.Router();

// define route for GET requests to Google Maps API
router.get("/maps-key", (req,res) => {
    res.json({key: process.env.GOOGLE_MAPS_API_KEY});
});

module.exports = router;