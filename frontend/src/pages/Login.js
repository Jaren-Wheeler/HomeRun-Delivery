import { useState } from "react"

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

        try{
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

                if(!response.ok) {
                    throw new Error('Login failed');
                }

                alert("Login successful!");
                window.location.href = '/home';
        }catch (error) {
            console.error("There was an error logging in!", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" id="email" placeholder="Email" required value={formData.email} onChange={handleUpdate} />
            <input type="password" name="password" id="password" placeholder="Password" required value={formData.password} onChange={handleUpdate} />
            <button type="submit">Login</button>
        </form>
    );
}