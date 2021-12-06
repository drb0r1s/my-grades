import { useState, useEffect } from "react";

const useAnimation = (anim, call) => {
    const [animation, setAnimation] = useState("");

    useEffect(() => {
        setAnimation(anim);
    }, [call, anim]);

    return { animation };
}

export default useAnimation;