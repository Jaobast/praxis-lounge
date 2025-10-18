import React, { useContext, useState, useEffect } from "react";
import "./Chat.css";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import ChatBox from "../../components/ChatBox/ChatBox";
import { AppContext } from "../../context/AppContext";
import useIsMobile from "../../context/useIsMobile";
import { Routes, Route } from "react-router-dom";

const Chat = () => {
    const { chatData, userData } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile(700);

    useEffect(() => {
        if (chatData && userData) {
            setLoading(false);
        }
    }, [chatData, userData]);

    if (loading) {
        return (
            <div className="chat">
                <p className="loading">Loading...</p>
            </div>
        );
    }

    return (
        <div className="chat">
            {isMobile ? (
                // 📱 Layout Mobile — usa rotas internas
                <div className="chat-mobile">
                    <Routes>
                        <Route index element={<LeftSidebar />} /> {/* /chat */}
                        <Route path="box" element={<ChatBox />} /> {/* /chat/box */}
                        <Route path="right" element={<RightSidebar />} /> {/* /chat/right */}
                    </Routes>
                </div>
            ) : (
                // 💻 Layout Desktop — tudo junto
                <div className="chat-container">
                    <LeftSidebar />
                    <ChatBox />
                    <RightSidebar />
                </div>
            )}
        </div>
    );
};

export default Chat;
