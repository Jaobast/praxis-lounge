import React from "react";
import './ChatBox.css'
import assets from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {

    const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);

    const [input,setInput] = useState("");

    const sendMessage = async()=>{
        try {
            if (input && messagesId) {
                await updateDoc(doc(db,'messages',messagesId),{
                    messages: arrayUnion({
                        sId:userData.id,
                        text:input,
                        createdAt:new Date()
                    })
                })

                const userIDs =[ chatUser.rId,userData.id];
                userIDs.forEach(async(id) => {
                   const userChatsRef = doc(db,'chats',id);
                   const userChatsSnapshot = await getDoc(userChatsRef);

                   if (userChatsSnapshot.exists()) {
                    const userChatData = userChatsSnapshot.data();
                    const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messagesId);
                    userChatData.chatsData[chatIndex].lastMessage = input.slice(0,30);
                    userChatData.chatsData[chatIndex].updatedAt = Date.now();
                    if (userChatData.chatsData[chatIndex].rId == userData.id) {
                        userChatData.chatsData[chatIndex].messageSeen = false;
                    }
                    await updateDoc(userChatsRef,{
                        chatsData:userChatData.chatsData
                    })
                   }
                });
            }
        } catch (error) {
            toast.error(error.message)
        }
        setInput("");
    }

    const convertTimestamp = (timestamp) =>{
        let date = timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return hour + ":" + minute;
    }

    useEffect(()=>{
        if (messagesId) {
            const unSub = onSnapshot(doc(db,'messages',messagesId),(res)=>{
                setMessages(res.data().messages.reverse())
            })
            return() =>{
                unSub();
            }
        }
    },[messagesId])

    return chatUser ? (
        <div className="chat-box" >

            <div className="chat-user">
                <img className="profile-img" src={chatUser.userData.avatar} alt="person" />
                <p>{chatUser.userData.name}<img src={assets.green_dot} className="dot" alt="online" /> </p>
                <img src={assets.help_icon} alt="help icon" className="help" />
            </div>

            <div className="chat-msg">

                {messages.map((msg,index)=>(
                    <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
                        <p className="msg">{msg.text}</p>
                        <div>
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="Foto der Person" />
                            <p>{convertTimestamp(msg.createdAt)}</p>
                        </div>
                    </div>
                ))}

            </div>

            <div className="chat-input">
                <input
                    onChange={(e)=>setInput(e.target.value)} value={input}
                    type="text" placeholder="Nachricht schreiben" className="input-text" />
                <input type="file" id="image" accept="image/png, image/jpeg, image/jpg" hidden />
                <label htmlFor="image">
                    <svg width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_4061_765)">
                            <path d="M87.2647 0H12.8578C5.79657 0 0 6.47059 0 14.3529V85.6471C0 93.5294 5.79657 100 12.8578 100H87.2647C94.326 100 100.123 93.5294 100.123 85.6471V14.3529C100.123 6.47059 94.326 0 87.2647 0ZM12.8578 7.52941H87.2647C90.6373 7.52941 93.3775 10.5882 93.3775 14.3529V48.7059L80.625 34.5882C78.4118 32.1176 74.723 32.1176 72.4044 34.5882L48.1642 61.6471L37.3088 49.4118C35.0956 46.9412 31.4069 46.9412 29.0882 49.4118L6.7451 74.4706V14.3529C6.7451 10.5882 9.4853 7.52941 12.8578 7.52941Z" fill="currentColor" />
                            <path d="M52.8752 27.5C52.8752 33.2167 48.2085 38 42.3752 38C36.5419 38 31.8752 33.3333 31.8752 27.5C31.8752 21.6667 36.5419 17 42.3752 17C48.2085 17 52.8752 21.6667 52.8752 27.5Z" fill="currentColor" />
                        </g>
                        <rect x="3.5" y="3.5" width="93.1226" height="93" rx="46.5" stroke="currentColor" strokeWidth="7" />
                        <defs>
                            <clipPath id="clip0_4061_765">
                                <rect width="100.123" height="100" rx="50" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </label>
                <svg
                    onClick={sendMessage}
                    className="send-button" width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.281555" width="100.122" height="100" rx="50" fill="currentColor" />
                    <path d="M50 77V28M50 28L34 42M50 28L65.5 42" stroke="white" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

        </div>
    )

    : <div className="chat-welcome" >
        <img src={assets.logo_text_pink} alt="" />
    </div>
}

export default ChatBox