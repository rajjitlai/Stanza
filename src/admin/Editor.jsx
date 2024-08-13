import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { account } from "../config/appwrite"
import BlogEditor from "./BlogEditor"
import PublishForm from "./PublishForm"

const Editor = () => {
    const navigate = useNavigate()
    const [editorState, setEditorState] = useState("editor")

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const user = await account.get();
                if (!user) {
                    navigate('/')
                }
            } catch (error) {
                navigate('/login')
            }
        };

        checkLogin();
    }, [navigate]);

    return (
        <>
            <BlogEditor />
            <PublishForm />
        </>
    )
}

export default Editor