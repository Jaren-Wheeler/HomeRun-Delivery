const axios = require('axios');

axios.post("http://localhost:5000/api/users", {
    first_name: "Ryan",
    last_name: "Heidinger",
    email: "ryan@test.com",
    phone: "5878888888",
    password: "Password123",
    role: "User"
})
.then(res => {
    console.log("✅ User created:", res.data);
})
.catch(err => {
    console.error("FULL ERROR:", err.toString());
    if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
    }
});