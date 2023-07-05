import { dbService } from "fbInstance";
import { React, useState } from "react";

const Nweet = ({ nweet, isOwner }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [newNweet, setNewNweet] = useState(nweet.text);

    const toggleEditMode = () => setIsEditMode((prev) => !prev);

    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setNewNweet(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweet.id}`).update({
            text: newNweet,
            updatedAt: Date.now(),
        });
        toggleEditMode();
    }

    const onDelete = async () => {
        const ok = window.confirm("Are you sure?");
        if (ok) {
            await dbService.doc(`nweets/${nweet.id}`).delete();
        }
    }

    return <div>
        {
            isEditMode ? <>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={onChange} value={newNweet} />
                    <input type="submit" value="Save" />
                </form>
                <button onClick={toggleEditMode}>Cancel</button>
            </> : <><h4>{nweet.text}</h4><label>{nweet.userName}</label>
                {isOwner && <>
                    <button onClick={toggleEditMode}>수정</button>
                    <button onClick={onDelete}>삭제</button>
                </>}</>
        }

    </div>
};

export default Nweet;