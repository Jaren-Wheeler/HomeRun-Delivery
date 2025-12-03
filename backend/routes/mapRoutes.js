/**
 * @file mapsRoutes.js
 * Endpoints supporting Google Maps integration and lightweight user onboarding
 * from the map view.
 *
 * Responsibilities:
 *  - Provide client with the API key to load Google Maps
 *  - Retrieve available delivery job marker data
 *  - Create a basic user account directly from the interactive map
 */

const express = require('express');
const router = express.Router();
const MapsController = require('../controllers/mapsController');
const UserController = require('../controllers/UserController');

// ---------------------------------------------------------------------------
// Google Maps API Support
// ---------------------------------------------------------------------------

/**
 * GET /maps-key
 * Returns frontend-safe Google Maps API key for loading the map UI.
 */
router.get('/maps-key', MapsController.getMapsKey);

/**
 * GET /markers
 * Retrieves all "open" deliveries and maps them into markers for the UI.
 */
router.get('/markers', MapsController.getMarkers);

module.exports = router;
