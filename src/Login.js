import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';

const API_KEY = "AIzaSyBRofV0Iqo9WxxQA__z7B2rwbIJ6I7H8ak"; // Your Firebase API Key

function Login() {
    const [action, setAction] = useState('Log In');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        const signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
        try {
            const response = await fetch(signupUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error.message);
            }

            // Create a user document in Firestore
            const userDocUrl = `https://firestore.googleapis.com/v1/projects/shopping-c66b2/databases/(default)/documents/users/${data.localId}`;
            await fetch(userDocUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        userId: { stringValue: data.localId },
                        username: { stringValue: name },
                        email: { stringValue: email },
                        cart: { arrayValue: { values: [] } },
                        orders: { arrayValue: { values: [] } }
                    }
                })
            });

            alert("User created successfully");
            setAction("Log In");
        } catch (error) {
            console.error("Error in signup:", error.message);
        }
    };

    const handleLogin = async () => {
        const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error.message);
            }
            localStorage.setItem('userId', data.localId);
            localStorage.setItem('token', data.idToken);

            navigate('/');
        } catch (error) {
            alert("You cannot be logged in. Check your email or password.");
            console.error("Error in login:", error.message);
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action === "Sign Up" && (
                    <>
                        <div className='input'>
                            <img src={user_icon} alt='' />
                            <input type='text' placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
                        <div className='input'>
                            <img src={email_icon} alt='' />
                            <input type='email' placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className='input'>
                            <img src={password_icon} alt='' />
                            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <button className='submit' onClick={handleSignup}>Create Account</button>
                    </>
                )}
                {action === "Log In" && (
                    <>
                        <div className='input'>
                            <img src={email_icon} alt='' />
                            <input type='email' placeholder='Email Id' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className='input'>
                            <img src={password_icon} alt='' />
                            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <button className='submit' onClick={handleLogin}>Login</button>
                    </>
                )}
            </div>
            {action === "Log In" && (
                <p className='action-link' onClick={() => setAction("Sign Up")}>Not registered? Click Signup.</p>
            )}
            {action === "Sign Up" && (
                <p className='action-link' onClick={() => setAction("Log In")}>Already have an account? Log In</p>
            )}
        </div>
    );
}

export default Login;
