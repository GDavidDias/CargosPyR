import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { outUser } from "../../redux/userSlice";
import { fetchAllInscriptosTit } from "../../utils/fetchAllInscriptosTit";
import { useEffect, useRef, useState } from "react";
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import Paginador from "../Paginador/Paginador";
import ModalEdit from "../ModalEdit/ModalEdit";
import {useModal} from '../../hooks/useModal';
import ContentModalDatosInscriptoTit from "../ContentModalDatosInscriptosTit/ContentModalDatosInscriptoTit";
import {URL} from '../../../varGlobal';
import axios from "axios";
import Modal from "../Modal/Modal";
import { fetchAllEspecialidades } from "../../utils/fetchAllEspecialidades";
import { BiTransferAlt } from "react-icons/bi";
import ContentModalVacantesDispTit from "../ContentModalVacantesDispTit/ContentModalVacantesDispTit";
import { fetchAllVacantesTit } from "../../utils/fetchAllVacantesTit";
import ContentModalAsignacionTit from "../ContentModalAsignacionTit/ContentModalAsignacionTit";

import { useReactToPrint } from 'react-to-print';
import PaginaDesignacion from "../PaginaDesignacion/PaginaDesignacion";
import PaginaDesignacionTitular from "../PaginaDesignacionTitular/PaginaDesignacionTitular";
import { fetchVacanteAsignadaTit } from "../../utils/fetchVacanteAsignadaTit";
import { updateEstadoAsignadoInscripto } from "../../utils/updateEstadoAsignadoInscripto";
import { updEstadoAsignadoInscriptoTit } from "../../utils/updateEstadoAsignadoInscriptoTit";
import PaginaAsistenciaTitular from "../PaginaAsistenciaTitular/PaginaAsistenciaTitular";

