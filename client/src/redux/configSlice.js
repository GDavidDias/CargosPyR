import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    page:'',
    nivel:{
        id_nivel:'',
        descripcion:''
    },
    config:[],
    configComponente:[],
    especialidadVisorTit:[]
}

export const configSlice = createSlice({
    name:'config',
    initialState,
    reducers:{
        setPage:(state,action)=>{
            state.page = action.payload;
        },
        setNivel:(state,action)=>{
            const{id_nivel, descripcion} = action.payload[0];
            state.nivel.id_nivel = id_nivel;
            state.nivel.descripcion = descripcion;
        },
        setConfig:(state,action)=>{
            state.config = action.payload;
        },
        setConfigComp:(state, action)=>{
            state.configComponente = action.payload;
        },
        setEspecialidadVisorTit:(state, action)=>{
            state.especialidadVisorTit = action.payload;
        }
    }
});

export const {setPage, setNivel, setConfig, setConfigComp, setEspecialidadVisorTit} = configSlice.actions;
export default configSlice.reducer;