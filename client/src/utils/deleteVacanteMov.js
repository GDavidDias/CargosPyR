import axios from 'axios';
import { URL } from '../../varGlobal';


export const deleteVacanteMov = async(idVacanteMov, obsDesactiva) => {
    const dataBody = {
        obsDesactiva:obsDesactiva
    }

    try{
        const {data} = await axios.put(`${URL}/api/delvacantemov/${idVacanteMov}`,dataBody);
        //console.log('que trae data de deleteVacanteMov: ', data);
        return data;
        
    }catch(error){
        console.log('error en deleteVacanteMov: ', error.message);
    }
};