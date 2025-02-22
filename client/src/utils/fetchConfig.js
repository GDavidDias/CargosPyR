import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchConfig = async() => {
    try{
        const {data} = await axios.get(`${URL}/api/configuracion`);
        //console.log('que trae data de fetchConfig: ', data);
        return data;
    }catch(error){
        console.log('error en fetchConfig: ', error.message);
    };
};