import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchConfigComponente = async() => {
    try{
        const {data} = await axios.get(`${URL}/api/configcomponente`);
        //console.log('que trae data de fetchConfigComponente: ', data);
        return data;
    }catch(error){
        console.log('error en fetchConfigComponente: ', error.message);
    };
};