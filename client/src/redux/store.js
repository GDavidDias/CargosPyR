import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import configReducer from './configSlice';
import intervalReducer from './intervalSlice';
//import docuserReducer from './docUserSlice';
//import documentoReducer from './documentoSlice';

const store = configureStore({
    reducer:{
        config:configReducer,
        user:userReducer,
        interval:intervalReducer
        //docuser:docuserReducer,
        //documento:documentoReducer
    }
});

export default store;