import { useState } from 'react';
import { Link } from 'react-router-dom';

import PageAnimation from "../common/PageAnimation";

// appwrite config
import { createMagicURL } from "../config/appwrite";
import toast from 'react-hot-toast';

import bwp from "../../assets/images/built-with-appwrite.png"
import InputBox from '../components/InputBox';
import { MdEmail } from 'react-icons/md';

// eslint-disable-next-line react/prop-types
const AuthForm = ({ type }) => {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
            const redirectUrl = `${window.location.origin}/magic-url-redirect`;
            await createMagicURL(email, redirectUrl);
            setIsEmailSent(true);
            toast.success(`Login link sent successfully to ${email}. Please check your inbox.`);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <PageAnimation keyValue={type}>
            <section className="h-cover flex items-center justify-center flex-col-reverse md:flex-row gap-10">
                <div className="w-full md:w-1/2 p-3 flex flex-col gap-3">
                    <img src={bwp} alt="built-with-appwrite" className="w-[80%]" />
                    <h3 className="text-lg mt-4">You will receive a verification email from Appwrite</h3>
                    <p className="mt-2 text-xl">
                        Please ensure that you have access to the email address provided.
                        <br />
                        The verification link will be sent to your email and is valid for a limited time.
                        <br />
                        If you do not receive the link, check your spam folder or try resending the link.
                    </p>
                    <p className="mt-2 text-xl">
                        For any issues or assistance, please contact our <Link to="mailto:rjsblogg@gmail.com" className='text-xl underline' >support team.</Link>
                    </p>
                </div>
                <>
                    {isEmailSent
                        ?
                        <span className='text-3xl text-twitter'>
                            You can close this page now
                        </span>
                        :
                        <form onSubmit={handleEmailSubmit} className='flex items-center flex-col'>
                            <InputBox
                                icon={<MdEmail />}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                            <button type="submit" className='btn-dark'>Send</button>
                        </form>
                    }
                </>
            </section>
        </PageAnimation>
    );
};

export default AuthForm;
