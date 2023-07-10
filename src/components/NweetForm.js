import { dbService, storageService } from "fbInstance";
import { React, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetForm = ({ userInfo }) => {
    const [nweet, setNweet] = useState("");
    const [uploadImage, setUploadImage] = useState(null);
    const inputFileRef = useRef(null);

    const onSubmit = async (event) => {
        event.preventDefault();

        if (!nweet && !uploadImage) {
            return false;
        }

        const nweetRequest = {
            text: nweet,
            createdAt: Date.now(),
            createdBy: userInfo.uid,
            userName: userInfo.displayName,
        }

        if (uploadImage) {
            const attachmentRef = storageService.ref().child(`${getTodayYM()}/${userInfo.uid}_${Date.now()}`);
            const fileUploadResponse = await attachmentRef.putString(uploadImage, "data_url");
            const attachmentUrl = await fileUploadResponse.ref.getDownloadURL();
            nweetRequest["attachment"] = attachmentUrl;
        }

        await dbService.collection("nweets").add(nweetRequest);
        setNweet("");
        onClearAttachment();
    }

    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setNweet(value);
    }

    const onFileChange = (event) => {
        const {
            target: { files }
        } = event;
        const uploadFile = files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadFile);
        fileReader.onloadend = (event) => {
            const {
                target: { result }
            } = event;
            setUploadImage(result);
        }
    }

    const onClearAttachment = (event) => {
        setUploadImage(null);
        inputFileRef.current.value = null;
    }

    const getTodayYM = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        return today.getFullYear() + (month < 10 ? "0" + month : month);
    }

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={onChange} value={nweet} className="factoryInput__input" />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file" ref={inputFileRef} type="file" accept="image/*" onChange={onFileChange} style={{
                opacity: 0,
            }} />
            {uploadImage && (
                <div className="factoryForm__attachment">
                    <img src={uploadImage} style={{
                        backgroundImage: uploadImage,
                    }} />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
}

export default NweetForm;