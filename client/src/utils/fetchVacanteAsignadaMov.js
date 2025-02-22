import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchVacantesAsignadaMov = async(idVacanteMov) => {

    try{
        const {data} = await axios.post(`${URL}/api/vacanteasignada/${idVacanteMov}`);
        //console.log('que trae data de fetchVacantesAsignadaMov: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchVacantesAsignadaMov: ', error.message);
    }
};