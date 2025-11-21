import { doc, getDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { createContext } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

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
            console.log("🔹 Iniciando loadUserData para UID:", uid);
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            // ⚠️ BLOCo DE VERIFICAÇÃO ALTERADO AQUI!
            if (!userSnap.exists()) {
                console.warn("⚠️ Usuário não encontrado no Firestore:", uid);
                // 1. Mostrar Mensagem de Erro
                toast.error("Usuário não encontrado. Faça login novamente.");
                // 2. Redirecionar para a página de Login
                navigate('/'); 
                return; // ⬅️ IMPORTANTE: Sair da função para não executar o restante
            }
            // FIM DA ALTERAÇÃO

            const userData = userSnap.data();
            console.log("✅ userData carregado:", userData);

            setUserData(userData);

            if (userData.name) {
                navigate('/chat');
            } else {
                navigate('/profileupdate');
            }

            await updateDoc(userRef, { lastSeen: Date.now() });

            setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, { lastSeen: Date.now() });
                }
            }, 60000);
        } catch (error) {
            console.error("❌ Erro em loadUserData:", error);
            // Opcional: Tratar erros genéricos de leitura/conexão
            toast.error("Ocorreu um erro ao carregar seus dados.");
            navigate('/');
        }
    };


    const deleteChat = async (rId, messageId) => {
    if (!userData || !rId || !messageId) return;
    try {
        // Referências
        const userChatRef = doc(db, 'chats', userData.id);
        const otherUserChatRef = doc(db, 'chats', rId);
        const messageRef = doc(db, 'messages', messageId);

        // Remove o chat do usuário logado
        const userChatSnap = await getDoc(userChatRef);
        if (userChatSnap.exists()) {
            const chats = userChatSnap.data().chatsData || [];
            const updatedChats = chats.filter(chat => chat.messageId !== messageId);
            await updateDoc(userChatRef, { chatsData: updatedChats });
        }

        // Remove o chat do outro usuário
        const otherChatSnap = await getDoc(otherUserChatRef);
        if (otherChatSnap.exists()) {
            const chats = otherChatSnap.data().chatsData || [];
            const updatedChats = chats.filter(chat => chat.messageId !== messageId);
            await updateDoc(otherUserChatRef, { chatsData: updatedChats });
        }

        // Apaga o documento de mensagens
        await deleteDoc(messageRef);

        // Atualiza estado local
        setChatdata(prev => prev ? prev.filter(c => c.messageId !== messageId) : []);

    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        toast.error("Fehler beim Löschen");
    }
};


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
        chatUser, setChatUser,
        deleteChat
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider