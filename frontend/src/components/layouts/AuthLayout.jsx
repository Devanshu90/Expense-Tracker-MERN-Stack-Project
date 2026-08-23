import React from 'react';
import CARD_2 from '../../assets/images/cards2.png';
import { LuTrendingUpDown } from 'react-icons/lu';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">

            {/* Left Section */}
            <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 bg-white dark:bg-gray-900 transition-colors duration-300">

                <h2 className="text-xl font-bold text-black dark:text-white transition-colors duration-300">
                    Finance Flow
                </h2>

                {children}
            </div>

            {/* Right Section */}
            <div className="hidden md:block w-[40vw] h-screen bg-violet-50 dark:bg-gray-900 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative transition-colors duration-300">

                {/* Top Decoration */}
                <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5" />

                {/* Middle Decoration */}
                <div className="w-48 h-56 rounded-[40px] border-20px border-fuchsia-600 absolute top-[30%] -right-10" />

                {/* Bottom Decoration */}
                <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5" />

                {/* Stats Card */}
                <div className="grid grid-cols-1 z-20 relative">
                    <StatsInfoCard
                        icon={<LuTrendingUpDown />}
                        label="Track Your Income & Expenses"
                        value="10,00,00,00,00,00,000"
                        color="bg-primary"
                    />
                </div>

                {/* Illustration */}
                <img
                    src={CARD_2}
                    alt="Finance illustration"
                    className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"
                />
            </div>
        </div>
    );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
    return (
        <div className="flex gap-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md shadow-purple-400/10 dark:shadow-gray-950/30 border border-gray-200/50 dark:border-gray-700 z-10 transition-colors duration-300">

            <div
                className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
            >
                {icon}
            </div>

            <div>
                <h6 className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {label}
                </h6>

                <span className="text-[20px] text-gray-900 dark:text-white">
                    ₹{value}
                </span>
            </div>
        </div>
    );
};