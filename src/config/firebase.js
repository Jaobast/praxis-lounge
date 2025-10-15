import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyC_YW47H7qmXig3K-ebcHKSAakECnQS86Q",
  authDomain: "praxislounge.firebaseapp.com",
  projectId: "praxislounge",
  storageBucket: "praxislounge.firebasestorage.app",
  messagingSenderId: "919682595435",
  appId: "1:919682595435:web:25a7d5a53b3ceb9944cf2e",
  measurementId: "G-YFXX9NDQ2P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async(username, email, password) =>{
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hallo, ich nutze jetzt PraxisLounge",
            lastSeen: Date.now()
        })
        await setDoc(doc(db,"chats", user.uid),{
            chatsData:[]
        })
    }catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async(email,password) =>{
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async() => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

export {signup, login, logout, auth, db}