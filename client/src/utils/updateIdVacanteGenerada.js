import axios from 'axios';
import { URL } from '../../varGlobal';


export const updateIdVacanteGenerada = async(idInscriptoMov, idVacanteGenerada) => {
    const dataBody = {
        idVacanteGenerada:idVacanteGenerada
    }

    try{
        const {data} = await axios.put(`${URL}/api/updatevacantegenerada/${idInscriptoMov}`,dataBody);
        //console.log('que trae data de updateIdVacanteGenerada: ', data);
        return data;
        
    }catch(error){
        console.log('error en updateIdVacanteGenerada: ', error.message);
    }
};