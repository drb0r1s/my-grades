export function reducer(state, action) {
    const TYPE = {
        EDIT_SCHEDULE_ON: "DASHBOARD_ON",
        EDIT_SCHEDULE_OFF: "DASHBOARD_OFF",
        SET_LOCAL_STORAGE: "LOCAL_STORAGE_ON"
    };
    
    switch(action.type) {
        case TYPE.EDIT_SCHEDULE_ON:
            return {
                ...state,
                editSchedule: true,
                editScheduleObject: action.payload
            }

        case TYPE.EDIT_SCHEDULE_OFF:
            const loadData = action.payload;
        
            return {
                ...state,
                editSchedule: false,
                editScheduleInput: loadData
            }

        case TYPE.SET_LOCAL_STORAGE:
            const loadStorage = JSON.parse(localStorage.getItem("saveSchedule"));
            
            return {
                ...loadStorage
            }
        
        default: throw new Error("No such action type!");
    }
}