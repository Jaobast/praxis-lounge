import React from "react";
import './RightSidebar.css'
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";

const RightSidebar = () =>{
    return(
        <div className="rs">
            <div className="rs-profile">
                <img src={assets.profile_img} alt="profile pic" />
                <h3>Marcel Christ <img src={assets.green_dot} className="dot"  alt="online dot" /> </h3>
                <p>Hallo, ich bin der Marcel :D</p>
            </div>
            <hr />
            <div className="rs-media">
                <p>Media</p>
                <div>
                    <img src={assets.pic1} alt="media picture" />
                    <img src={assets.pic2} alt="media picture" />
                    <img src={assets.pic3} alt="media picture" />
                    <img src={assets.pic4} alt="media picture" />
                    <img src={assets.pic1} alt="media picture" />
                    <img src={assets.pic2} alt="media picture" />
                    <img src={assets.pic1} alt="media picture" />
                    <img src={assets.pic2} alt="media picture" />
                    <img src={assets.pic3} alt="media picture" />
                    <img src={assets.pic4} alt="media picture" />
                    <img src={assets.pic1} alt="media picture" />
                    <img src={assets.pic2} alt="media picture" />
                </div>
            </div>

            <button onClick={()=>logout()} >Abmelden</button>
        </div>
    )
}

export default RightSidebar