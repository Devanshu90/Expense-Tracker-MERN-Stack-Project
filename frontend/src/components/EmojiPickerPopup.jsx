import React, { useEffect, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(
                document.documentElement.classList.contains("dark")
            );
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
            <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <div
                    className="
                        w-12
                        h-12
                        flex
                        items-center
                        justify-center
                        text-2xl
                        bg-purple-50
                        dark:bg-purple-950/40
                        text-primary
                        rounded-lg
                        transition-colors
                    "
                >
                    {icon ? (
                        <img
                            src={icon}
                            alt="Icon"
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    ) : (
                        <LuImage />
                    )}
                </div>

                <p className="text-gray-900 dark:text-gray-100">
                    {icon ? "Change Icon" : "Pick Icon"}
                </p>
            </div>

            {isOpen && (
                <div className="relative">
                    <button
                        type="button"
                        aria-label="Close emoji picker"
                        className="
                            w-7
                            h-7
                            flex
                            items-center
                            justify-center
                            bg-white
                            dark:bg-slate-800
                            border
                            border-gray-200
                            dark:border-slate-700
                            text-gray-600
                            dark:text-gray-300
                            hover:bg-gray-100
                            dark:hover:bg-slate-700
                            rounded-full
                            absolute
                            -top-2
                            -right-2
                            z-10
                            cursor-pointer
                            transition-colors
                        "
                        onClick={() => setIsOpen(false)}
                    >
                        <LuX size={16} />
                    </button>

                    <EmojiPicker
                        open={isOpen}
                        theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                        onEmojiClick={(emoji) =>
                            onSelect(emoji?.imageUrl || "")
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiPickerPopup;