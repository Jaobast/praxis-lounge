import React from "react";
import './LeftSidebar.css'
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, where, updateDoc, getDoc } from "firebase/firestore";
import { db, logout } from "../../config/firebase";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import { toast } from "react-toastify";
import useIsMobile from "../../context/useIsMobile";
import ChatBox from "../ChatBox/ChatBox";

const LeftSidebar = () => {

    const navigate = useNavigate();

    const { userData, chatData, chatUser, setChatUser, messagesId, setMessagesId } = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const isMobile = useIsMobile(700);

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
        try {
            // 1️⃣ Atualiza o estado do chat atual
            setMessagesId(item.messageId);
            setChatUser(item);

            // 2️⃣ Marca como lida a conversa do usuário
            const userChatsRef = doc(db, 'chats', userData.id);
            const userChatsSnapshot = await getDoc(userChatsRef);
            const userChatsData = userChatsSnapshot.data();

            const chatIndex = userChatsData.chatsData.findIndex(
                (c) => c.messageId === item.messageId
            );
            if (chatIndex !== -1) {
                userChatsData.chatsData[chatIndex].messageSeen = true;
                await updateDoc(userChatsRef, {
                    chatsData: userChatsData.chatsData,
                });
            }

            // 3️⃣ Aguarda leve delay para o contexto atualizar
            setTimeout(() => {
                if (isMobile) navigate('/chat/box');
            }, 100);

        } catch (error) {
            console.error("Erro ao abrir o chat:", error);
            toast.error("Não foi possível abrir o chat.");
        }
    };



    return (
        <div className="ls">
            <div className="ls-container">
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
                            type="text" placeholder="Profil suchen..." id="input-search" />
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

            <button onClick={() => logout()} >Abmelden</button>
        </div>
    )
}

export default LeftSidebar