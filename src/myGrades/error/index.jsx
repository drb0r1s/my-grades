import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import "./error-responsive.css";
import Header from "../header/header";
import Footer from "../footer/footer";

const Error = () => {
    useEffect(() => {
        document.title = "My Grades - Error";
        showInfo();
    }, []);

    const [info, setInfo] = useState("");

    function showInfo() {
        const text = "not found";
        
        let textHolder = "";
        let i = 0;
        let j = 0;

        startInfo();
        
        function startInfo() {
            if(i < text.length) {
                textHolder += text.charAt(i);
                setInfo(textHolder);
                i++;
            }

            if(i === text.length) {
                deleteInfo();
                textHolder = "";
            }

            setTimeout(startInfo, i === text.length ? 150 : 500);
        }

        function deleteInfo() {
            let deleteText = text.substring(0, text.length - j);
            
            if(j < text.length + 1) {
                setInfo(deleteText);
                j++;
            }

            if(j === text.length + 1) {
                i = 0;
                j = 0;
            }
        }
    }
    
    return(
        <div className="error">
            <Header />
            
            <div className="error-info">
                <h1>error</h1>
            
                <div className="error-status">
                    <p>status:</p>
                    <strong>{info}</strong>
                </div>

                <Link to="/" className="button">main</Link>
            </div>

            <Footer />
        </div>
    );
}

export default Error;