export function reducer(state, action) {
    if(action.type === "SET_LOCAL_STORAGE") {
        const loadStorage = JSON.parse(localStorage.getItem("saveState"));
        
        return {
            ...loadStorage
        }
    }
    
    if(action.type === "NEW_SUBJECT") {
        const loadSubjects = action.payload;
        
        return {
            ...state,
            subjects: [...state.subjects, loadSubjects],
            subjectInfoContent: `New subject successfully added! Name: ${loadSubjects.name}.`,
            subjectInfoColor: "green",
        }
    }

    if(action.type === "NEW_GRADES") {
        const { name, averageGrade } = action.payload;
        
        return {
            ...state,
            subjectInfoContent: `Grades were changed in the ${name}. Average grade: ${averageGrade}.`,
            subjectInfoColor: "#0099ff"
        }
    }

    if(action.type === "EDIT_GRADES_ON") {
        const loadGrade = action.payload;
        
        return {
            ...state,
            editGrade: true,
            editGradeObject: loadGrade
        }
    }

    if(action.type === "EDIT_GRADES_OFF") {
        const loadData = action.payload;
        
        return {
            ...state,
            editGrade: false,
            editGradeInput: loadData,
            editGradeObject: {}
        }
    }

    if(action.type === "EDIT_MODE_ON") {
        const loadSubject = action.payload;

        return {
            ...state,
            editMode: true,
            editSubject: loadSubject
        }
    }

    if(action.type === "EDIT_MODE_OFF") {
        const { prev, current } = action.payload;
        
        return {
            ...state,
            subjectInfoContent: `Subject name edited from ${prev} to ${current}.`,
            subjectInfoColor: "#0099ff",
            editMode: false,
            editSubject: "",
        }
    }

    if(action.type === "REMOVE_SUBJECT") {
        const { removed, filter } = action.payload;
        
        return {
            ...state,
            subjects: filter,
            subjectInfoContent: `Removed subject: ${removed}.`,
            subjectInfoColor: "red"
        }
    }

    if(action.type === "REMOVE_SUBJECT_INFO") {
        return {
            ...state,
            subjectInfoContent: "",
            subjectInfoColor: "",
        }
    }

    if(action.type === "NO_VALUE") {
        return {
            ...state,
            subjectInfoContent: "You need to enter a subject name.",
            subjectInfoColor: "grey"
        }
    }

    if(action.type === "NO_VALUE_SUBJECTS") {
        return {
            ...state,
            editMode: false
        }
    }

    if(action.type === "REMOVE_ALL") {
        return {
            ...state,
            subjects: []
        }
    }

    throw new Error("No such action type!");
}