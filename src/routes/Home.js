import { dbService } from "fbInstance";
import { React, useState, useEffect } from "react";

const Home = () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    const getNweets = async () => {
        const dbNweets = await dbService.collection("nweets").get();
        dbNweets.forEach((document) => {
            const nweetObject = {
                ...document.data(),
                id: document.id,
            }
            setNweets((prev) => [nweetObject, ...prev]);
        });
    }

    useEffect(() => {
        getNweets();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            nweet,
            createdAt: Date.now()
        });
        setNweet("");
    }

    const onChange = (event) => {
        const {
            target: { value }
        } = event;
        setNweet(value);
    }

    console.log(nweets);

    return (<>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={onChange} value={nweet} />
            <input type="submit" value="Nweet" />
        </form>

        <div>
            <ul>
                {nweets.map(nweet => (
                    <li key={nweet.id}>
                        <h4>{nweet.nweet}</h4>
                    </li>
                ))}
            </ul>
        </div>
    </>
    );
}
export default Home;