import axios from "axios";
import {URL} from '../../../varGlobal';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Paginador from "../Paginador/Paginador";
import { useNavigate } from "react-router-dom";
import {fetchAllVacantesTit} from "../../utils/fetchAllVacantesTit";
import {useModal} from '../../hooks/useModal';
import ModalEdit from "../ModalEdit/ModalEdit";
import ContentModalVerDatosVacanteTit from "../ContentModalVerDatosVacanteTit.js/ContentModalVerDatosVacanteTit";

//-------ICONOS--------
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { SiGooglemaps } from "react-icons/si";
import { fetchAllEspecialidades } from "../../utils/fetchAllEspecialidades";
import Modal from "../Modal/Modal";
import ContentModalNuevaVacanteTit from "../ContentModalNuevaVacanteTit/ContentModalNuevaVacanteTit";


const VacantesTit = () => {

    const navigate=useNavigate();
    
    const userSG = useSelector((state)=>state.user);
    const configSG = useSelector((state)=>state.config);

    //E.L. para Ventanas Modales
    const[isOpenModalNuevo,openModalNuevo,closeModalNuevo]=useModal(false);
    const[isOpenModalVerVacante,openModalVerVacante,closeModalVerVacante]=useModal(false);
    const[isOpenModal, openModal, closeModal]=useModal(false);
    const[isOpenModalConfirm, openModalConfirm, closeModalConfirm]=useModal(false);

    //E.L. para Mensaje en Modal de Notificaciones
    const[mensajeModalInfo, setMensajeModalInfo]=useState('');
    //E.L. para Mensaje en Modal de Confirmacion
    const[mensajeModalConfirm, setMensajeModalConfirm]=useState('');


    //E.L. donde se almacena el listado de Vacantes  (carga inicial)
    //y segun el tipo de listado de vacantes indicado en configuracion
    const[listadoVacantesTit, setListadoVacantesTit]=useState([]);

    //E.L. para filtro de estado de las vacantes
    //puede ser: "todas", "disponibles" o "asignadas"
    const[estadoVacantes, setEstadoVacantes]=useState('todas');

    //E.L. para input busqueda Vacantes
    const[inputSearchVac, setInputSearchVac]=useState('');

    //E.L. guarda la pagina actual de listado Vacantes
    const[currentPageVac, setCurrentPageVac]=useState(1);

    //E.L. para guardar datos de paginacion de listado Vacantes
    const[paginacionVac, setPaginacionVac]=useState('');

    //E.L. guardo el id del lsitado de vacantes de titularizacion
    const[idListadoVacantesTit, setIdListadoVacantesTit]=useState('');

    //E.L. donde guarda la especialidad seleccionada
    const[filtroEspecialidadVac, setFiltroEspecialidadVac]=useState("");

    //E.L. donde se almacena el listado de especialidades
    const[listadoEspecialidades, setListadoEspecialidades]=useState([]);

    //EL donde guardo los datos de la vacante seleccionada
    const[datosVacanteSelect, setDatosVacanteSelect]=useState({});

    const[datosInscriptoAsignado, setDatosInscriptoAsignado]=useState({});


    //E.L. de form que se usa para actualizar los datos de la Vacante
    const[formVacante, setFormVacante]=useState({
        nro_establecimiento:'', 
        nombre_establecimiento:'', 
        cargo:'', 
        modalidad:'', 
        turno:'', 
        cupof:'',
        localidad:'', 
        departamento:'',
        region:'', 
        zona:''
    });

    //E.L que se usa para validar si se modifico algun dato del formulario, si es asi
    //el estado cambia a "editar" -> habilita botones GUARDAR y CANCELAR
    //si no modifica nada el estado es "ver" - habilita boton CERRAR
    const[estadoForm, setEstadoForm]=useState('ver');    

    //E.L. para validar si va a permitir guardar nueva vacante.
    const[validaFormNuevaVacante, setValidaFormNuevaVacante]=useState(false);

    //E.L. de form que se usa para Nueva Vacante
    const[formNuevaVacante, setFormNuevaVacante]=useState({
        id_listado_vac_tit:'',
        orden:'', 
        id_especialidad:'', 
        datetime_creacion:'',
        nro_establecimiento:'', 
        nombre_establecimiento:'', 
        cargo:'', 
        modalidad:'', 
        turno:'', 
        cupof:'',
        localidad:'', 
        departamento:'',
        region:'', 
        zona:''
    });

    const[obsEliminaVacante, setObsEliminaVacante]=useState("");

    const[filtroRegionVac, setFiltroRegionVac]=useState('');

    //--------------PROCESOS Y FUNCIONES----------

    const logOut = () =>{
        navigate('/')
    };

    //Proc: traigo el ID del listado de Vacantes Configurado
    const buscoIDListadoVacantes = async(id_nivel) =>{
        //Filtro configuracion para el nivel
        const configFilterNivel = await configSG.config.filter((configNivel)=>configNivel.id_nivel==id_nivel);
        //console.log('que trae configFilterNivel: ', configFilterNivel);

        //Traigo el id del listado cargado en configuracion para:
        //LISTADO DE VACANTES DE MOVIMIENTOS -> id_listado_vacantes_mov
        const idFilterListado = configFilterNivel[0]?.id_listado_vacantes_tit;
        //console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo id_listado_vacantes_mov para usarlo en nueva Vacante
        setIdListadoVacantesTit(idFilterListado);

        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE VACANTES DISPONIBLES
        await getVacantesTit(idFilterListado, currentPageVac,estadoVacantes,filtroEspecialidadVac,inputSearchVac);
    };

    //Este Proc carga el listado de VACANTES Disponibles al E.L
    const getVacantesTit = async(id_listado,page,filtroAsignacion,filtroEspecialidad,valorBusqueda, filtroRegion) =>{
        let data;
        const limit=10;
        //console.log('que trae id_listado getVacantesDisponiblesMov: ', id_listado);
        if(id_listado){
            data = await fetchAllVacantesTit(id_listado,limit,page, filtroAsignacion, filtroEspecialidad, valorBusqueda,"", filtroRegion);
            //console.log('que trae data de fetchAllVacantesTit: ', data);

            if(data.result?.length!=0){
                setListadoVacantesTit(data.result); 
                setPaginacionVac(data.paginacion);
            }else{
                setListadoVacantesTit([]);
                setPaginacionVac(data.paginacion);
            }
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


    const handlePageChange = (nuevaPagina)=>{
        if(nuevaPagina>0 && nuevaPagina<=paginacionVac?.totalPages){
            setCurrentPageVac(nuevaPagina);
        };
    };

    //-----------PROCESOS DE BUSQUEDA EN LISTADO VACANTES------------
    const handleInputSearchVacChange = (event)=>{
        const {value}=event.target;
        setInputSearchVac(value);
    };
    //Presiono boton Cancelar (X) dentro de input busqueda
    const handleCancelSearch=async()=>{
        setInputSearchVac('')
        setCurrentPageVac(1);
    };
    //-------------------------------------------------------------------


    const handleSelectFiltroEspecialidad=(event)=>{
        const{value} = event.target;
        //console.log('que tiene filtroEspecialidad: ', value);
        setFiltroEspecialidadVac(value);
        
        setCurrentPageVac(1);
        //al seleccionar una especialidad, regrso a la primer pagina, por si no hay tantos inscriptos
        
    };

    const submitVerDatosVacante = async(datosVacante) => {
        setDatosInscriptoAsignado({});
        //console.log('presiono en submitVerDatosVacante');
        //console.log('que tiene datos de vacante: ', datosVacante)
        await setDatosVacanteSelect(datosVacante);
        //busco datos de inscripto asignado si datetime_asignacion no es null
        if(datosVacante.datetime_asignacion!=null){
            //console.log('Busco datos del inscripto asignado')
            try{
                await axios.post(`${URL}/api/vacantetitasignadainscripto/${datosVacante.id_vacante_tit}`)
                    .then(async res=>{
                        //console.log('que trae res de vacanteasignadainscripto: ', res.data);
                        if(res.data.length!=0){
                            setDatosInscriptoAsignado(res.data[0]);
                            //setMensajeModalInfo(`Para eliminar la Vacante generada del Movimiento de: ${res.data[0].apellido}, ${res.data[0].nombre} (DNI: ${res.data[0].dni}), dirigase a Inscriptos`);
                            //openModal();
                        }
                    })
            }catch(error){
                console.log(error.message)
            }
        }

        openModalVerVacante();
    };

    
    const handleChangeFormVacante =(event)=>{
        const{name, value} = event.target;
        setFormVacante({
            ...formVacante,
            [name]:value
        });
        setEstadoForm('editar')
    };

    const seteoDatosInicialesFormVacante = () =>{
        setFormVacante({
            nro_establecimiento:datosVacanteSelect.nro_establecimiento, 
            nombre_establecimiento:datosVacanteSelect.nombre_establecimiento, 
            cargo:datosVacanteSelect.cargo, 
            modalidad:datosVacanteSelect.modalidad, 
            turno:datosVacanteSelect.turno, 
            cupof:datosVacanteSelect.cupof,
            localidad:datosVacanteSelect.localidad, 
            departamento:datosVacanteSelect.departamento,
            region:datosVacanteSelect.region, 
            zona:datosVacanteSelect.zona
        });
        //setIdVacanteSelect(datosVacanteSelect.id_vacante_mov);
        setEstadoForm('ver');
    };

    const submitGuardarFormVacante = async() => {
        //console.log('presiono en submitGuardarFormVacante');
        const idVacanteTit=datosVacanteSelect.id_vacante_tit;
        await axios.put(`${URL}/api/editvacantetit/${idVacanteTit}`,formVacante)
            .then(async res=>{
                //console.log('que trae res de editvacantetit: ', res);
                //Mostar mensaje de datos actualizados.
                setMensajeModalInfo('Datos Modificados Correctamente')
                openModal();
            })
            .catch(error=>{
                console.log('que trae error editvacantetit: ', error);
            })
    };

    const submitCloseModal = () => {
        closeModal();
        closeModalVerVacante();
        //closeModalNuevo();

        //cambio estado de formVacante
        setEstadoForm('ver');
        //recargo listao de inscriptos con datos actualizados
        getVacantesTit(idListadoVacantesTit, currentPageVac,estadoVacantes,filtroEspecialidadVac,inputSearchVac, filtroRegionVac);
    };
    

    const submitEliminarVacante = (datosVacante) =>{
        setDatosVacanteSelect(datosVacante)
        setMensajeModalConfirm('¿Seguro Elimina la Vacante?');
        openModalConfirm();
    };

    const procesoEliminarVacante = async() => {
        //console.log('Ingresa a procesoEliminarVacante');
        const idVacanteTit = datosVacanteSelect?.id_vacante_tit;
        //console.log('que tiene idVacanteTit: ', idVacanteTit);
        const fechaHoraActual = traeFechaHoraActual();
        let datosBody={}
        if(obsEliminaVacante===""){
            datosBody={obsDesactiva:`Se desactiva la VACANTE por Eliminacion ${fechaHoraActual}`}
        }else{
            datosBody={obsDesactiva:`${fechaHoraActual} - ${obsEliminaVacante}`}
        }

        try{
            await axios.put(`${URL}/api/delvacantetit/${idVacanteTit}`,datosBody)
            .then(async res=>{
                //console.log('que trae res de delvacantetit: ', res);

                //Mostrar Notificacion de Eliminacion de Vacante
                setMensajeModalInfo('Vacante Eliminada');
                openModal();

            }).catch(error=>{
                console.log('que trae error delvacantetit: ', error)
            });
            
        }catch(error){
            console.error(error.message);
        }
        //Al final del Proceso de Eliminar Vacante recargo el listado de Vacantes Disponibles
        getVacantesTit(idListadoVacantesTit, currentPageVac,estadoVacantes,filtroEspecialidadVac,inputSearchVac, filtroRegionVac);

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

    //----------Procesos NUEVA VACANTE-------------

    const submitNuevaVacante = () =>{
        setValidaFormNuevaVacante(false);
        setInicialFormNuevaVacante();
        openModalNuevo();
    };

    const setInicialFormNuevaVacante=async()=>{
        const fechaHoraActualNuevaVac = await traeFechaHoraActual();
        setFormNuevaVacante({
            id_listado_vac_tit:idListadoVacantesTit, //sale del listado de configuracion
            orden:null, //va a ser null
            id_especialidad:'', 
            datetime_creacion:fechaHoraActualNuevaVac, //traigo hora y fecha actual
            nro_establecimiento:'', 
            nombre_establecimiento:'', 
            cargo:'', 
            modalidad:'', 
            turno:'', 
            cupof:'',
            localidad:'', 
            departamento:'',
            region:'', 
            zona:''
        });
    };

    const submitCloseModalNuevo = ()=>{
        closeModalNuevo();
    };

    const handleChangeFormNuevaVacante =(event)=>{
        const{name, value} = event.target;
        
        if(name==='id_especialidad'){
            const filterEspecialidad = listadoEspecialidades;
            setFormNuevaVacante({
                ...formNuevaVacante,
                [name]:value.toUpperCase(),
                cargo: filterEspecialidad.filter((especialidad)=>especialidad.id_especialidad==value)[0].descripcion
            });
        }else{
            setFormNuevaVacante({
                ...formNuevaVacante,
                [name]:value.toUpperCase()
            });
        }
    };

    const submitGuardarFormNuevaVacante = async() => {

        //console.log('presiono en submitGuardarFormNuevaVacante');
        //console.log('como queda formNuevaVacante: ', formNuevaVacante);
        
        await axios.post(`${URL}/api/newvacantetit`,formNuevaVacante)
            .then(async res=>{
                //console.log('que trae res de newvacantetit: ', res);
                //Mostar mensaje de datos actualizados.
                setMensajeModalInfo('Vacante Creada Correctamente')
                openModal();
            })
            .catch(error=>{
                console.log('que trae error newvacantetit: ', error);
            })
    };

    const handleCancelFiltroEspecialidadVac =()=>{
        setFiltroEspecialidadVac("");
    };

    const handleChangeObsEliminaVacante = (event) =>{
        const {name, value}=event.target;
        setObsEliminaVacante(value);
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



    useEffect(()=>{
        if(formNuevaVacante.nro_establecimiento!='' && formNuevaVacante.id_especialidad!=''){
            setValidaFormNuevaVacante(true);
        }else{
            setValidaFormNuevaVacante(false);
        }
    },[formNuevaVacante])

    useEffect(()=>{
        //console.log('que tiene datosInscriptoAsignado: ', datosInscriptoAsignado);
    },[datosInscriptoAsignado]);

    useEffect(()=>{
        //console.log('que tene datosVacanteSelect: ', datosVacanteSelect);
        seteoDatosInicialesFormVacante();
    },[datosVacanteSelect])

    useEffect(()=>{
        getVacantesTit(idListadoVacantesTit, currentPageVac,estadoVacantes,filtroEspecialidadVac,inputSearchVac,filtroRegionVac);
    },[currentPageVac])

    useEffect(()=>{
        //console.log('APLICO FILTRO');
        getVacantesTit(idListadoVacantesTit, currentPageVac,estadoVacantes,filtroEspecialidadVac,inputSearchVac,filtroRegionVac);
    },[estadoVacantes,inputSearchVac,filtroEspecialidadVac,filtroRegionVac])


    useEffect(()=>{
        //console.log('que tiene configSG: ', configSG);
    },[configSG])

    useEffect(()=>{
        //console.log('que tiene userSG: ', userSG);
    },[userSG])

    //CARGO LISTADO DE VACANTES AL RENDERIZAR
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //LLAMO AL PROCEDIMIENTO buscoIDListadoVacantes Y PASO EL NIVEL CARGADO EN STORE GLOBAL
        buscoIDListadoVacantes(configSG.nivel.id_nivel);
        //Cargo las especialidades
        cargaEspecidalidades();
    },[])

    return(
        <div className=" notranslate h-full w-full">
            {/* ENCABEZADO DE PAGINA */}
            <div className="bg-[#C9D991] desktop:h-[12vh] movil:h[5vh] flex flex-row">
                {/* TITULOS - BOTONES - NIVEL */}
                <div className="desktop:w-[60vw] flex desktop:flex-col desktop:justify-center desktop:items-start  movil:flex-row movil:w-full movil:items-center movil:justify-center ">
                    <label className="ml-4 text-base font-semibold">NIVEL {configSG.nivel.descripcion}</label>
                    <div className="flex flex-col">
                        <div className="flex flex-row mb-2">
                            <label className="ml-4 text-lg font-sans font-bold">VACANTES</label>
                            {(userSG.permiso!=4) &&
                                <button 
                                    className="ml-4 px-[2px] border-[1px] border-[#73685F] rounded hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] shadow"
                                    onClick={submitNuevaVacante}
                                >Nueva Vacante</button>
                            }
                            
                        </div>
                        <div className="flex flex-row">
                            <label className="mx-4 ">Especialidad: </label>
                            <div className="border-[1px] rounded border-gray-500 bg-neutral-50">
                                <select
                                    className="w-[40vw] border-[1px] rounded focus:outline-none focus:ring-0 focus:border-none"
                                    name="filtroEspecialidad"
                                    onChange={handleSelectFiltroEspecialidad}
                                    value={filtroEspecialidadVac}
                                >
                                    <option value='' selected disabled>Seleccione...</option>
                                    {
                                        listadoEspecialidades?.map((especialidad,index)=>(
                                            <option 
                                                key={index} 
                                                value={especialidad.id_especialidad}
                                                className="text-base"
                                            >{especialidad.abreviatura} - {especialidad.descripcion}</option>
                                        ))
                                    }
                                </select>
                                {(filtroEspecialidadVac!="") &&
                                    <label 
                                        className="font-bold mx-2 cursor-pointer"
                                        onClick={handleCancelFiltroEspecialidadVac}
                                    >X</label>
                                }
                            </div>
                            {/* <select
                                className="w-[40vw] border-[1px] rounded border-gray-500"
                                name="filtroEspecialidad"
                                onChange={handleSelectFiltroEspecialidad}
                                value={filtroEspecialidadVac}
                            >
                                <option value='' selected disabled>Seleccione...</option>
                                {
                                    listadoEspecialidades?.map((especialidad,index)=>(
                                        <option 
                                            key={index} 
                                            value={especialidad.id_especialidad}
                                            className="text-base"
                                        >{especialidad.abreviatura} - {especialidad.descripcion}</option>
                                    ))
                                }
                            </select> */}
                        </div>
                    </div>
                </div>
                {/* SECCION DATOS USUARIO */}
                <div className="movil:hidden w-[25vw] desktop:flex items-center justify-end ">
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
            <div className="h-[87vh] flex flex-col items-center">
                <div className="desktop:h-[73vh] movil:h-[72vh] m-2 border-[1px] border-[#758C51] rounded desktop:w-[83vw] movil:w-[99vw]">
                    {/* PARTE SUPERIOR DE TABLA */}
                    <div className="border-b-[1px] border-slate-300 desktop:h-[6vh] flex desktop:flex-row desktop:items-center movil:h-[9vh] movil:flex-col-reverse movil:items-start">
                        {/* Filtros */}
                        <div className="text-base w-[50%] ">
                            <label 
                                className={`font-semibold border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoVacantes==='todas')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoVacantes('todas');setCurrentPageVac(1)}}
                            >Todas</label>
                            <label 
                                className={`font-semibold border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoVacantes==='disponibles')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoVacantes('disponibles');setCurrentPageVac(1)}}
                            >Disponibles</label>
                            <label 
                                className={`font-semibold border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoVacantes==='asignadas')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoVacantes('asignadas');setCurrentPageVac(1)}}
                            >Asignadas</label>
                        </div>

                        {/**Filtro de Region */}
                        <label className="mr-[2mm]">Region</label>
                        <div className="border-[1px]  h-[26px] rounded border-zinc-400 bg-neutral-50 desktop-xl:h-[30px] flex flex-row">
                            <select 
                                className={`x h-[24px] border-[1px] rounded focus:outline-none focus:ring-0 focus:border-none desktop-xl:text-lg
                                    ${(filtroRegionVac==="")
                                        ?` w-[6vw] `
                                        :` w-[4vw] `
                                    }
                                    `}
                                name="filtroRegion"
                                onChange={handleSelectFiltroRegion}
                                value={filtroRegionVac}
                            >
                                <option value='' selected disabled>Region...</option>
                                <option value='I'>I</option>
                                <option value='II'>II</option>
                                <option value='III'>III</option>
                                <option value='IV'>IV</option>
                                <option value='V'>V</option>
                                <option value='VI'>VI</option>
                                <option value='VII'>VII</option>
                            </select>
                            {(filtroRegionVac!="") &&
                                    <label 
                                        className="font-bold mx-2 cursor-pointer"
                                        onClick={handleCancelFiltroRegionVac}
                                    >X</label>
                                }
                        </div>

                        {/* Campo de Busqueda */}
                        <div className="desktop:w-[50%]  flex desktop:justify-end movil:w-full ">
                            <div className="desktop:w-[20vw] movil:w-[90vw] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between mx-2">
                                <input 
                                    className="desktop:w-[15vw] movil:w-[85vw] focus:outline-none rounded"
                                    placeholder="Buscar..."
                                    type="text"
                                    value={inputSearchVac}
                                    onChange={handleInputSearchVacChange}
                                />
                                <div className="flex flex-row items-center">
                                    {(inputSearchVac!='') &&
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
                    <div className=" desktop:h-[70vh] movil:h-[63vh] overflow-y-auto">
                        <table className="border-[1px] bg-slate-50 w-full">
                            <thead>
                                <tr className="sticky top-0 text-sm border-b-[2px] border-zinc-300 bg-zinc-200">
                                    <th className="border-r-[1px] border-zinc-300">ID</th>
                                    <th className="border-r-[1px] border-zinc-300">Orden</th>
                                    <th className="border-r-[1px] border-zinc-300">Establecimiento</th>
                                    <th className="border-r-[1px] border-zinc-300">Mapa</th>
                                    <th className="border-r-[1px] border-zinc-300">Cargo</th>
                                    <th className="border-r-[1px] border-zinc-300">Modalidad</th>
                                    <th className="border-r-[1px] border-zinc-300">Turno</th>
                                    <th className="border-r-[1px] border-zinc-300">Region</th>
                                    <th className="border-r-[1px] border-zinc-300">Localidad</th>
                                    <th className="border-r-[1px] border-zinc-300">Zona</th>
                                    <th className="">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    // filterListadoVacantesMov?.map((vacante, index)=>{
                                    listadoVacantesTit?.map((vacante, index)=>{
                                        const colorFila = vacante.datetime_asignacion ?`bg-red-200` :(((vacante.id_vacante_tit %2)===0) ?'bg-zinc-200' :'')
                                        return(
                                            <tr 
                                                className={`text-lg font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 ${colorFila}`}
                                                key={index}
                                            >
                                                <td className="w-[2vw] pl-[4px] font-light text-sm">{vacante.id_vacante_tit}</td>
                                                <td className="text-center">{vacante.orden}</td>
                                                {/*<td className="text-center">{vacante.nro_establecimiento} {vacante.nombre_establecimiento}</td>*/}
                                                <td className="text-center"> 
                                                    <span className="text-red-500">{vacante.nro_establecimiento}</span> - 
                                                    <span>{vacante.nombre_establecimiento}</span>
                                                </td>
                                                <td 
                                                    className="flex justify-center mt-2 text-blue-600 hover:scale-125 transition-all duration-500 cursor-pointer"
                                                >
                                                    <a href={vacante.link_map} target="_blank" rel="noopener noreferrer">
                                                        <SiGooglemaps className="" />
                                                    </a>
                                                </td>
                                                <td className="text-center">{vacante.cargo}</td>
                                                <td className="text-center">{vacante.modalidad}</td>
                                                <td className="text-center">{vacante.turno}</td>
                                                <td className="text-center w-[10vw]">{vacante.region}</td>
                                                <td className="text-center">{vacante.localidad}</td>
                                                <td className="text-center">{vacante.zona}</td>
                                                <td>
                                                    <div className="flex flex-row items-center justify-center  ">
                                                        <FaEye 
                                                            className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                            title="Ver Datos"
                                                            onClick={()=>submitVerDatosVacante(vacante)}
                                                        />
                                                        {
                                                            (vacante.datetime_asignacion===null && userSG.permiso!=4)
                                                            ?<IoTrash 
                                                                className="font-bold text-xl text-red-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                                title="Eliminar Vaante"
                                                                onClick={()=>submitEliminarVacante(vacante)}
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
                <div className="flex justify-center w-[50%] ">
                    <Paginador
                        currentpage={paginacionVac.page}
                        totalpage={paginacionVac.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={paginacionVac.totalItems}
                    />

                </div>
            </div>

            {/* MODAL VER DATOS VACANTE */}
            <ModalEdit isOpen={isOpenModalVerVacante} closeModal={closeModalVerVacante}>
                <ContentModalVerDatosVacanteTit
                    idVacante={datosVacanteSelect?.id_vacante_tit}
                    formVacante={formVacante}
                    closeModal={closeModalVerVacante}
                    handleChangeFormVacante={handleChangeFormVacante}
                    estadoForm={estadoForm}
                    datosVacante={datosVacanteSelect}
                    submitGuardarFormVacante={submitGuardarFormVacante}
                    inscriptoAsignado={datosInscriptoAsignado}
                    userSG={userSG}
                />
            </ModalEdit>

            {/* MODAL DE CONFIRMACION ELIMINA VACANTE*/}
            <ModalEdit isOpen={isOpenModalConfirm} closeModal={closeModalConfirm}>
            <div className="mt-10 w-[30vw] flex flex-col items-center">
                    <h1 className="text-xl text-center font-bold">Eliminar Vacante</h1>
                    <div className="flex flex-col justify-start">
                        <label>Observacion:</label>
                        <input 
                            className="border-[1px] border-black w-[25vw] rounded"
                            value={obsEliminaVacante}
                            onChange={handleChangeObsEliminaVacante}
                        ></input>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex justify-center mr-2">
                            <button
                                className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                                onClick={()=>{procesoEliminarVacante(); closeModalConfirm();setObsEliminaVacante("")}}
                            >ACEPTAR</button>
                        </div>
                        <div className="flex justify-center ml-2">
                            <button
                                className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                                onClick={()=>{closeModalConfirm();setObsEliminaVacante("")}}
                            >CANCELAR</button>
                        </div>
                    </div>    
                </div>
            </ModalEdit>

            {/* MODAL NUEVA VACANTE */}
            <ModalEdit isOpen={isOpenModalNuevo} closeModal={closeModalNuevo}>
                <ContentModalNuevaVacanteTit
                    formNuevaVacante={formNuevaVacante}
                    closeModalNuevaVacante={submitCloseModalNuevo}
                    handleChangeFormVacante={handleChangeFormNuevaVacante}
                    valida={validaFormNuevaVacante}
                    submitGuardarFormNuevaVacante={submitGuardarFormNuevaVacante}
                    listadoEspecialidades={listadoEspecialidades}
                />
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

export default VacantesTit;