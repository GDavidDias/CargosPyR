import { createSlice } from "@reduxjs/toolkit";

const initialState={
    id_user:'',
    nombre:'',
    username:'',
    permiso:'',
    nivel:''
};

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action) => {
            //console.log('que ingresa a userSlice: ', action.payload);
            const{id, nombre, username,permiso,nivel} = action.payload[0];
            state.id_user=id;
            state.nombre=nombre;
            state.username=username;
            state.permiso=permiso;
            state.nivel=nivel;

        },
        outUser:(state,action)=>{
            state.id_user='';
            state.nombre='';
            state.username='';
            state.permiso='';
            state.nivel='';
        }
    }
});

export const {setUser, outUser} = userSlice.actions;
export default userSlice.reducer;