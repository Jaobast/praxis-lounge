import React from "react";
import './ProfileUpdate.css'
import assets from "../../assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import ToolBar from "../../components/ToolBar/ToolBar";

const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUid] = useState("");
    const [prevImage, setPrevImage] = useState("");
    const { setUserData } = useContext(AppContext)

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        try {
            if (!prevImage && !image) {
                toast.error("Lade Profile Bild hoch");
            }
            const docRef = doc(db, 'users', uid);
            if (image) {
                const imgUrl = await upload(image);

                if (!imgUrl) {
                    toast.error("Fehler beim Hochladen des Bildes");
                    return;
                }

                setPrevImage(imgUrl);
                await updateDoc(docRef, {
                    avatar: imgUrl,
                    bio: bio,
                    name: name
                })
            } else {
                await updateDoc(docRef, {
                    bio: bio,
                    name: name
                })
            }

            const snap = await getDoc(docRef);
            setUserData(snap.data());
            navigate('/chat');

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();
                if (data) {
                    if (data.name) setName(data.name);
                    if (data.bio) setBio(data.bio);
                    if (data.avatar) setPrevImage(data.avatar);
                }
            } else {
                navigate('/');
            }
        });

        // cleanup para evitar memory leaks
        return () => unsubscribe();
    }, [navigate]);


    return (
        <div className="profile">
            <div className="profile-container">

                <form onSubmit={handleProfileUpdate} >
                    <div className="form-top">
                        <h3>Profile Details</h3>
                        <button className="button" onClick={() => navigate('/chat')}>abbrechen</button>
                    </div>
                    <label htmlFor="avatar">
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
                        <img src={
                            image ? URL.createObjectURL(image)
                                : prevImage ? prevImage
                                    : assets.avatar_icon
                        } alt="profil pic" />

                        <p className="button">Bild hochladen</p>
                    </label>

                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text" placeholder="Dein Name" required
                    />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder="Profile Bio schreiben" required
                    ></textarea>
                    <button type="submit" className="button">Speichern</button>
                </form>

                <img className={`profile-pic image ${image ? "border" : ""} ${prevImage ? "border" : ""}`}
                    src={image ? URL.createObjectURL(image)
                        : prevImage ? prevImage
                            : assets.logo_icon
                    } alt="profil pic" />
            </div>

            <ToolBar/>
        </div>
    )
}

export default ProfileUpdate