const InscriptosTit = () =>{
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //E.G que trae la configuracion de sistema
    const configSG = useSelector((state)=>state.config);
    const userSG = useSelector((state)=>state.user);
    
    //E.L. de ventanas modales
    const[isOpenModalConfirm,openModalConfirm,closeModalConfirm]=useModal(false);
    const[isOpenModalAsign,openModalAsign,closeModalAsign]=useModal(false);
    const[isOpenModalVac,openModalVac,closeModalVac]=useModal(false);
    const[isOpenModalEdit,openModalEdit,closeModalEdit]=useModal(false);
    const[isOpenModal, openModal, closeModal]=useModal(false);

    //E.L. para Mensaje en Modal de Notificaciones
    const[mensajeModalInfo, setMensajeModalInfo]=useState('');
    const[mensajeModalConfirm, setMensajeModalConfirm]=useState('');

    //EL guardo el id del listado de inscriptos de titularizacion
    const[idListadoInscriptosTit, setIdListadoInscriptosTit]=useState('');

    //E.L. guarda la pagina actual de listado Inscriptos
    const[currentPage, setCurrentPage]=useState(1);
    //E.L. para guardar datos de paginacion de listado Inscriptos
    const[paginacion, setPaginacion]=useState('');

    //E.L. guarda la pagina actual de listado Vacantes
    const[currentPageVac, setCurrentPageVac]=useState(1);
    //E.L. para guardar datos de paginacion de listado Vacantes
    const[paginacionVac, setPaginacionVac]=useState('');

    //E.L. para filtro de estado de los incriptos
    //puede ser: "todos", "sinasignar" o "asignados"
    const[estadoInscripto, setEstadoInscripto]=useState('todos');

    //E.L. donde se almacena el Listado de Inscriptos (carga inicial)
    //y segun el tipo de listado segun configuracion
    const[listadoInscriptosTit, setListadoInscriptosTit]=useState([]);

    //E.L donde se almacena listado de vacants disponibles
    const[listadoVacantesDispTit,setListadoVacantesDispTit]=useState([]);

    //E.L. guardo el id del lsitado de vacantes de titularizacion
    const[idListadoVacantesTit, setIdListadoVacantesTit]=useState('');

    //E.L. donde se almacena el listado de especialidades
    const[listadoEspecialidades, setListadoEspecialidades]=useState([]);

    //E.L. para input busqueda Inscriptos
    const[inputSearch, setInputSearch]=useState('');

    //E.L. para input busqueda Vacantes
    const[inputSearchVac, setInputSearchVac]=useState('');

    const[datosInscriptoSelect, setDatosInscriptoSelect]=useState({})

    const[idInscriptoSelect, setIdInscriptoSelect]=useState('');

    const[formInscripto, setFormInscripto]=useState({
        orden:'',
        dni:'',
        apellido:'',
        nombre:'',
        total:'',
        id_especialidad:''
    });

    const[formEstado, setFormEstado]=useState('ver');

    const[selectFiltroEspecialidad, setSelectFiltroEspecialidad]=useState("");

    const[filtroEspecialidadVac, setFiltroEspecialidadVac]=useState("");

    const[datosVacante, setDatosVacante]=useState({});

    const componentRef = useRef(null);
    const componentRefAsistencia = useRef(null);

    const[cargoAsignado, setCargoAsignado]=useState('');

    const[estadoAsignadoInscripto, setEstadoAsignadoInscripto]=useState('');

    const[filtroRegionVac, setFiltroRegionVac]=useState('');

    const[filtroModalidadVac, setFiltroModalidadVac]=useState('');

    const isIntervalActive = useSelector((state)=>state.interval.isIntervalActive);

    //-------------------------------------
    //      PROCEDIMIENTOS Y FUNCIONES
    //-------------------------------------

    const logOut = () =>{
        dispatch(outUser());
        navigate('/')
    };

    //Proc que trae el ID del listado configurado
    const buscoIdlistadoInscrip = async(id_nivel) =>{
        //Filtro configuracion para el nivel
        const configFilterNivel = await configSG.config.filter((configNivel)=>configNivel.id_nivel==id_nivel);
        //console.log('que trae configFilterNivel: ', configFilterNivel);

        //Traigo el id_listado cargado en configuracion para:
        //LISTADO DE INSCRIPTOS DE TITULARIZACION -> id_listado_inscriptos_tit
        const idFilterListado = configFilterNivel[0]?.id_listado_inscriptos_tit;
        //console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo el id del listado de inscriptos
        setIdListadoInscriptosTit(idFilterListado);

        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO
        await getInscriptosTit(idFilterListado,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
        
    };

    //Este Proc carga el listado de inscriptos_tit al E.L
    const getInscriptosTit = async(id_listado,page,filtroAsignacion,valorBusqueda,filtroEspecialidad) =>{
        let data;
        const limit=10;
        //console.log('que trae id_listado getInscriptosTitListado: ', id_listado);
        if(id_listado){
            //paso id_listado, limit y page
            data = await fetchAllInscriptosTit(id_listado, limit, page,filtroAsignacion, valorBusqueda,filtroEspecialidad);
            //console.log('que trae data de fetchAllInscriptosTit: ', data);

            if(data.result?.length!=0){
                setListadoInscriptosTit(data.result); 
                setPaginacion(data.paginacion);
            }else{
                setListadoInscriptosTit([]);
                setPaginacion(data.paginacion);
            };
        };
    }; 

    //Este Proc carga el listado de especialidades en E.L.
    const cargaEspecidalidades=async()=>{
        const data = await fetchAllEspecialidades();
        //console.log('que tiene especialidades: ', data);
        if(data?.length!=0){
            setListadoEspecialidades(data);
        }
    };

    //Proc: traigo el ID del listado de Vacantes configurado
    const buscoIDListadoVacantes = async(id_nivel) =>{
        //Filtro configuracion para el nivel
        const configFilterNivel = await configSG.config.filter((configNivel)=>configNivel.id_nivel==id_nivel);
        //console.log('que trae configFilterNivel: ', configFilterNivel);

        //Traigo el id del listado cargado en configuracion para:
        //LISTADO DE VACANTES DE TITULARIZACION -> id_listado_vacantes_tit
        const idFilterListado = configFilterNivel[0]?.id_listado_vacantes_tit;
        //console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo id_listado_vacantes_tit para usarlo despues
        setIdListadoVacantesTit(idFilterListado);

        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE VACANTES DISPONIBLES
        await getVacantesDisponiblesTit(idFilterListado, currentPageVac,'disponibles',filtroEspecialidadVac,inputSearchVac)
    };

    //Este Proc carga el listado de VACANTES Disponibles al E.L
    const getVacantesDisponiblesTit = async(id_listado,page,filtroAsignacion,filtroEspecialidad,valorBusqueda, filtroRegion, filtroModalidad) =>{
        //console.log('que ingresa a id_listado: ', id_listado);
        //console.log('que ingresa a page: ', page);
        //console.log('que ingresa a filtroAsignacion: ', filtroAsignacion);
        //console.log('que ingresa a filtroEspecialidad: ', filtroEspecialidad);
        //console.log('que ingresa a valorBusqueda: ', valorBusqueda);
        //console.log('que ingresa a filtroRegion: ', filtroRegion);
        //console.log('que ingresa a filtroModalidad: ', filtroModalidad);
        let data;
        const limit=10;
        //console.log('que trae id_listado getVacantesDisponiblesMov: ', id_listado);
        if(id_listado){
            data = await fetchAllVacantesTit(id_listado,limit,page, filtroAsignacion, filtroEspecialidad, valorBusqueda, filtroModalidad, filtroRegion);
            //console.log('que trae data de fetchAllVacantesTit: ', data);

            if(data.result?.length!=0){
                setListadoVacantesDispTit(data.result); 
                setPaginacionVac(data.paginacion);
            }else{
                setListadoVacantesDispTit([]);
                setPaginacionVac(data.paginacion);
            }
        };
    };  



    //-----------PROCESOS DE BUSQUEDA EN LISTADO INSCRIPTOS------------
    //Escribir dentro del input de busqueda
    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setInputSearch(value);
    };

    //Presiono boton Cancelar (X) dentro de input busqueda
    const handleCancelSearch=async()=>{
        setInputSearch('')
        setCurrentPage(1);
    };
     
    //-------------------------------------------------------------------

    const handlePageChange = (nuevaPagina)=>{
        if(nuevaPagina>0 && nuevaPagina<=paginacion?.totalPages){
            setCurrentPage(nuevaPagina);
        };
    };

    const handlePageChangeVac = (nuevaPagina)=>{
        if(nuevaPagina>0 && nuevaPagina<=paginacionVac?.totalPages){
            setCurrentPageVac(nuevaPagina);
        };
    };

    const submitVerDatosInscripto = async(datosInscripto)=>{
        //console.log('presiono en submitVerDatosInscripto');
        //console.log('que tiene datos inscripto: ', datosInscripto);
        setDatosInscriptoSelect(datosInscripto);
        //traigo datos de la vacante asignada
        if(datosInscripto.vacante_asignada!=null && datosInscripto.vacante_asignada!=''){
            //console.log('TIENE CARGO ASIGNADO');
            const data = await fetchVacanteAsignadaTit(datosInscripto.vacante_asignada);
            //console.log('que trae data de fetchVacanteAsignadaTit: ',data);
            setCargoAsignado(data[0]);
            setDatosVacante(data[0])
        }else{
            setCargoAsignado('');
            setDatosVacante({})
        }

        openModalEdit();
    };

    const seteoDatosInicialesFormInscripto=()=>{
        setFormInscripto({
            orden:datosInscriptoSelect.orden,
            dni:datosInscriptoSelect.dni,
            apellido:datosInscriptoSelect.apellido,
            nombre:datosInscriptoSelect.nombre,
            total:datosInscriptoSelect.total,
            id_especialidad:datosInscriptoSelect.id_especialidad
        });
        setIdInscriptoSelect(datosInscriptoSelect.id_inscriptos_tit);
        setFormEstado('ver');
    }

    const handleChangeFormInscripto = (event)=>{
        const{name, value} = event.target;
        setFormInscripto({
            ...formInscripto,
            [name]:value
        });
        setFormEstado('editar');
    }

    const submitGuardarFormInscripto=async()=>{
        //console.log('presiono en submitGuardarFormInscripto');
        const idInscriptoTit = idInscriptoSelect;
        await axios.put(`${URL}/api/editinscriptotit/${idInscriptoTit}`,formInscripto)
            .then(async res=>{
                //console.log('que trae res de editinscriptotit: ', res);
                //Mostar mensaje de datos actualizados.
                setMensajeModalInfo('Datos Modificados Correctamente')
                openModal();
            })
            .catch(error=>{
                console.log('que trae error editinscriptotit: ', error);
            })
    };

    const handleCancelDatosInscriptoTit=()=>{
        //Cancelar modificacion datos inscripto
        
    };

    const submitCloseModal = ()=>{
        closeModal();
        closeModalEdit();
        setFormEstado('ver');
        //recargo lista de inscriptos por alguna edicion en datos
        getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
    };

    const handleSelectFiltroEspecialidad=(event)=>{
        const{value} = event.target;
        //console.log('que tiene filtroEspecialidad: ', value);
        setSelectFiltroEspecialidad(value);
        setFiltroEspecialidadVac(value);
        setCurrentPageVac(1);
        //al seleccionar una especialidad, regrso a la primer pagina, por si no hay tantos inscriptos
        setCurrentPage(1);
        //getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,value);
    };

    const handleSelectFiltroEspecialidadVac=(event)=>{
        const{value} = event.target;
        //console.log('que tiene filtroEspecialidad: ', value);
        //setSelectFiltroEspecialidad(value);
        setFiltroEspecialidadVac(value);
        setCurrentPageVac(1);
        //al seleccionar una especialidad, regrso a la primer pagina, por si no hay tantos inscriptos
        setCurrentPage(1);
        //getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,value);
    };

    const handleCancelFiltroEspecialidadVac=()=>{
        //
        setFiltroEspecialidadVac("");
    };

    const submitVerVacantes = (datosInscripto) =>{
        //console.log('que tien datosInscriptos: ', datosInscripto);
        //setCurrentPageVac(1);
        setDatosInscriptoSelect(datosInscripto);
        //cargo listado de vacantes disponibles
        getVacantesDisponiblesTit(idListadoVacantesTit, currentPageVac,'disponibles',filtroEspecialidadVac,inputSearchVac)
        
        //Verifico si estado_asignacion tiene algun estado guardado lo actualizo para mostrar
        if(datosInscripto.id_estado_inscripto!=null){
            //console.log('Asigno id_estado_inscripto guardado');
            setEstadoAsignadoInscripto(datosInscripto.id_estado_inscripto);
        }
        
        //llamo a modal de vacantes
        openModalVac();
    };

    const submitCloseModalVac = ()=>{
        closeModalVac();
        setCurrentPageVac(1);
        setInputSearchVac('');
        setFiltroRegionVac('');
        setFiltroModalidadVac('');
    };

    const handleInputSearchVacChange = (event)=>{
        const {value}=event.target;
        setInputSearchVac(value);
        setCurrentPageVac(1);
    };

    const handleCancelSearchVac = ()=>{
        /**Presiono boton cruz cancela busqueda */
        //console.log('cancela busqueda');
        setInputSearchVac('');
    };

    //?-------------------------------------
    //?--------PROCESO ASIGNACION-----------
    const submitVerAsignacion = async(datosVacanteSeleccionada)=>{
        //console.log('presiono ver la asignacion');
        setDatosVacante(datosVacanteSeleccionada);
        openModalAsign();
    };

    const submitAsignarVacante = async() =>{

        //ACTUALIZO ESTADO A INSCRIPTO -> 1=Asignado
        await updEstadoAsignadoInscriptoTit(datosInscriptoSelect.id_inscriptos_tit, 1);

        const fechaHoraActual = await traeFechaHoraActual();
        const formAsignacionTit={
            id_vacante_tit:datosVacante.id_vacante_tit,
            id_inscripto_tit:datosInscriptoSelect.id_inscriptos_tit,
            datetime_asignacion:fechaHoraActual
        };
        //console.log('como queda body a enviar createasignaciontit: ', formAsignacionTit);

        //ASIGNACION
        await axios.post(`${URL}/api/createasignaciontit`,formAsignacionTit)
            .then(async res=>{
                //console.log('que trae res de createasignaciontit: ', res);
                setMensajeModalConfirm('Asignacion Realizada, ¿imprime designacion?')
                openModalConfirm();
            })
            .catch(error=>{
                console.log('que tiene error createasignaciontit: ', error);
            })
    };

    const traeFechaHoraActual = () => {
        const now = new Date();
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11, por eso se suma 1
        const day = String(now.getDate()).padStart(2, '0');
    
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    //Proceso para Imprimir la designacion
    const procesoImpresion = async()=>{
        //console.log('ingresa a Impresion');
        await handlePrint();
    };

    const handlePrint = useReactToPrint({
        content:() => componentRef.current,
        pageStyle:`
        @page {
          size: LEGAL; /* Tamaño del papel */
          orientation: portrait; /* Orientación vertical */
        }
      `,
    });


    //PROCESO IMPRESION DE ASISTENCIA
    const procesoImpresionAsistencia = async()=>{
        //console.log('ingresa a Impresion Asistencia');
        await handlePrintAsistencia();
    };

    const handlePrintAsistencia = useReactToPrint({
        content:() => componentRefAsistencia.current,
        pageStyle:`
        @page {
          size: LEGAL; /* Tamaño del papel */
          margin:0.4cm;
          orientation: portrait; /* Orientación vertical */
        }
        body {
            margin: 0.4
        }
      `,
    });

    //-------------------------------------

    const submitCloseModalConfirm = () =>{
        closeModalConfirm();
        closeModalAsign();
        closeModalVac();
        setDatosVacante({});
        setDatosInscriptoSelect({});
        //Recargo lista de inscriptos 
        getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
    };

    const submitEliminarTomaCargo = async(idAsignacion) =>{
        //console.log('que trae idAsignacion: ', idAsignacion);
        const fechaHoraActual = traeFechaHoraActual();
        const datosBody={
            obsDesactiva:`Se desactiva la Asignacion por Eliminacion ${fechaHoraActual}`
        }

        try{
            await axios.post(`${URL}/api/delasignaciontit/${idAsignacion}`,datosBody)
            .then(async res=>{
                //console.log('que trae res de delasignaciontit: ', res);

                //Actualizo Estado de Asignacion de Insripto
                await updEstadoAsignadoInscriptoTit(datosInscriptoSelect.id_inscriptos_tit, null);

                //Mostrar Notificacion de Eliminacion de Asignacion
                setMensajeModalInfo('Vacante que titularizo eliminado correctamente');
                openModal();
            })
            .catch(error=>{
                console.log('que trae error delasignaciontit: ', error)
            });

        }catch(error){
            console.error(error.message);
        }
        //Al final del Proceso de Eliminar Asignacion recargo el listado de Vacantes Disponibles
        getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
    };

    //?------   PROCESOS PARA GUARDAR ESTADO INSCRIPTOS  ---------------------------
    const HandleSelectEstadoAsignadoInscripto=(event)=>{
        const{value} = event.target;
        //console.log('que viene en handleSelectEstadoAsignadoInscripto: ', value);
        setEstadoAsignadoInscripto(value);
    };

    const submitGuardarEstadoInscripto=async()=>{
        //console.log('que tiene estadoAsignadoInscripto: ', estadoAsignadoInscripto)
        try{
            const datosUpdateEstado = await updEstadoAsignadoInscriptoTit(datosInscriptoSelect.id_inscriptos_tit, estadoAsignadoInscripto);
            //console.log('que trae datosUpdateEstado: ', datosUpdateEstado)
            setMensajeModalInfo('Estado del Inscripto Actualizado');
            openModal();
            setEstadoAsignadoInscripto('');
            

        }catch(error){
            console.log('error en updEstadoAsignadoInscriptoTit', error);
        }

    };

    /**PROCESO QUE ELIMINA LOS SUBFILTROS APLICADOS DE REGION Y MODALIDAD 
     * VER FACTIBILIDAD DE APLICACION
    */
    const submitEliminarSubFiltros = () =>{

    };

    /**PROCESO DE FILTRO DE REGION */
    const handleSelectFiltroRegion = (event) => {
        const {value}=event.target;
        //Seleccion de Region
        //console.log('que trae value handleSelectFiltroRegion: ', value);
        setFiltroRegionVac(value);
        setCurrentPageVac(1);
    };

    const handleCancelFiltroRegionVac = (event) => {
        const{value}=event.target;
        //Cancelar Filtro de Region
        //console.log('que trae value handleCancelFiltroRegionVac: ', value);
        setFiltroRegionVac('');
        setCurrentPageVac(1);
    };

    /**PROCESOS DE FILTRO DE MODALIDAD */
    const handleSelectFiltroModalidad = (event) =>{
        const{value}=event.target;
        //Seleccion de Modalidad
        //console.log('que trae value handleSelectFiltroModalidad: ', value);
        setFiltroModalidadVac(value);
        setCurrentPageVac(1);
    };

    const handleCancelFiltroModalidadVac = (event)=>{
        //Cancelar Filtro de Modalidad
        setFiltroModalidadVac('');
        setCurrentPageVac(1);
    }

    const handleCancelFiltroEspecialidadLuom =()=>{
        setSelectFiltroEspecialidad("");
        setCurrentPage(1);
    };

    //?--------------------------------------------------

    useEffect(()=>{
        //console.log('que tiene EstadoAsignadoInscriptos: ', estadoAsignadoInscripto);
    },[estadoAsignadoInscripto])

    useEffect(()=>{
        //console.log('que tiene Cargo Asignado: ', cargoAsignado)
    },[cargoAsignado])

    useEffect(()=>{
        seteoDatosInicialesFormInscripto();
        //console.log('que tiene datosInscriptoSelect: ', datosInscriptoSelect);
    },[datosInscriptoSelect])

    useEffect(()=>{
        //console.log('que tiene datos de Vacantes seleccionada: ', datosVacante);
    },[datosVacante])

    useEffect(()=>{
        //console.log('APLICO FILTRO LISTADO INSCRIPTOS');
        getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
    },[estadoInscripto,inputSearch,selectFiltroEspecialidad])

    useEffect(()=>{
        //recargo listado de inscriptos con la nueva pagina
        getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
    },[currentPage])


    //------------Estados desde Modal Vacantes
    useEffect(()=>{
        //console.log('APLICO FILTRO LISTADO VACANTES');
        getVacantesDisponiblesTit(idListadoVacantesTit, currentPageVac,'disponibles',filtroEspecialidadVac,inputSearchVac, filtroRegionVac, filtroModalidadVac)
    },[filtroEspecialidadVac,inputSearchVac, filtroRegionVac, filtroModalidadVac])

    useEffect(()=>{
        //Al cambiar de pagina en Vacantes Disponibles
        getVacantesDisponiblesTit(idListadoVacantesTit, currentPageVac,'disponibles',filtroEspecialidadVac,inputSearchVac, filtroRegionVac, filtroModalidadVac)
    },[currentPageVac])


    /**INTERVALO PARA ACTUALIZAR LA PAGINA DE INSCRIPTOS */
    useEffect(()=>{
        if (!isIntervalActive) return;

        getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);

        const intervalId = setInterval(()=>{
            //console.log('ACTIVO INTERVALO')
            getInscriptosTit(idListadoInscriptosTit,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
        }, 5000);
        
        return()=>clearInterval(intervalId);
    },[isIntervalActive,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad])


    //AL INGRESAR SE CARGA EL LISTADO DE INSCRIPTOS
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //LLAMO AL PROCEDIMIENTO buscoIdlistadoInscrip Y PASO EL NIVEL CARGADO EN STORE GLOBAL
        buscoIdlistadoInscrip(configSG.nivel.id_nivel);

        //Cargo las especialidades
        cargaEspecidalidades();

        //LLAMO AL PROCEDIMIENTO buscoIDListadoVacantes Y PASO EL NIVEL CARGADO EN STORE GLOBAL
        buscoIDListadoVacantes(configSG.nivel.id_nivel);

    },[]);
    
    return(
        <div className="notranslate h-full w-full">
            {/* ENCABEZADO PAGINA */}
            <div className="bg-[#C9D991] h-[12vh] flex flex-row">
                {/* TITULOS - NIVEL */}
                <div className="w-[45vw] flex justify-center items-start flex-col">
                    <label className="ml-4 text-base font-semibold">NIVEL {configSG.nivel.descripcion}</label>
                    <div className="flex flex-row">
                        <label className="ml-4 text-lg font-sans font-bold">INSCRIPTOS - LUOM</label>
                    </div>
                    {/**SELECCION FILTRO ESPECIALIDAD */}
                    <div className="ml-4 flex flex-row">
                        <label className="mr-2 ">Especialidad: </label>
                        <select
                            className=" border-[1px] rounded border-gray-500"
                            name="filtroEspecialidad"
                            onChange={handleSelectFiltroEspecialidad}
                            value={selectFiltroEspecialidad}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoEspecialidades?.map((especialidad,index)=>(
                                    <option key={index} value={especialidad.id_especialidad}>{especialidad.abreviatura} - {especialidad.descripcion}</option>
                                ))
                            }
                        </select>
                        {(selectFiltroEspecialidad!="") &&
                            <label 
                                className="font-bold mx-2 cursor-pointer"
                                onClick={handleCancelFiltroEspecialidadLuom}
                            >X</label>
                        }
                    </div>
                </div>
                {/* SECCION DATOS USUARIO */}
                <div className=" w-[40vw] flex items-center justify-end">
                    <label className="mr-2 italic text-sm">{userSG.nombre}</label>
                    <FaRegUserCircle className="mr-2 text-2xl text-[#73685F] " />
                    <FaPowerOff 
                        className="mr-4 text-2xl text-[#73685F] hover:cursor-pointer hover:text-[#7C8EA6] transition-transform duration-500 transform hover:scale-125"
                        title="Salir"
                        onClick={()=>logOut()}
                    />
                </div>
            </div>

            {/* CONTENIDO DE PAGINA */}
            <div className="h-[87vh]">
                <div className="m-2 border-[1px] border-[#758C51] rounded h-[72vh]">
                    {/* PARTE SUPERIOR DE TABLA */}
                    <div className="border-b-[1px] border-slate-300 h-[6vh] flex flex-row items-center">
                        {/* Filtros */}
                        <div className="text-base w-[50%] ">
                            <label 
                                className={`border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoInscripto==='todos')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoInscripto('todos');setCurrentPage(1)}}
                            >Todos</label>
                            <label 
                                className={`border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoInscripto==='sinasignar')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoInscripto('sinasignar');setCurrentPage(1)}}
                            >Sin Asignar</label>
                            <label 
                                className={`border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoInscripto==='asignados')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoInscripto('asignados');setCurrentPage(1)}}
                            >Asignados</label>
                        </div>

                        {/* Campo de Busqueda */}
                        <div className="w-[50%]  flex justify-end">
                            <div className="border-[1px] border-zinc-400 w-[20vw] rounded flex flex-row items-center justify-between mr-2">
                                <input 
                                    className="w-[15vw] focus:outline-none rounded"
                                    placeholder="Buscar..."
                                    type="text"
                                    value={inputSearch}
                                    onChange={handleInputSearchChange}
                                />
                                <div className="flex flex-row items-center">
                                    {(inputSearch!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer text-lg"
                                            onClick={()=>handleCancelSearch()}
                                        />
                                    }
                                    {/* <FaSearch 
                                        className="text-zinc-500 cursor-pointer mr-2"
                                        onClick={()=>submitSearch()}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PARTE INFERIOR DE DATOS DE TABLA */}
                    <div className="h-[79vh] overflow-y-auto">
                        <table className="border-[1px] bg-slate-50 w-full">
                            <thead>
                                <tr className="sticky top-0 text-sm border-b-[1px] border-zinc-300 bg-zinc-200">
                                    <th className="border-r-[1px] border-zinc-300">Orden</th>
                                    <th className="border-r-[1px] border-zinc-300">Puntaje</th>
                                    {/* <th className="border-r-[1px] border-zinc-300">Apellido</th> */}
                                    <th className="border-r-[1px] border-zinc-300">Nombre Docente</th>
                                    <th className="border-r-[1px] border-zinc-300">DNI</th>
                                    <th className="border-r-[1px] border-zinc-300">Especialidad</th>
                                    <th className="border-r-[1px] border-zinc-300">Obs</th>
                                    <th className="border-r-[1px] border-zinc-300">Estado</th>
                                    <th className="">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    // filterListadoInscriptosMov?.map((inscripto, index)=>{
                                    listadoInscriptosTit?.map((inscripto, index)=>{
                                        const colorFila = inscripto.vacante_asignada ?`bg-red-200` :(((inscripto.id_inscriptos_tit % 2)===0) ?`bg-zinc-200` :``)
                                        return(
                                            <tr 
                                                className={`text-lg font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 ${colorFila}`}
                                                key={index}
                                            >
                                                <td className="text-center">{inscripto.orden}</td>
                                                <td className="text-center">{inscripto.total}</td>
                                                {/* <td>{inscripto.apellido}</td> */}
                                                <td>{inscripto.apellido} {inscripto.nombre}</td>
                                                <td>{inscripto.dni}</td>
                                                <td className="font-sans font-light">{inscripto.especialidad}</td>
                                                <td className="text-sm font-sans font-light">{inscripto.observaciones}</td>
                                                <td>{inscripto.descripcion_estado_inscripto}</td>
                                                <td>
                                                    <div className="flex flex-row items-center justify-center  ">
                                                        {/* {(inscripto.vacante_asignada===null )
                                                            ?<FiAlertTriangle    
                                                                className="mr-2 blink text-red-500"
                                                                />
                                                            :``
                                                        } */}
                                                        <FaEye 
                                                            className="hover:cursor-pointer hover:text-[#83F272]" 
                                                            title="Ver Datos"
                                                            onClick={()=>submitVerDatosInscripto(inscripto)}
                                                        />
                                                        {
                                                            ((inscripto.vacante_asignada===null || inscripto.vacante_asignada==='') && userSG.permiso!=4)
                                                            ?<BiTransferAlt 
                                                                className="text-2xl hover:cursor-pointer hover:text-[#83F272] ml-2"      
                                                                title="Vacantes"
                                                                onClick={()=>submitVerVacantes(inscripto)}
                                                            />
                                                            :``
                                                        }
                                                        
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECCION PAGINACION */}
                <div className="flex justify-center">
                    <Paginador 
                        currentpage={paginacion.page}
                        totalpage={paginacion.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={paginacion.totalItems}
                    />
                </div>

            </div>

            {/* MODAL DE DATOS DEL INSCRPTO */}
            <ModalEdit isOpen={isOpenModalEdit} closeModal={closeModalEdit}>
                <ContentModalDatosInscriptoTit
                    datosFormInscripto = {formInscripto}
                    datosInscriptoSelect={datosInscriptoSelect}
                    idInscriptoSelect={idInscriptoSelect}
                    closeModal={closeModalEdit}
                    handleChangeFormInscripto={handleChangeFormInscripto}
                    formEstadoInscripto={formEstado}
                    submitGuardarFormInscripto={submitGuardarFormInscripto}
                    cargoAsignado={cargoAsignado}
                    procesoImpresion={procesoImpresion}
                    submitEliminarTomaCargo={submitEliminarTomaCargo}
                    procesoImpresionAsistencia={procesoImpresionAsistencia}
                    //handleCancelDatosInscriptoTit={handleCancelDatosInscriptoTit}
                    handleCancelDatosInscriptoTit={seteoDatosInicialesFormInscripto}
                    userSG={userSG}
                />
            </ModalEdit>

            {/* MODAL DE VACANTES DISPONIBLES */}
            <ModalEdit isOpen={isOpenModalVac} closeModal={closeModalVac}>
                <ContentModalVacantesDispTit
                    datosInscriptoSelect={datosInscriptoSelect}
                    submitCloseModalVac={submitCloseModalVac}
                    listadoVacantesDispTit={listadoVacantesDispTit}
                    currentPageVac={currentPageVac}
                    paginacionVac={paginacionVac}
                    handlePageChangeVac={handlePageChangeVac}
                    inputSearchVac={inputSearchVac}
                    handleInputSearchVacChange={handleInputSearchVacChange}
                    handleCancelSearchVac={handleCancelSearchVac}
                    submitVerAsignacion={submitVerAsignacion}
                    listadoEspecialidades={listadoEspecialidades}
                    filtroEspecialidadVac={filtroEspecialidadVac}
                    handleSelectFiltroEspecialidadVac={handleSelectFiltroEspecialidadVac}
                    handleCancelFiltroEspecialidadVac={handleCancelFiltroEspecialidadVac}
                    estadoAsignadoInscripto={estadoAsignadoInscripto}
                    setEstadoAsignadoInscripto={setEstadoAsignadoInscripto}
                    HandleSelectEstadoAsignadoInscripto={HandleSelectEstadoAsignadoInscripto}
                    submitGuardarEstadoInscripto={submitGuardarEstadoInscripto}
                    submitEliminarSubFiltros = {submitEliminarSubFiltros}
                    /**Procesos de filtros de region */
                    handleSelectFiltroRegion = {handleSelectFiltroRegion}
                    filtroRegionVac = {filtroRegionVac}
                    handleCancelFiltroRegionVac = {handleCancelFiltroRegionVac}
                    /**Procesos de Filtros de Modalidad */
                    handleSelectFiltroModalidad={handleSelectFiltroModalidad}
                    filtroModalidadVac={filtroModalidadVac}
                    handleCancelFiltroModalidadVac={handleCancelFiltroModalidadVac}
                />
            </ModalEdit>

            {/* MODAL DE ASIGNACION VACANTE */}
            <ModalEdit isOpen={isOpenModalAsign} closeModal={closeModalAsign}>
                <ContentModalAsignacionTit
                    closeModalAsign={closeModalAsign}
                    datosInscriptoSelect={datosInscriptoSelect}
                    datosVacanteSelect={datosVacante}
                    procesoImpresion={procesoImpresion}
                    submitAsignarVacante={submitAsignarVacante}
                />
            </ModalEdit>

            {/* PAGINA DE IMPRESION DESIGNACION */}
            <div 
                className="flex flex-col print:page-break-after"
                ref={componentRef}
            >
                <PaginaDesignacionTitular
                    datosInscripto={datosInscriptoSelect}
                    datosVacante={datosVacante}
                    id_nivel={configSG?.nivel.id_nivel}
                />
            </div>

            {/* PAGINA DE IMPRESION ASISTENCIA */}
            <div 
                className="flex flex-col print:page-break-after"
                ref={componentRefAsistencia}
            >
                <PaginaAsistenciaTitular
                    datosInscripto={datosInscriptoSelect}
                    datosVacante={datosVacante}
                    id_nivel={configSG?.nivel.id_nivel}
                />
            </div>

            {/* MODAL DE NOTIFICACION Y CONFIRMACION DE IMPRESION DESIGNACION */}
            <ModalEdit isOpen={isOpenModalConfirm} closeModal={closeModalConfirm}>
                <div className="mt-10 w-[30vw] flex flex-col items-center">
                    <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1>
                    <div className="flex flex-row">
                        <div className="flex justify-center mr-2">
                            <button
                                className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                                onClick={()=>{procesoImpresion(); 
                                    submitCloseModalConfirm()}}
                            >ACEPTAR</button>
                        </div>
                        <div className="flex justify-center ml-2">
                            <button
                                className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                                onClick={()=>submitCloseModalConfirm()}
                            >CANCELAR</button>
                        </div>
                    </div>    
                </div>
            </ModalEdit>


            {/* MODAL DE NOTIFICACIONES */}
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-10 w-72">
                    <h1 className="text-xl text-center font-bold">{mensajeModalInfo}</h1>
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>submitCloseModal()}
                        >OK</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default InscriptosTit;