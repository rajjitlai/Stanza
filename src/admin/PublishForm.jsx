import { useState } from "react"
import toast from "react-hot-toast"

const PublishForm = () => {
    const [isPublishing, setIsPublishing] = useState(false)

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            // Publish functionality can be added here
            toast.success("Poem published successfully!")
        } catch (error) {
            toast.error(`Error: ${error.message}`)
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="p-4 border border-grey rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Publish Options</h3>
            <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="btn-dark w-full"
            >
                {isPublishing ? "Publishing..." : "Publish Poem"}
            </button>
        </div>
    )
}

export default PublishForm