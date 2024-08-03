import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InputBox from "../components/InputBox";
import { MdMailOutline } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import PageAnimation from "../common/PageAnimation";

// appwrite config
import { createSession, account } from "../config/appwrite";

// eslint-disable-next-line react/prop-types
const AuthForm = ({ type }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateOtp = (otp) => {
        return otp.length === 6; // Assuming OTP is 6 digits
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email cannot be empty');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Invalid email format');
            return;
        }

        try {
            // eslint-disable-next-line no-unused-vars
            const { sessionToken, userId } = await createSession(email);
            setIsOtpSent(true);
            setUserId(userId);
            toast.success(`OTP sent successfully to ${email}. Please check your inbox.`);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (!validateOtp(otp)) {
            toast.error('OTP must be 6 digits');
            return;
        }

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await account.createSession(userId, otp);
            toast.success('OTP verified successfully. Redirecting to profile...');
            navigate('/profile');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <PageAnimation keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <form className="w-[80%] max-w-[400px]" onSubmit={isOtpSent ? handleOtpSubmit : handleEmailSubmit}>
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        Login to RJ&apos;s Blog<span className="text-main font-bold text-3xl">.</span>
                    </h1>

                    {!isOtpSent && (
                        <InputBox
                            type="email"
                            placeholder="example@example.com"
                            icon={<MdMailOutline />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}

                    {isOtpSent && (
                        <InputBox
                            type="text"
                            placeholder="Enter OTP"
                            icon={<IoKeyOutline />}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    )}

                    <button className="btn-dark center mt-14" type="submit">
                        {isOtpSent ? 'Verify OTP' : 'Login'}
                    </button>

                    <div className="relative flex items-center gap-2 m-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    {!isOtpSent && (
                        <button className="btn-dark capitalize flex items-center justify-center gap-4 w-[90%] center">
                            <FcGoogle className="w-5" />
                            Continue with Google
                        </button>
                    )}
                </form>
                <ToastContainer />
            </section>
        </PageAnimation>
    );
};

export default AuthForm;
