import React from "react";
import { useNavigate } from "react-router-dom"
import { authService } from "fbInstance";

export default () => {
    const navigate = useNavigate();
    const onLogout = () => {
        authService.signOut();
        navigate("/");
    }

    return <>
        <span>Profile</span>
        <button onClick={onLogout}>Log Out</button>
    </>
};
