import React, { useState, useEffect, useReducer, useMemo, useCallback } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import "./style.css";
import "./grades-responsive.css";
import { reducer } from "./reducer";
import data from "./data";
import Header from "../header/header";
import Footer from "../footer/footer";
import useAnimation from "../useAnimation/useAnimation";

const Grades = () => {
    const [grade, setGrade] = useState("");
    
    const defaultState = useMemo(() => {
        return {
            subjects: [],
            subjectInfoContent: "",
            subjectInfoColor: "",
            editMode: false,
            editSubject: "",
            editGrade: false,
            editGradeInput: data,
            editGradeObject: {},
            globalAverageGrade: ""
        }
    }, []);
    
    const [state, dispatcher] = useReducer(reducer, defaultState);
    
    useEffect(() => {
        const lStorage = localStorage.getItem("saveState");
        
        if(lStorage) {
            dispatcher({ type: "SET_LOCAL_STORAGE" });
        }
    }, []);
    
    useEffect(() => {
        if(defaultState === state) return;
        localStorage.setItem("saveState", JSON.stringify(state));
    }, [state, defaultState]);
    
    useEffect(() => {
        if(state.subjectInfoContent) {
            setTimeout(() => {
                dispatcher({ type: "REMOVE_SUBJECT_INFO" });
            }, 3000);
        }
    }, [state.subjectInfoContent]);

    function addSubject(event) {
        event.preventDefault();
        
        if(grade.length === 0) return dispatcher({ type: "NO_VALUE" });
        
        const newSubject = {
            id: new Date().getTime().toString(),
            name: grade,
            grades: [],
            averageGrade: ""
        }
    
        dispatcher({ type: "NEW_SUBJECT", payload: newSubject });
        setGrade("");
    }
    
    function editSubject(x) {
        setGrade(x.name);
        
        const subjectToEdit = x.id;
        dispatcher({ type: "EDIT_MODE_ON", payload: subjectToEdit });
    }
    
    function changeSubject(event) {
        event.preventDefault();
        
        if(state.subjects.length === 0) return dispatcher({ type: "NO_VALUE_SUBJECTS" });
        
        if(grade.length === 0) return dispatcher({ type: "NO_VALUE" });
        
        const subjectFind = state.subjects.find((subject) =>
            subject.id === state.editSubject
        );
        
        const prevName = subjectFind.name;
        
        subjectFind.name = grade;
    
        const currentName = subjectFind.name;
    
        dispatcher({ type: "EDIT_MODE_OFF", payload: {
            prev: prevName,
            current: currentName
        } });
        setGrade("");
    }
    
    function removeSubject(x) {
        const removedSubject = state.subjects.find((subject) => 
            subject.id === x.id
        );
        
        const subjectFilter = state.subjects.filter((subject) => 
            subject.id !== x.id
        );
        
        dispatcher({ type: "REMOVE_SUBJECT", payload: {
            removed: removedSubject.name,
            filter: subjectFilter
        }});
    }
    
    function changeGrades(x) {
        const gradeToEdit = x;
        dispatcher({ type: "EDIT_GRADES_ON", payload: gradeToEdit });
    }
    
    function removeAllSubjects() {
        dispatcher({ type: "REMOVE_ALL" });
    }

    function onChangeInput(event) {
        const name = event.target.name;
        const value = event.target.value;

        state.editGradeInput = {...state.editGradeInput, [name]: value};
    }
    
    function submitEditedGrades(event) {
        event.preventDefault();

        let newGrades = [];
        let ynflag = false;

        Object.values(state.editGradeInput).forEach((input) => {
            newGrades.push(input);
        });
        
        state.subjects.forEach((subject) => {
            if(subject.id === state.editGradeObject.id) {
                for(let i = 0; i < newGrades.length; i++) {
                    if(newGrades[i]) {
                        subject.grades[i] = newGrades[i];
                        ynflag = true;
                    }
                }

                let sum = 0;
                let numberLength = 0;
                let calculation;
                let flag = false;
                
                for(let i = 0; i < subject.grades.length; i++) {
                    if(subject.grades[i]) {
                        sum += parseInt(subject.grades[i]);
                        numberLength++;
                        if(sum >= 1) flag = true;
                    }
                }

                if(flag) {
                    calculation = sum / numberLength;
                    subject.averageGrade = calculation.toFixed(2);
                    calculateGlobalGrade();

                    if(ynflag) dispatcher({ type: "NEW_GRADES", payload: subject });
                }
            }
        });
        
        dispatcher({ type: "EDIT_GRADES_OFF", payload: data });
    }

    const calculateGlobalGrade = useCallback(() => {
        let globalGrade = 0;
        let numberOfSubjects = 0;
        
        state.subjects.forEach((subject) => {
            if(subject.averageGrade) {
                globalGrade += parseFloat(subject.averageGrade);
                numberOfSubjects++;
            }
        });

        let calculation = globalGrade / numberOfSubjects;
        
        state.globalAverageGrade = calculation.toFixed(2);
    }, [state]);

    useEffect(() => {
        calculateGlobalGrade();
    }, [state.subjects, calculateGlobalGrade]);
    
    return(
        <HelmetProvider>  
            <Helmet>
                <title>My Grades - Grades</title>
            </Helmet>
            
            {state.editGrade && <GradeDashboard
                name={state.editGradeObject.name}
                data={state.editGradeInput}
                grades={state.editGradeObject.grades.length > 0 ? state.editGradeObject.grades : ""}
                onChangeInput={onChangeInput}
                submitEditedGrades={submitEditedGrades}
                startAnimation={state.editGrade}
            />}
            
            <section className="grades">
                <Header />
                
                <div className="grades-holder">
                    <h1>grades</h1>

                    <form onSubmit={state.editMode ? changeSubject : addSubject}>
                        <input
                            type="text"
                            maxLength="16"
                            value={grade}
                            onChange={(event) => setGrade(event.target.value)}
                        />

                        <button>{state.editMode ? "edit subject" : "add subject"}</button>
                    </form>

                    {state.subjects.length > 0 && <SubjectList
                        {...state}
                        editSubject={editSubject}
                        removeSubject={removeSubject}
                        changeGrades={changeGrades}
                        gAverageGrade={state.globalAverageGrade}
                        removeAllSubjects={removeAllSubjects}
                    />}
                
                </div>

                <Footer />
            </section>
        </HelmetProvider>
    );
}

