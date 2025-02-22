import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllEspecialidades = async() => {

    try{
        const {data} = await axios.get(`${URL}/api/allespecialidades`);
        //console.log('que trae data de fetchAllEspecialidades: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchAllEspecialidades: ', error.message);
    }
};