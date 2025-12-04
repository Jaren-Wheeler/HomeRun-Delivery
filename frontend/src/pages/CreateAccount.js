import React, { useState } from 'react';

export default function CreateAccount() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "purchaser", // Default role
        password: "",
        confirmPassword: ""
    });

    // --- Style Definitions ---
    const primaryBrandGreen = '#1e7145'; // Deep Forest Green
    const lightBackground = '#f3fbf3'; // Very Light Greenish-Gray
    
    // Style for the main container (background) - NO BACKGROUND TEXT
    const containerStyle = {
        backgroundColor: lightBackground,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Roboto, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    
    // The backgroundTextStyle definition is REMOVED.

    // Style for the card
    const cardStyle = {
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
        zIndex: 10,
    };

    // Style for the main heading
    const headingStyle = {
        fontSize: '2rem',
        fontWeight: '700',
        color: primaryBrandGreen,
        marginBottom: '1.5rem',
    };

    // Style for all input fields
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
    
    // Style for the checkbox container
    const checkboxContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        backgroundColor: lightBackground,
        border: '1px solid #e0e0e0',
        fontWeight: '500',
        color: primaryBrandGreen,
    };

    // Style for the submit button (Primary Action)
    const submitButtonStyle = {
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
    
    // Style for the Back button (Secondary Action/Link)
    const backButtonStyle = {
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

    // --- Logic (mostly unchanged) ---
    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            role: e.target.checked ? "deliverer" : "purchaser"
        }));
    };
    
    const handleBackToLogin = () => {
        window.location.href = '/'; // Assuming the login page is at the root '/'
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role
        };

        try {
            const response = await fetch("http://localhost:5000/api/account/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create account');

            alert("Account created successfully!");
            window.location.href = '/';
        } catch (error) {
            console.error("Error creating account:", error);
            alert(`Error: ${error.message}`);
        }
    }
        
    
    return (
        <div style={containerStyle}>
            
            {/* The backgroundTextStyle div has been REMOVED */}

            <div style={cardStyle}>
                <h2 style={headingStyle}>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="first_name" 
                        placeholder="First Name" 
                        required 
                        value={formData.first_name} 
                        onChange={handleUpdate}
                        style={inputStyle}
                    />
                    <input 
                        type="text" 
                        name="last_name" 
                        placeholder="Last Name" 
                        required 
                        value={formData.last_name} 
                        onChange={handleUpdate} 
                        style={inputStyle}
                    />
                    <input 
                        type="tel" 
                        name="phone" 
                        placeholder="Phone Number" 
                        required 
                        value={formData.phone} 
                        onChange={handleUpdate} 
                        style={inputStyle}
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        required 
                        value={formData.email} 
                        onChange={handleUpdate} 
                        style={inputStyle}
                    />
                    
                    {/* Role Selection */}
                    <div style={checkboxContainerStyle}>
                        <label htmlFor="role">Do you want to be a delivery driver?</label>
                        <input 
                            type="checkbox" 
                            name="role"
                            onChange={handleRoleChange} 
                        />
                    </div>
                    
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        required 
                        value={formData.password} 
                        onChange={handleUpdate} 
                        style={inputStyle}
                    />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        placeholder="Confirm Password" 
                        required 
                        value={formData.confirmPassword} 
                        onChange={handleUpdate} 
                        style={inputStyle}
                    />
                    <button type="submit" style={submitButtonStyle}>Create Account</button>
                    
                    {/* ADDED BACK BUTTON */}
                    <button type="button" onClick={handleBackToLogin} style={backButtonStyle}>
                        Back to Login
                    </button>
                    
                </form>
            </div>
        </div>
    );
}