import { authService } from "fbInstance";
import React from "react";

const logOut = () => {
    authService.signOut();
}

const Home = () => {
    return <>
        <span>Home</span>;
        <span onClick={logOut}>Log Out</span>;
    </>
}
export default Home;