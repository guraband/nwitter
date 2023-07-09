import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { authService, dbService } from "fbInstance";

export default ({ userInfo, updateUserDisplayName }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userInfo.displayName);
    const onLogout = () => {
        authService.signOut();
        navigate("/");
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        if (userInfo.displayName === newDisplayName) {
            return false;
        }

        await userInfo.updateProfile({
            displayName: newDisplayName
        });
        updateUserDisplayName(newDisplayName);
    }

    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setNewDisplayName(value);
    }

    const getMyNweets = async () => {
        const myNweets = await dbService.collection("nweets")
            .where("createdBy", "==", userInfo.uid)
            .orderBy("createdAt", "desc")
            .get();
        console.log(myNweets.docs.map((nweet) => console.log(nweet.data())));
    }

    useEffect(() => {
        getMyNweets();
    }, []);

    return <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="New DisplayName" maxLength={20} onChange={onChange} value={newDisplayName} />
            <input type="submit" value="Update" />
        </form>
        <span>Profile</span>
        <button onClick={onLogout}>Log Out</button>
    </>
};
