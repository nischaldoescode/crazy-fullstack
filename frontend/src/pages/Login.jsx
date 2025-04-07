import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false); // Track if code was sent

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'code') {
            setCode(e.target.value);
        }
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsCodeSent(true);
                setError('');
            } else {
                setError(data.msg || 'Error sending code');
            }
        } catch (err) {
            setError('Server error, please try again later');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/users/check-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();
            console.log(data)
            localStorage.setItem("userInformation", JSON.stringify(data.data.user));
            setUser(data.data.user)
            if (response.ok) {

                navigate('/');
            } else {
                setError(data.msg || 'Invalid login credentials');
            }
        } catch (err) {
            setError('Server error, please try again later');
        }
    };

    return (
        <div className="flex flex-col p-4 items-center m-4 min-h-screen">
            <div className="w-1/3">
                <div className="mb-8">
                    <h1 className="text-xl font-semibold text-center">Log In</h1>
                    <p className="text-[#667085] text-center text-sm">
                        Don't have an account? <a
                            href="/register"
                            className="text-[#5070FE] px-1 underline">
                            Sign up
                        </a>
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-full">
                        <label className="text-[#344054] text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="border p-2 border-[#D0D5DD] rounded-md text-sm"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={handleChange}
                            disabled={isCodeSent} // Disable input once code is sent
                        />
                    </div>

                    {!isCodeSent ? (
                        <div className="flex w-full">
                            <button
                                onClick={handleSendCode}
                                className="bg-[#5070FE] text-[#FFFFFF] px-4 py-2 rounded-md w-full"
                            >
                                Send Code
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col w-full">
                                <label className="text-[#344054] text-sm">Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    className="border p-2 border-[#D0D5DD] rounded-md text-sm"
                                    placeholder="Enter the code sent to your email"
                                    value={code}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex w-full">
                                <button
                                    onClick={handleLogin}
                                    className="bg-[#5070FE] text-[#FFFFFF] px-4 py-2 rounded-md w-full"
                                >
                                    Login
                                </button>
                            </div>
                        </>
                    )}

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
