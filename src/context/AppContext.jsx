import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { createContext } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatdata] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);
            if (userData.name) {
                navigate('/chat');
            } else {
                navigate('/profile')
            }
            await updateDoc(userRef, {
                lastSeen: Date.now()
            })
            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    })
                }
            }, 60000);
        } catch (error) {

        }
    }

    useEffect(() => {
        if (!userData) return;

        const chatRef = doc(db, 'chats', userData.id);
        const unSub = onSnapshot(chatRef, async (res) => {
            try {
                if (!res.exists()) {
                    console.warn(`Documento 'chats/${userData.id}' não existe — criando...`);
                    await updateDoc(chatRef, { chatsData: [] }).catch(async () => {
                        // Se updateDoc falhar (porque o doc não existe), cria com setDoc
                        const { setDoc } = await import("firebase/firestore");
                        await setDoc(chatRef, { chatsData: [] });
                    });
                    setChatdata([]);
                    return;
                }

                const data = res.data();
                const chatItems = Array.isArray(data.chatsData) ? data.chatsData : [];
                const tempData = [];

                for (const item of chatItems) {
                    const userRef = doc(db, 'users', item.rId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const otherUserData = userSnap.data();
                        tempData.push({ ...item, userData: otherUserData });
                    }
                }

                setChatdata(tempData.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
            } catch (err) {
                console.error("Erro ao processar snapshot:", err);
                setChatdata([]);
            }
        });

        return () => unSub();
    }, [userData]);


    const value = {
        userData, setUserData,
        chatData, setChatdata,
        loadUserData,
        messages, setMessages,
        messagesId, setMessagesId,
        chatUser, setChatUser
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider