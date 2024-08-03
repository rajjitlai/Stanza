import { account } from "../config/appwrite"

const Profile = () => {
    const user = account.get()
    console.log(user)

    return (
        <div>
            <h1>Profile</h1>
            <span></span>
        </div>
    )
}

export default Profile