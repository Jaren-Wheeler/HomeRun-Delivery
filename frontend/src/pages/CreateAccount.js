import React, { useState } from 'react';

export default function CreateAccount() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "purchaser",
        password: "",
        confirmPassword: ""
    });
    
    const handleUpdate = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            role: formData.role ? "deliverer" : "purchaser"
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
    <div className="login-Bg">
        <div className="login-card">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" placeholder="First Name" required value={formData.first_name} onChange={handleUpdate}/>
                <input type="text" name="last_name" placeholder="Last Name" required value={formData.last_name} onChange={handleUpdate} />
                <input type="text" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleUpdate} />
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleUpdate} />
                <div className="checkbox-container">
                <label htmlFor="role">Do you want to be a delivery driver?</label>
                    <input type="checkbox" name="role"
                        onChange={(e) =>
                            setFormData(prev => ({
                            ...prev,
                            role: e.target.checked ? "deliverer" : "purchaser"
                            }))
                        }
                    />
                </div>
                <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleUpdate} />
                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleUpdate} />
                <button type="submit">Create Account</button>
        
            </form>
        </div>
    </div>
    );
}
    