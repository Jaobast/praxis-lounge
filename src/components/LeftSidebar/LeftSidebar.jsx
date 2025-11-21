import React from "react";
import './LeftSidebar.css';
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, where, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import { toast } from "react-toastify";
import useIsMobile from "../../context/useIsMobile";
// import ChatBox from "../ChatBox/ChatBox"; // Não usado aqui
import ToolBar from "../ToolBar/ToolBar";

const LeftSidebar = () => {

    const navigate = useNavigate();

    // Removido 'chatUser', 'setChatUser' pois não são usados diretamente aqui no escopo, mas mantido por estar no original
    const { userData, chatData, setChatUser, messagesId, setMessagesId } = useContext(AppContext);
    
    // ATUALIZAÇÃO: Mudança de 'user' para 'foundUsers' (array)
    // const [user, setUser] = useState(null); // REMOVER
    const [foundUsers, setFoundUsers] = useState([]); // NOVO ESTADO PARA MÚLTIPLOS USUÁRIOS
    
    const [showSearch, setShowSearch] = useState(false);
    const isMobile = useIsMobile(700);

const inputHandler = async (e) => {
    try {
        const input = e.target.value.trim().toLowerCase();
        if (input) {
            setShowSearch(true);
            const userRef = collection(db, 'users');
            const q = query(
                userRef,
                where("username", ">=", input),
                where("username", "<=", input + "\uf8ff")
            );

            const querySnap = await getDocs(q);

            if (!querySnap.empty) {

                // Mapeia todos os documentos para objetos de dados
                const allUsers = querySnap.docs.map(doc => doc.data());
                
                // Filtra para remover o próprio usuário e aqueles que já estão na lista de chats
                const newFoundUsers = allUsers.filter(u => 
                    u.id !== userData.id && !chatData.some(chat => chat.rId === u.id)
                );

                // ATUALIZAÇÃO: Armazena a lista inteira
                setFoundUsers(newFoundUsers);
                
            } else {
                // ATUALIZAÇÃO: Limpa a lista se nada for encontrado
                setFoundUsers([]);
            }
        } else {
            setShowSearch(false);
            // ATUALIZAÇÃO: Limpa a lista quando o input está vazio
            setFoundUsers([]);
        }
    } catch (error) {
        console.error("Erro na busca:", error);
    }
};


    // ATUALIZAÇÃO: Recebe o usuário como argumento
    const addChat = async (userToAdd) => {
        const messagesRef = collection(db, "messages");
        const chatsRef = collection(db, "chats");
        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messagesRef: []
            })
            // Usa userToAdd.id
            await updateDoc(doc(chatsRef, userToAdd.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userData.id,
                    updateAt: Date.now(),
                    messageSeen: true
                })
            })
            // Usa userToAdd.id
            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userToAdd.id,
                    updateAt: Date.now(),
                    messageSeen: true
                })
            })
            document.getElementById("input-search").value = "";
            setShowSearch(false);
            // ATUALIZAÇÃO: Limpa a lista de usuários encontrados
            setFoundUsers([]);
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
                    </div>

                    <div className="ls-search">
                        <label htmlFor="input-search"><img src={assets.search_icon} alt="" /></label>
                        <input
                            onChange={inputHandler}
                            type="text" placeholder="Profil suchen..." id="input-search" />
                    </div>
                </div>

                <div className="ls-list">
                    {/* ATUALIZAÇÃO: Itera sobre a lista de usuários encontrados (foundUsers) */}
                    {showSearch && foundUsers.length > 0
                        ? foundUsers.map((userFound) => (
                            <div onClick={() => addChat(userFound)} key={userFound.id} className="friends add-user">
                                <img src={userFound.avatar} alt="" />
                                <p>{userFound.name}</p>
                            </div>
                        ))
                        : showSearch && foundUsers.length === 0
                        ? <p style={{ textAlign: 'center', padding: '10px' }}>Nenhum perfil encontrado.</p>
                        : chatData.map((item, index) => (
                            <div onClick={() => { setChat(item) }} key={index}
                                className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
                                
                                {item.userData.avatar
                                    ? <img src={item.userData.avatar} alt="" />
                                    : <img src={assets.avatar_icon_accent} alt="" />
                                }
                                
                                <div>
                                    <p>{item.userData.name}</p>
                                    <span>{item.lastMessage}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <ToolBar/>
        </div>
    )
}

export default LeftSidebar