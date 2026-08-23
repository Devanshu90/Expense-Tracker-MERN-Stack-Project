import React, { useContext, useEffect, useState } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../Cards/CharAvatar';
import { LuMoon, LuSun } from 'react-icons/lu';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    // Apply theme whenever darkMode changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((previousMode) => !previousMode);
    };

    const handleClick = (route) => {
        if (route === 'logout') {
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/login');
    };

    return (
        <div
            className="w-64 h-[calc(100vh-61px)] bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-700 p-5 sticky z-20 transition-colors duration-300"
            style={{ top: '61px' }}
        >

            {/* Profile */}
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">

                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="profile Image"
                        className="w-20 h-20 bg-slate-400 rounded-full"
                    />
                ) : (
                    <CharAvatar
                        fullName={user?.fullName}
                        width="w-20"
                        height="h-20"
                        style="text-xl"
                    />
                )}

                <h5 className="text-gray-950 dark:text-white font-medium leading-6">
                    {user?.fullName || ''}
                </h5>
            </div>

            {/* Navigation */}
            {SIDE_MENU_DATA.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${
                        activeMenu === item.label
                            ? 'text-white bg-primary'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                    } py-3 px-6 rounded-lg mb-3 transition-colors duration-200`}
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>
            ))}

            {/* Theme Toggle */}
            <button
                type="button"
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between text-[15px] text-gray-700 dark:text-gray-200 py-3 px-6 rounded-lg mt-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
                <div className="flex items-center gap-4">

                    {darkMode ? (
                        <LuMoon className="text-xl" />
                    ) : (
                        <LuSun className="text-xl" />
                    )}

                    <span>
                        {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>

                </div>

                {/* Toggle switch */}
                <div
                    className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${
                        darkMode
                            ? 'bg-primary'
                            : 'bg-gray-300'
                    }`}
                >
                    <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                            darkMode
                                ? 'translate-x-5'
                                : 'translate-x-0'
                        }`}
                    />
                </div>
            </button>

        </div>
    );
};

export default SideMenu;