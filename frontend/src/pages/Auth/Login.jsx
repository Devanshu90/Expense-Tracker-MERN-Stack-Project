import React, { useState, useContext, useEffect } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import { LuMoon, LuSun } from 'react-icons/lu';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, seterror] = useState(null);

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    // Apply saved theme
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((previousMode) => !previousMode);
    };

    // Handle Login Form Submit
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            seterror('Please enter a valid email address.');
            return;
        }

        if (!password) {
            seterror('Please enter the password');
            return;
        }

        seterror('');

        // Login API Call
        try {
            const response = await axiosInstance.post(
                API_PATHS.AUTH.LOGIN,
                {
                    email,
                    password,
                }
            );

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(user);
                navigate('/dashboard');
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data.message
            ) {
                seterror(error.response.data.message);
            } else {
                seterror('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <AuthLayout>
            {/* Theme Toggle */}
            <button
                type="button"
                onClick={toggleDarkMode}
                className="fixed top-5 right-5 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-yellow-300 border border-gray-200 dark:border-gray-600 shadow-md hover:scale-105 transition-all duration-300"
                title={
                    darkMode
                        ? 'Switch to Light Mode'
                        : 'Switch to Dark Mode'
                }
            >
                {darkMode ? (
                    <LuSun className="text-xl" />
                ) : (
                    <LuMoon className="text-xl" />
                )}
            </button>

            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">

                <h3 className="text-lg font-semibold text-black dark:text-white">
                    Welcome Back
                </h3>

                <p className="text-sm text-slate-700 dark:text-slate-300 mt-15.25 mb-6">
                    Please enter your details to log in
                </p>

                <form onSubmit={handleLogin}>

                    <Input
                        value={email}
                        onChange={({ target }) =>
                            setEmail(target.value)
                        }
                        label="Email Address"
                        placeholder="Sashika@example.com"
                        type="text"
                    />

                    <Input
                        value={password}
                        onChange={({ target }) =>
                            setPassword(target.value)
                        }
                        label="Password"
                        placeholder="Min 8 Character"
                        type="password"
                    />

                    {error && (
                        <p className="text-red-500 text-sm font-medium">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        LOGIN
                    </button>

                    <p className="text-[13px] text-slate-800 dark:text-slate-300 mt-3">
                        Don’t have an account?{' '}

                        <Link
                            className="font-medium text-primary underline"
                            to="/signup"
                        >
                            Sign up
                        </Link>
                    </p>

                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;