import React, { useContext, useRef, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadimage";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const { user, updateUser } = useContext(UserContext);

    // Open file picker
    const handleProfileClick = () => {
        if (!uploading) {
            fileInputRef.current?.click();
        }
    };

    // Handle profile image upload
    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, JPEG, PNG, or WEBP image.");
            event.target.value = "";
            return;
        }

        // Validate file size - 5 MB
        if (file.size > 5 * 1024 * 1024) {
            alert("Profile image must be less than 5 MB.");
            event.target.value = "";
            return;
        }

        try {
            setUploading(true);

            const response = await uploadImage(file);

            // Update UserContext with the updated user
            if (response?.user) {
                updateUser(response.user);
            } else if (response?.imageUrl && user) {
                updateUser({
                    ...user,
                    profileImageUrl: response.imageUrl,
                });
            }

            alert("Profile photo updated successfully.");
        } catch (error) {
            console.error("Profile image upload failed:", error);

            const message =
                error?.response?.data?.message ||
                "Failed to upload profile photo. Please try again.";

            alert(message);
        } finally {
            setUploading(false);

            // Allow selecting the same file again
            event.target.value = "";
        }
    };

    // Get user's initials when no profile image exists
    const getInitials = () => {
        if (!user?.fullName) {
            return "U";
        }

        return user.fullName
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="flex items-center justify-between gap-5 bg-white dark:bg-gray-800 border border-b border-gray-200/50 dark:border-gray-700 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 transition-colors duration-300">

            <div className="flex items-center gap-5">

                <button
                    className="block text-black dark:text-white"
                    onClick={() => {
                        setOpenSideMenu(!openSideMenu);
                    }}
                >
                    {openSideMenu ? (
                        <HiOutlineX className="text-2xl" />
                    ) : (
                        <HiOutlineMenu className="text-2xl" />
                    )}
                </button>

                <h2 className="text-lg font-medium text-black dark:text-white">
                    Finance Flow
                </h2>

                {openSideMenu && (
                    <div className="fixed top-15.25 -ml-4 bg-white dark:bg-gray-800">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                )}
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-3">

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                />

                <button
                    type="button"
                    onClick={handleProfileClick}
                    disabled={uploading}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
                    title={
                        uploading
                            ? "Uploading..."
                            : "Click to change profile photo"
                    }
                >
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt={user.fullName || "Profile"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials()}
                        </div>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </button>

                {user?.fullName && (
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {user.fullName}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;