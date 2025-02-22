import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchVacanteAsignadaPyR = async(idVacantePyR) => {

    try{
        const {data} = await axios.post(`${URL}/api/vacantepyr/${idVacantePyR}`);
        console.log('que trae data de fetchVacanteAsignadaPyR: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchVacanteAsignadaPyR: ', error.message);
    }
};