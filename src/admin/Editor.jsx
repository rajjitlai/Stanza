import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../config/supabase"
import PoemEditor from "./BlogEditor"

const Editor = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const user = await getCurrentUser()
                if (!user) {
                    navigate('/login')
                    return
                }
                // Store user ID for later use
                localStorage.setItem('userId', user.id)
                setIsLoading(false)
            } catch (error) {
                console.error("Auth error:", error)
                navigate('/login')
            }
        }

        checkLogin()
    }, [navigate])

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return <PoemEditor />
}

export default Editor