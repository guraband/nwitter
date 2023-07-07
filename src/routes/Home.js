import { dbService, storageService } from "fbInstance";
import { React, useState, useEffect, useRef } from "react";
import Nweet from "components/Nweet"

const Home = ({ userInfo }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [uploadImage, setUploadImage] = useState(null);
    const inputFileRef = useRef(null);

    useEffect(() => {
        dbService.collection("nweets").orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setNweets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
    }, []);

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

    const onClearAttachment = () => {
        setUploadImage(null);
        inputFileRef.current.value = null;
    }

    const getTodayYM = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        return today.getFullYear() + (month < 10 ? "0" + month : month);
    }

    return (<>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={onChange} value={nweet} />
            <input ref={inputFileRef} type="file" accept="image/*" onChange={onFileChange} />
            {uploadImage && <>
                <img src={uploadImage} width={"50px"} />
                <button onClick={onClearAttachment}>Clear</button>
            </>}
            <input type="submit" value="Nweet" />
        </form>

        <div>
            {nweets.map((nweet) => (
                <Nweet key={nweet.id} nweet={nweet} isOwner={nweet.createdBy === userInfo.uid} />
            ))}
        </div>
    </>
    );
}
export default Home;