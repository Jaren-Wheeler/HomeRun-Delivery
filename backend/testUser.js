/**
 * @file testLogin.js
 * Quick script to verify user authentication works correctly.
 *
 * Runs a POST request to the /api/account/login route and prints:
 *  - Success → user data returned
 *  - Failure → status + error details logged for debugging
 *
 * This is a lightweight developer tool to test backend auth
 * without needing the frontend UI connected.
 */

const axios = require('axios');

// Attempt login with known test credentials
axios
  .post('http://localhost:5000/api/account/login', {
    email: 'ryan@test.com',
    password: 'Password123',
  })
  .then((res) => {
    console.log('🔐 Login successful:', res.data);
  })
  .catch((err) => {
    console.error('\n❌ Login Test Error');

    if (err.response) {
      // Server responded with an error status
      console.error('Status:', err.response.status);
      console.error('Response:', err.response.data);
    } else {
      // Network or unknown error
      console.error('Error:', err.message);
    }
  });
// script: printUsers.js
const { User } = require('./models');

async function showUsers() {
  const users = await User.findAll({
    attributes: ['user_id', 'email', 'role'],
  });
  console.log(users.map((u) => u.toJSON()));
  process.exit();
}

showUsers();
