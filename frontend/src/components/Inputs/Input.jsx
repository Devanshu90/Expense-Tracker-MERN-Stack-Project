import React, { useState, forwardRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = forwardRef(
    (
        {
            value,
            onChange,
            placeholder,
            label,
            type,
            className = "",
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        const toggleShowPassword = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className={className === "hidden" ? "hidden" : ""}>
                {label && (
                    <label className="block mb-2 text-[15px] font-bold text-slate-800 dark:text-slate-200">
                        {label}
                    </label>
                )}

                <div
                    className="
                        input-box
                        flex
                        items-center
                        bg-white
                        border
                        border-slate-200
                        dark:bg-slate-800
                        dark:border-slate-700
                        dark:text-white
                        transition-colors
                    "
                >
                    <input
                        ref={ref}
                        type={
                            type === "password"
                                ? showPassword
                                    ? "text"
                                    : "password"
                                : type
                        }
                        placeholder={placeholder}
                        className="
                            w-full
                            bg-transparent
                            outline-none
                            text-gray-900
                            dark:text-white
                            placeholder:text-gray-500
                            dark:placeholder:text-gray-400
                        "
                        value={value}
                        onChange={(e) => onChange?.(e)}
                    />

                    {type === "password" && (
                        <>
                            {showPassword ? (
                                <FaRegEye
                                    size={22}
                                    className="text-primary cursor-pointer"
                                    onClick={toggleShowPassword}
                                />
                            ) : (
                                <FaRegEyeSlash
                                    size={22}
                                    className="text-slate-400 dark:text-slate-500 cursor-pointer"
                                    onClick={toggleShowPassword}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }
);

export default Input;