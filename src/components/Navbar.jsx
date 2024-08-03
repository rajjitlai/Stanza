import { Link, Outlet } from "react-router-dom"
import { FcSearch } from "react-icons/fc";
import { useState } from "react";
import { RiFileEditLine } from "react-icons/ri";

const Navbar = () => {
    const [searchToggle, setSearchToggle] = useState(false)

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none text-[20px] font-bold text-nowrap">
                    RJ&apos;s BLOG<span className="text-main text-[20px] font-bold">.</span>
                </Link>
                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (
                    searchToggle ? "show" : "hide"
                )}>
                    <input type="text" placeholder="Search..." className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full border-none outline-none placeholder:text-dark-grey md:pl-12" />
                    <FcSearch className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey" />
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => setSearchToggle(currentVal => !currentVal)}
                    >
                        <FcSearch className="text-xl" />
                    </button>

                    <Link to="/editor" className="hidden md:flex gap-2 link items-center justify-center rounded-full">
                        <RiFileEditLine />
                        <p>Write</p>
                    </Link>

                    <Link className="btn-dark py-2" to="/login">
                        Login
                    </Link>
                </div>
            </nav>
            
            <Outlet />
        </>
    )
}

export default Navbar