import React from "react";
import './ToolBar.css'
import { useNavigate, useLocation } from "react-router-dom";
import assets from "../../assets/assets";

const ToolBar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const isChat = location.pathname === '/chat';
    const isProfile = location.pathname === '/profile';
    const isProfileUpdate = location.pathname === '/profileupdate';

    return (
        <div className= {`tb ${isProfile ? 'isprofile' : ''} ${isChat ? 'ischat' : ''} ${isProfileUpdate ? 'isprofileupdate' : ''}`}>
            <button
                className="button-chat"
                onClick={() => navigate('/chat')}>
                    <svg width="39" height="26" viewBox="0 0 39 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2154 0.172852C4.57365 0.172852 7.26758e-05 4.74643 7.26758e-05 10.3882C7.26758e-05 13.9206 1.79328 17.0336 4.51882 18.868C5.29342 19.3893 5.73126 20.3346 5.45201 21.2255L4.84512 23.1618C4.19255 25.244 6.82078 26.762 8.29825 25.1563L11.0519 22.1631C11.9664 21.1692 13.2552 20.6036 14.6058 20.6036H27.9433C33.585 20.6036 38.1586 16.03 38.1586 10.3882C38.1586 4.74643 33.585 0.172852 27.9433 0.172852L10.2154 0.172852Z" fill="currentColor"/>
                    </svg>
                    <p>Chats</p>
            </button>

            <svg className="logo" width="49" height="55" viewBox="0 0 49 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.4108 18.8174C41.9486 18.8174 46.4379 23.3067 46.4379 28.8446C46.4379 32.3119 44.6778 35.3675 42.0024 37.1681C41.2421 37.6798 40.8123 38.6077 41.0864 39.4822L41.6821 41.3828C42.3227 43.4267 39.7429 44.9167 38.2926 43.3405L35.5897 40.4025C34.6921 39.4269 33.427 38.8717 32.1013 38.8717H19.0096C13.4717 38.8717 8.98239 34.3824 8.98239 28.8446C8.98239 23.3067 13.4717 18.8174 19.0096 18.8174L36.4108 18.8174Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="17.305" y1="7.16211" x2="17.305" y2="30.4385" stroke="currentColor" strokeWidth="10.3242" strokeLinecap="round"/>
                <line x1="28.6772" y1="18.793" x2="5.40084" y2="18.793" stroke="currentColor" strokeWidth="10.3242" strokeLinecap="round"/>
                <path d="M22.4675 10.95C22.467 10.8904 22.467 10.8296 22.4675 10.7676V10.95C22.4853 13.0296 23.1311 13.6299 25.2452 13.6384H25.3381C25.3068 13.6385 25.2758 13.6385 25.2452 13.6384H22.4675V10.95Z" fill="currentColor"/>
                <path d="M22.4675 26.6174C22.467 26.677 22.467 26.7378 22.4675 26.7998V26.6174C22.4853 24.5378 23.1311 23.9375 25.2452 23.929H25.3381C25.3068 23.9288 25.2758 23.9288 25.2452 23.929H22.4675V26.6174Z" fill="currentColor"/>
                <path d="M12.1839 10.95C12.1844 10.8904 12.1844 10.8296 12.1839 10.7676V10.95C12.1662 13.0296 11.5203 13.6299 9.40625 13.6384H9.31336C9.34464 13.6385 9.3756 13.6385 9.40625 13.6384H12.1839V10.95Z" fill="currentColor"/>
                <path d="M12.1839 26.6174C12.1844 26.677 12.1844 26.7378 12.1839 26.7998V26.6174C12.1662 24.5378 11.5203 23.9375 9.40625 23.929H9.31336C9.34464 23.9288 9.3756 23.9288 9.40625 23.929H12.1839V26.6174Z" fill="currentColor"/>
            </svg>
            
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