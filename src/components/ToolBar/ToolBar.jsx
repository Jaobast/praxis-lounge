import React from "react";
import './ToolBar.css'
import { useNavigate, useLocation } from "react-router-dom";
import assets from "../../assets/assets";

const ToolBar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const isChat = location.pathname === '/chat';
    const isProfile = location.pathname === '/profile';

    return (
        <div className= {`tb ${isProfile ? 'button-isprofile' : ''} ${isChat ? 'button-ischat' : ''}`}>
            <button
                className="button-chat"
                onClick={() => navigate('/chat')}>
                    <svg width="39" height="26" viewBox="0 0 39 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2154 0.172852C4.57365 0.172852 7.26758e-05 4.74643 7.26758e-05 10.3882C7.26758e-05 13.9206 1.79328 17.0336 4.51882 18.868C5.29342 19.3893 5.73126 20.3346 5.45201 21.2255L4.84512 23.1618C4.19255 25.244 6.82078 26.762 8.29825 25.1563L11.0519 22.1631C11.9664 21.1692 13.2552 20.6036 14.6058 20.6036H27.9433C33.585 20.6036 38.1586 16.03 38.1586 10.3882C38.1586 4.74643 33.585 0.172852 27.9433 0.172852L10.2154 0.172852Z" fill="currentColor"/>
                    </svg>
                    <p>Chats</p>
            </button>
            
            <button
                className="button-profile"
                onClick={() => navigate('/profile')}>
                    <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 13.2437C16.6853 13.2437 19.4492 10.2955 19.4492 6.79445C19.4492 3.29344 16.6853 0.345215 13 0.345215C9.31472 0.345215 6.55076 3.29344 6.55076 6.79445C6.55076 10.2955 9.31472 13.2437 13 13.2437ZM24.9772 24.6681C23.3188 18.2188 16.6853 13.9807 9.86751 15.6391C5.62944 16.929 2.12843 20.2457 1.02284 24.6681C0.838578 25.2209 1.39137 25.9579 2.12843 26.1422H2.49695H23.8716C24.6086 26.1422 25.1614 25.7736 24.9772 24.6681Z" fill="currentColor"/>
                    </svg>

                    <p>Profile</p>
            </button>
        </div>
    )
}

export default ToolBar