import React from "react";
import './Start.css';
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Start = () => {

    const navigate = useNavigate();


    return (
        <div className="start">
            <div className="start-container">
                <img src={assets.logo_start} alt="" />

                <button
                    className="button"
                    onClick={() => navigate("/login")}
                >jetzt starten</button>
            </div>
            <img className="pflege-img" src={assets.img_pflege} alt="" />
        </div>
    )
}

export default Start