import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAsignacionByVacante = async(idVacanteMov) => {

    try{
        const {data} = await axios.post(`${URL}/api/asignacionbyvacante/${idVacanteMov}`);
        //console.log('que trae data de fetchAsignacionByVacante: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchAsignacionByVacante: ', error.message);
    }
};