import React from "react";
import './Login.css'
import assets from "../../assets/assets";
import { useState } from "react";
import { signup, login } from "../../config/firebase";

const Login = () =>{

        const [currState, setCurrState] = useState("Registrieren");
        const [username, setUsername] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const onSubmitHandler = (event) => {
            event.preventDefault();
            if (currState === "Registrieren") {
                signup(username,email,password)
            } else{
                login(email,password)
            }
        }

    return(
        <div className='login'>
            <img src={assets.logo_text} alt="logo" className="logo"/>

            <form onSubmit={onSubmitHandler} className="login-form">
                <h2>{currState}</h2>
                {currState === "Registrieren"
                    ? <input
                    onChange={(e)=>setUsername(e.target.value)}
                    value={username}
                    type="text" placeholder="Username" className="form-input" required/>
                    :null
                }
                <input
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                    type="email" placeholder="Email Adresse" className="form-input" required
                />
                <input
                    onChange={(e)=>setPassword(e.target.value)}
                    value={password}
                    type="password" placeholder="Passwort" className="form-input" required
                />
                <button type="submit" className="button">{currState === "Registrieren"? "erstellen": "Los geht’s"}</button>

                <div className="login-term">
                    <input type="checkbox" id="checkbox-term"/>
                    <label htmlFor="checkbox-term">Nutzungsbedingungen und Datenschutzrichtlinie zustimmen</label>
                </div>

                <div className="login-forgot">
                    {currState === "Registrieren"
                        ? <p className="login-toggle">Hast du bereits ein Konto? <span onClick={()=> setCurrState("Anmelden")} >Hier anmelden</span></p>
                        : <p className="login-toggle">Neues Konto erstellen: <span onClick={()=> setCurrState("Registrieren")} >Hier klicken</span></p>
                    }
                </div>
            </form>
        </div>
    )
}

export default Login