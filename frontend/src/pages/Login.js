import { useState } from "react"
import { Link } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // --- Style Definitions ---
    const primaryBrandGreen = '#1e7145'; // Deep Forest Green
    const accentGreen = '#4cb64c';     // Vibrant Green
    const lightBackground = '#f3fbf3'; // Very Light Greenish-Gray
    
    // Style for the main container (background) - Set position: relative for absolute text positioning
    const containerStyle = {
        backgroundColor: lightBackground,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Roboto, Arial, sans-serif',
        position: 'relative', // IMPORTANT: Allows absolute positioning of the background text
        overflow: 'hidden', // Hide overflow of large text
    };

    // Style for the large background brand name
    const backgroundTextStyle = {
        position: 'absolute',
        top: '15%', // Positioned near the top
        left: '50%',
        transform: 'translateX(-50%)', // Center horizontally
        fontSize: '6rem', // Large font size
        fontWeight: '900', // Very bold
        color: primaryBrandGreen,
       
        userSelect: 'none', // Prevent text selection
        pointerEvents: 'none', // Ensure it doesn't interfere with interaction
        letterSpacing: '5px',
        textAlign: 'center',
    };

    // Style for the login card
    const cardStyle = {
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        zIndex: 10, // Ensure card is above the background text
    };

    // Style for the login heading (Removed brandNameStyle as it's now in the background)
    const headingStyle = {
        fontSize: '2rem',
        fontWeight: '700',
        color: primaryBrandGreen,
        marginBottom: '1.5rem',
    };

    // Style for all input fields (email, password)
    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        border: '1px solid #dcdcdc',
        borderRadius: '8px',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    };

    // Style for the primary submit button (Login)
    const primaryButtonStyle = {
        backgroundColor: primaryBrandGreen,
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        border: 'none',
        width: '100%',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: '600',
        marginTop: '0.5rem',
        transition: 'background-color 0.2s',
    };
    
    // Style for the secondary button (Create Account)
    const secondaryButtonStyle = {
        backgroundColor: 'transparent',
        color: primaryBrandGreen,
        padding: '0.5rem',
        borderRadius: '8px',
        border: 'none',
        width: '100%',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        marginTop: '1rem',
        textDecoration: 'underline',
        textDecorationColor: primaryBrandGreen,
        transition: 'color 0.2s',
    };

    // --- Logic (UNCHANGED) ---
    function handleUpdate(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Note: Replacing alert() with a console log/temporary message in a real app
        if (!formData.email || !formData.password) {
            console.warn("Please fill in all fields");
            // Simplified handling for demonstration
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/account/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message || 'Login failed');
                return;
            }

            const userId = data.user?.user_id;
            const role = data.user?.role;

            if (!userId) {
                console.error("No user_id in login response:", data);
                return;
            }

            sessionStorage.setItem("user_id", userId);
            if (role) {
                sessionStorage.setItem("role", role);
            }

            // Simplified redirect
            if (role === "Purchaser") {
                window.location.href = "/purchaser-dashboard";
            } else {
                window.location.href = "/deliverer-dashboard";
            }

        } catch (error) {
            console.error("There was an error logging in!", error);
        }
    }

    return (
        <div style={containerStyle}>
            
            {/* --- LARGE BACKGROUND BRANDING --- */}
            <div style={backgroundTextStyle}>
                HomeRun Delivery
            </div>
            {/* --------------------------------- */}

            <div style={cardStyle}>
                <h2 style={headingStyle}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleUpdate}
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleUpdate}
                        style={inputStyle}
                    />

                    <button type="submit" style={primaryButtonStyle}>
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => window.location.href = "/create-account"}
                        style={secondaryButtonStyle}
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}