import { dbService, storageService } from "fbInstance";
import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        if (!isOwner) {
            return;
        }
        await dbService.doc(`nweets/${nweet.id}`).update({
            text: newNweet,
            updatedAt: Date.now(),
        });
        toggleEditMode();
    }

    const onDelete = async () => {
        if (!isOwner) {
            return;
        }
        const ok = window.confirm("Are you sure?");
        if (ok) {
            await dbService.doc(`nweets/${nweet.id}`).delete();
            if (nweet.attachment) {
                await storageService.refFromURL(nweet.attachment).delete();
            }
        }
    }

    return <div className="nweet">
        {
            isEditMode ? <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={onChange} value={newNweet}
                        required autoFocus className="formInpur" />
                    <input type="submit" value="Save" className="formBtn" />
                </form>
                <span onClick={toggleEditMode} className="formBtn cancelBtn">
                    Cancel
                </span>
            </> : <>
                {nweet.attachment && <img src={nweet.attachment} />}
                <h4>{nweet.text}</h4><label>{nweet.userName}</label>
                {isOwner && <>
                    <div class="nweet__actions">
                        <span onClick={onDelete}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditMode}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                </>}
            </>
        }

    </div>
};

export default Nweet;