import { dbService } from "fbInstance";
import { React, useState, useEffect } from "react";

const Home = ({ userInfo }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        dbService.collection("nweets").orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setNweets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
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

    return (<>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="What's on your mind?" maxLength={120} onChange={onChange} value={nweet} />
            <input type="submit" value="Nweet" />
        </form>

        <div>
            <ul>
                {nweets.map(nweet => (
                    <li key={nweet.id}>
                        <h4>{nweet.text}</h4>
                    </li>
                ))}
            </ul>
        </div>
    </>
    );
}
export default Home;