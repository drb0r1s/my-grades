import React, { useEffect } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import "./responsive.css";

import Grades from "./grades";
import Schedule from "./schedule";
import Error from "./error";

import useLoading from "./useLoading/useLoading.js";

const Main = () => {
    return(
        <HelmetProvider>
            <Helmet>
                <title>My Grades</title>
                
                <meta
                    name="description"
                    content="My Grades provides the ability to record subjects and grades as well as calculate the average grade of individual subjects and all subjects together. It also provides the ability to enter a schedule."
                />

                <meta
                    name="keywords"
                    content="My Grades, grades, schedule, average grade, subjects, drb0r1s"
                />

                <meta
                    name="author"
                    content="drb0r1s"
                />
            </Helmet>
            
            <Router>
                <Routes>
                    <Route index element={<App />} />
                    <Route path="/grades" element={<Grades />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Router>
        </HelmetProvider>
    );
}

const App = () => {
    useEffect(() => {
        document.title = "My Grades";
    }, []);

    const { isLoading, loadingText, animation } = useLoading(true);
    
    if(isLoading) {
        return(
            <div className={animation ? "animation loading" : "loading"}>
                <h1>{loadingText}</h1>
            </div>
        );
    }
    
    return(
        <div className="app">
            <div className="app-holder">
                <h1>my grades</h1>

                <Link to="/grades" className="btn">grades</Link>
                <Link to="/schedule" className="btn">schedule</Link>
            </div>
        </div>
    );
}

export default Main;