import React, { useState, useContext, useEffect } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadimage';
import { LuMoon, LuSun } from 'react-icons/lu';

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

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

    // Handle Sign Up Form Submit
    const handleSignUp = async (e) => {
        e.preventDefault();

        let profileImageUrl = '';

        if (!fullName) {
            setError('Please enter your name');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!password) {
            setError('Please enter the password');
            return;
        }

        setError('');

        // SignUp API Call
        try {
            // Upload image if present
            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || '';
            }

            const response = await axiosInstance.post(
                API_PATHS.AUTH.REGISTER,
                {
                    fullName,
                    email,
                    password,
                    profileImageUrl,
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
                setError(error.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
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

            <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">

                <h3 className="text-lg font-semibold text-black dark:text-white">
                    Create an Account
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mt-1">
                    Join us today by entering your details below.
                </p>

                <form onSubmit={handleSignUp}>

                    <ProfilePhotoSelector
                        image={profilePic}
                        setImage={setProfilePic}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Input
                            value={fullName}
                            onChange={({ target }) =>
                                setFullName(target.value)
                            }
                            label="Full Name"
                            placeholder="Sashika"
                            type="text"
                        />

                        <Input
                            value={email}
                            onChange={({ target }) =>
                                setEmail(target.value)
                            }
                            label="Email Address"
                            placeholder="Sashika@example.com"
                            type="text"
                        />

                        <div className="col-span-2">
                            <Input
                                value={password}
                                onChange={({ target }) =>
                                    setPassword(target.value)
                                }
                                label="Password"
                                placeholder="Min 8 Character"
                                type="password"
                            />
                        </div>

                    </div>

                    {error && (
                        <p className="text-red-500 text-sm font-medium">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        SIGN UP
                    </button>

                    <p className="text-[13px] text-slate-800 dark:text-slate-300 mt-3">
                        Already have an account?{' '}

                        <Link
                            className="font-medium text-primary underline"
                            to="/login"
                        >
                            login
                        </Link>
                    </p>

                </form>
            </div>
        </AuthLayout>
    );
};

export default SignUp;