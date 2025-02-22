import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchConfigEspVisorTit = async() => {
    try{
        const {data} = await axios.get(`${URL}/api/allespecialidades`);
        //console.log('que trae data de fetchConfigEspVisorTit: ', data);
        return data;
    }catch(error){
        console.log('error en fetchConfigEspVisorTit: ', error.message);
    };
};