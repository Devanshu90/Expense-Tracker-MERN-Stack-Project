import React from "react";

const AuthLayout = ({children}) => {
    return (
        <div className ="w-screen h-screen flex flex-col justify-center items-center bg-gray-100">
            <h2 className="text-2xl font-bold text-black">Expense Tracker</h2>
            {children}
        </div>  
    )
}

export default AuthLayout;