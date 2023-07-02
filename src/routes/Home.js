import { React, useState } from "react";

const Home = () => {
    const [nweet, setNweet] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();
    }

    const onChange = () => { }

    return (<>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="submit" value="Nweet" />
        </form>
    </>
    );
}
export default Home;