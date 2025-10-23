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

                <section>

                    <div className="description-container">
                        <img src={assets.megaphone_icon} alt="" />
                        <div className="text">
                            <h3>Schnelle Kommunikation</h3>
                            <p>Tausche dich einfach und sicher mit deinen Kolleg*innen aus</p>
                        </div>
                    </div>

                    <div className="description-container">
                        <img src={assets.help_icon} alt="" />
                        <div className="text">
                            <h3>Wichtige Infos teilen</h3>
                            <p>Erhalte und sende Updates zu Patient*innen und Schichten</p>
                        </div>
                    </div>

                    <div className="description-container">
                        <img src={assets.thinking_icon} alt="" />
                        <div className="text">
                            <h3>Klär deine Fragen jederzeit</h3>
                            <p>Klär deine Zweifel jederzeit und überall</p>
                        </div>
                    </div>


                </section>

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