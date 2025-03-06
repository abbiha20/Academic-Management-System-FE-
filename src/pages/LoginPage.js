import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import logo from '../public/RIU-Post-01-800x239.png';

const LoginPage = () => {
    let { loginUser } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const togglePasswordVisibility = () => {
        const passwordField = document.querySelector('#password');
        passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
    };

    const validateForm = () => {
        let newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns `true` if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            loginUser({
                preventDefault: () => {}, // Prevent default only once
                target: { username: { value: username }, password: { value: password } },
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="logo">
                    <img src={logo} alt="Riphah International University" />
                </div>
                <h1 className="login-title">Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username" className="input-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="input-field"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p className="error-message">{errors.username}</p>}

                    <label htmlFor="password" className="input-label">Password</label>
                    <div className="password-container">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="input-field"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                            👁️
                        </button>
                    </div>
                    {errors.password && <p className="error-message">{errors.password}</p>}

                    <a href="#" className="forgot-password">Forgot password?</a>
                    <hr className="divider" />
                    <input type="submit" className="login-button" value="Login" />
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
