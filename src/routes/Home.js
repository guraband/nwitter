import { dbService } from "fbInstance";
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
        if (!nweet) {
            return false;
        }

        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            createdBy: userInfo.uid,
            userName: userInfo.displayName,
        });
        setNweet("");
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

    const onClearClick = () => {
        setUploadImage(null);
        inputFileRef.current.value = null;
    }

    return (<>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={onChange} value={nweet} />
            <input ref={inputFileRef} type="file" accept="image/*" onChange={onFileChange} />
            {uploadImage && <>
                <img src={uploadImage} width={"50px"} />
                <button onClick={onClearClick}>Clear</button>
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