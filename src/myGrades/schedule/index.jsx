import React, { useEffect, useReducer, useMemo } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import "./style.css";
import "./schedule-responsive.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import { data, dataInput } from "./data";
import { reducer } from "./reducer";
import useAnimation from "../useAnimation/useAnimation";

const Schedule = () => {
    const defaultState = useMemo(() => {
        return {
            daySchedule: data,
            editSchedule: false,
            editScheduleObject: {},
            editScheduleInput: dataInput
        }
    }, []);
    
    const [state, dispatcher] = useReducer(reducer, defaultState);
    
    useEffect(() => {
        const lStorage = localStorage.getItem("saveSchedule");

        if(lStorage) {
            dispatcher({ type: "LOCAL_STORAGE_ON" });
        }
    }, []);
    
    useEffect(() => {
        if(defaultState === state) return;
        localStorage.setItem("saveSchedule", JSON.stringify(state));
    }, [state, defaultState]);
    
    function openDashboard(x) {
        dispatcher({ type: "DASHBOARD_ON", payload: x });
    }

    function onChangeInput(event) {
        event.preventDefault();

        const name = event.target.name;
        const value = event.target.value;

        state.editScheduleInput = {...state.editScheduleInput, [name]: value};
    }

    function submitEditedSubjects(event) {
        event.preventDefault();

        let newSubjects = [];

        Object.values(state.editScheduleInput).forEach((subject) => {
            newSubjects.push(subject);
        });

        state.daySchedule.forEach((subject) => {
            if(state.editScheduleObject.id === subject.id) {
                for(let i = 0; i < newSubjects.length; i++) {
                    if(newSubjects[i]) subject.subjects[i] = newSubjects[i];
                }
            }
        });

        dispatcher({ type: "DASHBOARD_OFF", payload: dataInput });
    }

    function removeSchedule() {
        state.daySchedule.forEach((day) => {
            if(state.editScheduleObject.id === day.id) {
                day.subjects = [];
            }
        });
    }

    function removeSubject(index, dayName) {
        state.daySchedule.forEach((day) => {
            if(day.name === dayName) {
                let newSchedule = [];

                for(let i = 0; i < day.subjects.length; i++) {
                    if(i !== index) newSchedule.push(day.subjects[i]);
                }

                day.subjects = newSchedule;
            }
        });
    }
    
    return(
        <HelmetProvider>
            <Helmet>
                <title>My Grades - Schedule</title>
            </Helmet>
            
            {state.editSchedule && <ScheduleDashboard
                name={state.editScheduleObject.name}
                subjects={state.editScheduleObject.subjects}
                onChangeInput={onChangeInput}
                submitEditedSubjects={submitEditedSubjects}
                removeSchedule={removeSchedule}
                removeSubject={removeSubject}
                startAnimation={state.editSchedule}
            />}
            
            <section className="schedule">
                <Header />
            
                <h1>schedule</h1>
            
                <div className="schedule-holder">
                    {state.daySchedule.map((day) => {
                        return <Day
                            key={day.id}
                            name={day.name}
                            singleDay={day}
                            openDashboard={() => openDashboard(day)}
                        />
                    })}
                </div>
            
                <Footer />
            </section>
        </HelmetProvider>
    );
}

const Day = (props) => {
    const {
        name,
        singleDay,
        openDashboard
    } = props;
    
    return(
        <div className="day">
            <h2>{name}</h2>

            {singleDay.subjects.length > 0 && <DaySchedule singleDay={singleDay} />}

            <button
                onClick={openDashboard}
            >{singleDay.subjects.length > 0 ? "edit" : "add"}</button>
        </div>
    );
}

const DaySchedule = (props) => {
    const { singleDay } = props;

    const { animation } = useAnimation("visible", singleDay.subjects);
    
    return(
        <div
            className="day-schedule"
            id={singleDay.subjects.length > 0 && animation}
        >
            {singleDay.subjects.map((subject, number) => {
                return <Subject
                    key={number}
                    subject={subject}
                    number={number}
                    singleDay={singleDay}
                />
            })}
        </div>
    );
}

const Subject = (props) => {
    let { subject, number, singleDay } = props;
    
    const { animation } = useAnimation("visible", singleDay.subjects);
    
    return(
        <div className="subject" id={singleDay.subjects.length > 0 && animation}>
            <p>{++number}</p>
            <strong>{subject}</strong>
        </div>
    );
}

const ScheduleDashboard = (props) => {
    const {
        name,
        subjects,
        onChangeInput,
        submitEditedSubjects,
        removeSchedule,
        removeSubject,
        startAnimation
    } = props;
    
    let number = 0;
    
    const { animation } = useAnimation("visible-dashboard", startAnimation);
    
    return(
        <div className="dashboard" id={startAnimation && animation}>
            <h3>{name}</h3>

            <form onSubmit={submitEditedSubjects}>
                <div className="inputs-holder">
                    {Object.keys(dataInput).map((input, index) => {
                        return <div className="subject-input" key={input}>
                            <p>{++number}.</p>
                            
                            <input
                                type="text"
                                name={input}
                                maxLength="16"
                                placeholder={subjects[index]}
                                value={dataInput.input}
                                onChange={onChangeInput}
                            />

                            {subjects[index] && <button
                                onClick={() => removeSubject(index, name)}
                            >remove</button>}
                        </div>
                    })}
                </div>

                <div className="button-holder">
                    <button type="submit">submit</button>
                    {subjects.length > 0 && <button onClick={removeSchedule}>remove</button>}
                </div>
            </form>
        </div>
    );
}

export default Schedule;