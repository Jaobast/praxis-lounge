import React from "react";
import './RightSidebar.css'
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import { useContext } from "react";
import { AppContext } from '../../context/AppContext'
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RightSidebar = () => {

    const { chatUser, messages } = useContext(AppContext);
    const [msgImages, setMsgImages] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        let tempVar = [];
        messages.map((msg) => {
            if (msg.image) {
                tempVar.push(msg.image)
            }
        })
        setMsgImages(tempVar);

    }, [messages])


    return chatUser ? (
        <div className="rs">
            <button className="button-back" onClick={() => navigate('/chat')} ><img src={assets.arrow_icon} alt="" /></button>
            
            <div className="rs-profile">
                <img className="profile-img" src={chatUser.userData.avatar} alt="profile pic" />
                <div className="rs-text">
                    <div className="online-name">
                        {Date.now() - chatUser.userData.lastSeen <= 70000
                        ? <img src={assets.green_dot} className="dot" alt="online" />
                        : <img src={assets.lila_dot} className="dot" alt="offline" />}
                        <h3>{chatUser.userData.name}</h3>
                    </div>
                    <p>{chatUser.userData.bio}</p>
                </div>
            </div>

            <div className="rs-media">
                <p>Media</p>
                <div>
                    {msgImages.map((url, index) => (
                        <img
                            onClick={() => window.open(url)}
                            key={index} src={url} alt={`media picture-${index}`} />
                    ))}
                </div>
            </div>
        </div>
    )

        : null
}

export default RightSidebar