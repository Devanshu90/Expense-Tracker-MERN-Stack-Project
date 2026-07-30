import React from 'react';

const Login = () => {
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4" md:h-full flex flex-col justify-center>
      <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
      <p className="text-sm text-gray-500">Please enter your details to login.</p>
      </div>
    </AuthLayout>
  );
}

export default Login;