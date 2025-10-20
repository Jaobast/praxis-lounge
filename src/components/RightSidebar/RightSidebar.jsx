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

    const { chatUser, messages, deleteChat } = useContext(AppContext);
    const [msgImages, setMsgImages] = useState([]);
    const navigate = useNavigate();

    const handleDelete = async (chat) => {
        if (window.confirm(`Möchtest du den Chat mit ${chat.userData.name} wirklich löschen?`)) {
            await deleteChat(chat.rId, chat.messageId);
        }
    };

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

            <div className="button-absolute">
                <button className="button-back" onClick={() => navigate('/chat')} ><img src={assets.arrow_icon} alt="back_icon" /></button>
                <button className="button-delete" onClick={() => handleDelete(chatUser)}> <img src={assets.delete_icon} alt="delete_icon" /> </button>
            </div>

            <div className="rs-profile">
                {chatUser.userData.avatar
                    ? <img className="profile-img" src={chatUser.userData.avatar} alt="" />
                    : <img className="profile-img" src={assets.avatar_icon_accent} alt="" />
                }
                
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