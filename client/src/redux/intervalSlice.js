import { createSlice } from "@reduxjs/toolkit";

const intervalSlice = createSlice({
    name: 'interval',
    initialState:{
        isIntervalActive: true,
    },
    reducers:{
        // toggleInterval:(state)=>{
        //     state.isIntervalActive= !state.isIntervalActive;
        // },
        // resetInterval:(state)=>{
        //     state.isIntervalActive=false;
        //     setTimeout(()=>{
        //         console.log('REINICIO CON TIMEOUT---')
        //         state.isIntervalActive = true;
        //     }, 0); // Reinicia inmediatamente el intervalo en el proximo ciclo
        // },
        setIntervalActive:(state,action)=>{
            state.isIntervalActive = action.payload;
        }
    },
});

export const {setIntervalActive} = intervalSlice.actions;
export default intervalSlice.reducer;