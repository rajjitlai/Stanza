import { useParams } from "react-router-dom"
import PoemEditor from "./BlogEditor"

const Editor = () => {
    const { id } = useParams()
    return <PoemEditor poemId={id} />
}

export default Editor