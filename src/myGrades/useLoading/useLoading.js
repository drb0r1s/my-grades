import { useState, useEffect, useCallback } from "react";
import "./loading-style.css";
import "./loading-responsive.css";

const useLoading = (bool) => {
    const [isLoading, setIsLoading] = useState(bool);
    const [loadingText, setLoadingText] = useState("");
    const [animation, setAnimation] = useState(false);
    
    const cancelLoading = useCallback(() => {
        setTimeout(() => {
            setAnimation(true);

            setTimeout(() => {
                setIsLoading(!bool);
            }, 500);
        }, 1500);
    }, [bool]);
    
    useEffect(() => {
        startLoading();
        
        document.readyState === "complete" ?
            cancelLoading()
        : window.onload = cancelLoading();
    }, [cancelLoading]);

    function startLoading() {
        const text = "loading...";
        
        let textHolder = "";
        let i = 0;
        let j = 0;

        typeLoading();
        
        function typeLoading() {
            if(i < text.length) {
                textHolder += text.charAt(i);
                setLoadingText(textHolder);
                i++;
            }

            if(i === text.length) {
                textHolder = "";
                deleteLoading();
            }

            setTimeout(typeLoading, i === text.length ? 100 : 200);
        }

        function deleteLoading() {
            if(j < text.length + 1) {
                let deleteText = text.substring(0, text.length - j);
                setLoadingText(deleteText);
                j++;
            }

            if(j === text.length + 1) {
                i = 0;
                j = 0;
            }
        }
    }

    return { isLoading, loadingText, animation }
}

export default useLoading;