const SubjectList = (props) =>  {
    const {
        subjects,
        editSubject,
        removeSubject,
        changeGrades,
        subjectInfoContent,
        subjectInfoColor,
        gAverageGrade,
        removeAllSubjects
    } = props;
    
    const { animation } = useAnimation("visible", subjects);
    
    return(
        <>
            <div className="subject-holder" id={subjects.length > 0 && animation}>
                <h2>subjects</h2>

                {subjectInfoContent && <p
                    style={{ color: subjectInfoColor }}
                >{subjectInfoContent}</p>}
                
                {subjects.map((subject) => {
                    return <Subject
                        key={subject.id}
                        {...subject}
                        editSubject={() => editSubject(subject)}
                        removeSubject={() => removeSubject(subject)}
                        changeGrades={() => changeGrades(subject)}
                        subjects={subjects}
                    />
                })}

                {!isNaN(gAverageGrade) && <strong>average grade: <span>{gAverageGrade}</span></strong>}
                
                <button
                    id="remove-all-btn"
                    onClick={removeAllSubjects}
                >remove all</button>
            </div>
        </>
    );
}

const Subject = (props) => {
    const {
        name,
        editSubject,
        removeSubject,
        changeGrades,
        averageGrade,
        subjects
    } = props;
    
    const { animation } = useAnimation("visible", subjects);
    
    return(
        <div className="subject" id={subjects.length > 0 && animation}>
            <div className="subject-info">
                <strong>{name}</strong>
                <p id="grade">{averageGrade}</p>
            </div>

            <button
                id="grades-btn"
                onClick={changeGrades}
            >grades</button>

            <div id="moderation">
                <button
                    style={{ color: "green" }}
                    onClick={editSubject}
                >edit</button>

                <button
                    style={{ color: "red" }}
                    onClick={removeSubject}
                >remove</button>
            </div>
        </div>
    );
}

const GradeDashboard = (props) => {
    const {
        name,
        data,
        grades,
        onChangeInput,
        submitEditedGrades,
        startAnimation
    } = props;
    
    const { animation } = useAnimation("visible-dashboard", startAnimation);
    
    return(
        <div className="grade-dashboard" id={startAnimation && animation}>
            <strong>{name}</strong>

            <form onSubmit={submitEditedGrades}>
                <div className="inputs-holder">
                    {Object.keys(data).map((input, index) => {
                        return <input
                            key={index}
                            type="number"
                            min="1"
                            max="5"
                            name={input}
                            placeholder={grades[index]}
                            value={data.input}
                            onChange={onChangeInput}
                        />
                    })}
                </div>

                <button>submit</button>
            </form>
        </div>
    );
}

export default Grades;