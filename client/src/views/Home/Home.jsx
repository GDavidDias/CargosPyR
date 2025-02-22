import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import SideBar from "../SideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../redux/configSlice";
import InscriptosMov from "../../components/InscriptosMov/InscriptosMov";
import VacantesMov from "../../components/VacantesMov/VacantesMov";
import AsignacionesMov from "../../components/AsignacionesMov/AsignacionesMov";
import InscriptosTit from "../../components/InscriptosTit/InscriptosTit";
import VacantesTit from "../../components/VacantesTit/VacantesTit";
import Listados from "../../components/Listados/Listados";
import InscriptosPyR from "../../components/InscriptosPyR/InscriptosPyR";
import ListadosTit from "../../components/ListadosTit/ListadosTit";
import VacMovDoc from "../../components/VacMovDoc/VacMovDoc";
import ConfigPage from "../../components/ConfigPage/ConfigPage";
import PageIni from "../../views/PageIni/PageIni";
import VacantesTitDocentes from "../../components/VacantesTit/VacantesTitDocentes";
import VacantesTitDocentesInicial from "../../components/VacantesTit/VacantesTitDocentesInicial";
import VacantesPyR from "../../components/VacantesPyR/VacantesPyR";
import ListadosPR from "../../components/ListadosPR/ListadosPR";

const Home = () =>{
    const dispatch = useDispatch();

    const userSG = useSelector((state)=>state.config.user);
    const pageSG = useSelector((state)=>state.config.page);
    const[content, setContent]=useState(null);

    useEffect(()=>{
        //console.log('en que pagina estoy: ', pageSG);
        switch(pageSG){
            case 'InscriptosMov': //Pantalla de Inscriptos para Movimientos segun Nivel
                setContent(<InscriptosMov/>);
                break;
            case 'VacantesMov': //Pantalla de Vacantes para Movimientos segun Nivel
                setContent(<VacantesMov/>);
                break;
            case 'Listados': //Pantalla de Listados
                setContent(<Listados/>);
                break;                
            case 'InscriptosTit':
                setContent(<InscriptosTit/>);
                break;
            case 'VacantesTit':
                setContent(<VacantesTit/>);
                break;
            case 'ListadosTit': //Pantalla de Listados
                setContent(<ListadosTit/>);
                break;
            case 'Asignaciones': //Pantalla de Asignaciones Realizadas, segun tipo de movimiento y nivel
                setContent(<AsignacionesMov/>);
                break;                
            case 'VacMovDoc': //Pantalla de Asignaciones Realizadas, segun tipo de movimiento y nivel
                setContent(<VacMovDoc/>);
                break;              
            case 'ConfigPage': //Pantalla de Configuracion
                setContent(<ConfigPage/>);
                break;  
            case 'PageIni'://Pantalla inicio
                setContent(<PageIni/>);
                break;
            case 'VacantesTitDocentes'://Pantalla de VACANTES que pueden visualizar los docentes
                setContent(<VacantesTitDocentes/>);
                break;
            case 'VacantesTitDocentesInicial'://Pantalla de VACANTES que pueden visualizar los docentes
                setContent(<VacantesTitDocentesInicial/>);
                break;
            case 'InscriptosPyR': //Pantalla de INSCRIPTOS DE PROVISIONAL Y REEMPLAZANTES
                setContent(<InscriptosPyR/>);
                break;
            case 'VacantesPyR': //Pantalla de VACANTES de PROVISIONALES y REEMPLAZANTES
                setContent(<VacantesPyR/>);
                break;
            case 'ListadosPyR': //Pantalla de LISTADOS de PROVISIONALES y REEMPLAZANTES
                setContent(<ListadosPR/>);
                break;
        }
    },[pageSG]);

    useEffect(()=>{
        //console.log('que tiene userSG: ', userSG);
        // if(userSG && userSG.permiso===3){
        //     //Si es un invitado
        //     dispatch(setPage('VacantesMov'));
        // }else{
        //     dispatch(setPage('InscriptosMov'));
        // }
    },[userSG])
    
    //AL RENDERIZAR AL INICIO
    useEffect(()=>{
        //console.log('que tiene userSG Home al REnderizar: ', userSG);
    },[])
    return(
        <div className="h-full w-full fixed ">
            {/* CONTENEDOR SUPERIOR */}
            <div className="w-full  h-[95vh] flex desktop:flex-row movil:flex-col">
                <div className="desktop:w-[15vw] desktop:h-[95vh] movil:w-full movil:h-[6vh]">
                    {/* BARRA NAVEGACION */}
                    <SideBar/>
                </div>
                <div className="desktop:w-[85vw] desktop:h-[95vh] movil:w-full movil:h-[88vh] ">
                    {/* PAGINAS DE CONTENIDOS */}
                    {content}
                </div>
            </div>
            {/* CONTENEDOR INFERIOR */}
            <div className="w-full desktop:flex h-[5vh] movil:hidden ">
                {/* PIE DE SITIO */}
                <Footer/>
            </div>
        </div>
    )
};

export default Home;