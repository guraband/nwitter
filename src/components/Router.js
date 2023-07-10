import { React, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn, userInfo, updateUserDisplayName }) => {
    return (
        <BrowserRouter>
            {isLoggedIn && <Navigation userInfo={userInfo} />}
            <div
                style={{
                    maxWidth: 890,
                    width: "100%",
                    margin: "0 auto",
                    marginTop: 80,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Routes>
                    {isLoggedIn ? (
                        <>
                            <Route exact path="/" element={<Home userInfo={userInfo} />} />
                            <Route exact path="/profile" element={<Profile userInfo={userInfo} updateUserDisplayName={updateUserDisplayName} />} />
                        </>) : (
                        <Route exact path="/" element={<Auth />} />
                    )}
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default AppRouter