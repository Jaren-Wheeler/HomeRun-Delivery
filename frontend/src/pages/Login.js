import { useState } from "react"
import { Link } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    function handleUpdate(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/account/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();   // ⬅️ parse the JSON

            if (!response.ok) {
                // backend sends { message: "Invalid email or password" }
                alert(data.message || 'Login failed');
                return;
            }

            // ⬅️ pull user_id and role out of the response
            const userId = data.user?.user_id;
            const role = data.user?.role;

            if (!userId) {
                console.error("No user_id in login response:", data);
                alert("Login succeeded but user ID is missing.");
                return;
            }

            // ⬅️ store them for later use (dashboards, etc.)
            sessionStorage.setItem("user_id", userId);
            if (role) {
                sessionStorage.setItem("role", role);
            }

            alert("Login successful!");

            // ⬅️ redirect – tweak these paths to match your routes
            if (role === "Purchaser") {
                window.location.href = "/purchaser-dashboard";
            } else {
                window.location.href = "/deliverer-dashboard";
            } 

        } catch (error) {
            console.error("There was an error logging in!", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    }

    return (
        <div className="login-Bg">
            <div className="login-card">
            <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleUpdate}
                />

                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleUpdate}
                />

                <button type="submit">Login</button>

                <button
                    type="button"
                    onClick={() => window.location.href = "/create-account"}
                >
                Create Account
                </button>
                </form>
            </div>
        </div>
    );
}
