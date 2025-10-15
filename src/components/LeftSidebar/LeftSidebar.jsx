import React from "react";
import './LeftSidebar.css'
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, where, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import { toast } from "react-toastify";

const LeftSidebar = () => {

    const navigate = useNavigate();

    const { userData, chatData, chatUser, setChatUser, messagesId, setMessagesId } = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    const inputHandler = async (e) => {
        try {
            const input = e.target.value;
            if (input) {
                setShowSearch(true);
                const userRef = collection(db, 'users');
                const q = query(userRef, where("username", "==", input.toLowerCase()));
                const querySnap = await getDocs(q);
                if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
                    let userExist = false;
                    chatData.map((user) => {
                        if (user.rId === querySnap.docs[0].data().id) {
                            userExist = true;
                        }
                    })
                    if (!userExist) {
                        setUser(querySnap.docs[0].data());
                    }
                } else {
                    setUser(null);
                }
            } else {
                setShowSearch(false);
            }
        } catch (error) {

        }
    }

    const addChat = async () => {
        const messagesRef = collection(db, "messages");
        const chatsRef = collection(db, "chats");
        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messagesRef: []
            })
            await updateDoc(doc(chatsRef, user.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userData.id,
                    updateAt: Date.now(),
                    messageSeen: true
                })
            })
            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: user.id,
                    updateAt: Date.now(),
                    messageSeen: true
                })
            })
            document.getElementById("input-search").value = "";
            setShowSearch(false);
            setUser(null);
        } catch (error) {
            toast.error(error.message);

        }
    }

    const setChat = async (item) => {
        setMessagesId(item.messageId);
        setChatUser(item);

        const userChatsRef = doc(db, 'chats', userData.id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        const userChatsData = userChatsSnapshot.data();
        const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
        userChatsData.chatsData[chatIndex].messageSeen = true;
        await updateDoc(userChatsRef, {
            chatsData: userChatsData.chatsData
        })

    }


    return (
        <div className="ls">
            <div className="ls-top">

                <div className="ls-nav">
                    <img src={assets.logo} className="logo" alt="logo" />
                    <div className="menu">
                        <div className="point">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className="sub-menu-container">
                            <div className="sub-menu">
                                <p onClick={() => navigate('/profile')} >Profil bearbeiten</p>
                                <hr />
                                <p>Abmelden</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ls-search">
                    <label htmlFor="input-search"><img src={assets.search_icon} alt="" /></label>
                    <input
                        onChange={inputHandler}
                        type="text" placeholder="search here..." id="input-search" />
                </div>
            </div>

            <div className="ls-list">
                {showSearch && user
                    ? <div onClick={addChat} className="friends add-user">
                        <img src={user.avatar} alt="" />
                        <p>{user.name}</p>
                    </div>
                    : chatData.map((item, index) => (
                        <div onClick={() => { setChat(item) }} key={index}
                            className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
                            <img src={item.userData.avatar} alt="" />
                            <div>
                                <p>{item.userData.name}</p>
                                <span>{item.lastMessage}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default LeftSidebar