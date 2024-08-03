import { useState, forwardRef } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
const InputBox = forwardRef(({ name, type, id, value, placeholder, icon, error, ...rest }, ref) => {
    const [passVisible, setPassVisible] = useState(false);

    return (
        <div className="relative w-[100%] mb-4">
            <input
                name={name}
                type={type === "password" ? (passVisible ? "text" : "password") : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className="input-box"
                ref={ref}
                {...rest}
            />
            <span className="input-icon">{icon}</span>
            {type === "password" && (
                <span className="input-icon left-[auto] right-4 cursor-pointer" onClick={() => setPassVisible(prev => !prev)}>
                    {passVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </span>
            )}
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
        </div>
    );
});

InputBox.displayName = 'InputBox';

export default InputBox;