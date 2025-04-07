import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    console.log(formData)

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Register user using the fetch API
            const response = await fetch(`http://localhost:4000/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data);


            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.msg || 'Error registering user');
            }
        } catch (err) {
            setError('Server error, please try again later');
        }
    };

    return (
        <div className="flex flex-row md:flex-col  p-4 items-center justify-center m-4 min-h-screen">

            <div className="w-full md:w-1/2">
                <img
                    className="object-cover"
                    src="/Images/profileIcon.jpg"
                />
            </div>

            <div className="w-full md:w-1/3">
                <div className="mb-8">
                    <h1 className="text-xl font-semibold text-center">Get started</h1>
                    <p className="text-[#667085] text-center text-sm">
                        Already have an account? <a
                            href="/login"
                            className="text-[#5070FE] px-1 underline">
                            Sign in
                        </a>
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-full">
                        <label className="text-[#344054] text-sm">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            className="border p-2 border-[#D0D5DD] rounded-md text-sm"
                            placeholder="Enter your First Name"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="text-[#344054] text-sm">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            className="border p-2 border-[#D0D5DD] rounded-md text-sm"
                            placeholder="Enter your Last Name"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="text-[#344054] text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="border p-2 border-[#D0D5DD] rounded-md text-sm"
                            placeholder="Enter your Email"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex w-full">
                        <button
                            onClick={handleRegister}
                            className="bg-[#5070FE] text-[#FFFFFF] px-4 py-2 rounded-md w-full"
                        >
                            Register
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Register;
