import React, { useEffect, useState } from "react";
import "./Profile.css";
import assets from "../../assets/assets";
import ToolBar from "../../components/ToolBar/ToolBar";
import { auth, db, logout } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    

    useEffect(() => {
        // Observa o estado do usuário
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            } else {
                navigate("/");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    if (!userData) {
        return (
            <div className="profile loading">
                <p>Profil wird geladen...</p>
            </div>
        );
    }

    return (
        <div className="profile">
            <img
                className="profile-pic"
                src={userData.avatar || assets.avatar_icon}
                alt="profile pic"
            />

            <div className="info">
                <h2 className="profile-name">{userData.name}</h2>
                <p className="profile-email">{userData.email}</p>
                <p className="profile-bio">{userData.bio}</p>
            </div>

            <div className="button-container">
                <button
                    className="button button-edit"
                    onClick={() => navigate("/profileupdate")}
                >bearbeiten </button>

                <button
                    className="button button-logout"
                    onClick={logout}
                >abmelden</button>

            </div>

            <ToolBar />
        </div>
    );
};

export default Profile;
