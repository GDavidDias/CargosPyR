import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchVacanteAsignadaTit = async(idVacanteTit) => {

    try{
        const {data} = await axios.post(`${URL}/api/vacantetit/${idVacanteTit}`);
        //console.log('que trae data de fetchVacanteAsignadaTit: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchVacanteAsignadaTit: ', error.message);
    }
};