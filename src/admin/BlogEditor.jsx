import { Link } from "react-router-dom"
import PageAnimation from "../common/PageAnimation"
import defaultBanner from "../../assets/resources/defaultBanner.svg"

const BlogEditor = () => {
    const handleBannerUpload = (e) => {
        let img = e.target.files[0]

        console.log(img)
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none">
                    RJ&apos;s BLOG<span className="text-main text-[20px] font-bold">.</span>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    New Blog
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2">
                        Publish
                    </button>
                    <button className="btn-light py-2">
                        Draft
                    </button>
                </div>
            </nav>

            <PageAnimation>
                <section>
                    <div className="mx-auto max-w-[900px]">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img
                                    src={defaultBanner}
                                    className="z-20"
                                />
                                <input id="uploadBanner" type="file"
                                    accept=".png, .jpg, .jpeg, .gif"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                    </div>
                </section>
            </PageAnimation>
        </>  
    )
}

export default BlogEditor