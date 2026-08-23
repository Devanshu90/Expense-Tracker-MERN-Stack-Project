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
            <div className={`${className === "hidden" ? "hidden" : ""}`}>

                {label && (
                    <label className="text-[15px] font-bold text-slate-800 dark:text-gray-100">
                        {label}
                    </label>
                )}

                <div className="input-box flex items-center dark:bg-slate-800 dark:border-slate-700">

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
                        className={`w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                            className !== "hidden" ? "" : ""
                        }`}
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