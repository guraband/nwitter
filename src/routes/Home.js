import { dbService } from "fbInstance";
import { React, useState, useEffect } from "react";
import Nweet from "components/Nweet"
import NweetForm from "components/NweetForm";

const Home = ({ userInfo }) => {
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        dbService.collection("nweets").orderBy("createdAt", "desc")
            .onSnapshot(snapshot => {
                setNweets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
    }, []);

    return (<>
        <div className="container">
            <NweetForm userInfo={userInfo} />
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweet={nweet} isOwner={nweet.createdBy === userInfo.uid} />
                ))}
            </div>
        </div>
    </>
    );
}
export default Home;