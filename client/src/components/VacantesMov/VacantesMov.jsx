import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useModal} from '../../hooks/useModal';
import {URL} from '../../../varGlobal';

//-------ICONOS--------
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import { BiTransferAlt } from "react-icons/bi";
import { LuArrowUpDown } from "react-icons/lu";
import { IoTrash } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import { deleteVacanteMov } from "../../utils/deleteVacanteMov";
import { fetchAllVacantesMov } from "../../utils/fetchAllVacantes";
import ModalEdit from "../ModalEdit/ModalEdit";
import ContentModalVerVacante from "../ContentModalVerDatos/ContentModalVerVacante.jsx";
import Modal from "../Modal/Modal";
import axios from "axios";
import ContentModalNuevaVacante from "../ContentModalNuevaVacante/ContentModalNuevaVacante";
import Paginador from "../Paginador/Paginador.jsx";
import { fetchAllEspecialidades } from "../../utils/fetchAllEspecialidades.js";



const VacantesMov = () =>{

    const userSG = useSelector((state)=>state.user);

    //E.L. para Ventanas Modales
    const[isOpenModalVerVacante,openModalVerVacante,closeModalVerVacante]=useModal(false);
    const[isOpenModalNuevo,openModalNuevo,closeModalNuevo]=useModal(false);
    const[isOpenModal, openModal, closeModal]=useModal(false);
    const[isOpenModalConfirm, openModalConfirm, closeModalConfirm]=useModal(false);

    //E.L. para Mensaje en Modal de Notificaciones
    const[mensajeModalInfo, setMensajeModalInfo]=useState('');
    //E.L. para Mensaje en Modal de Confirmacion
    const[mensajeModalConfirm, setMensajeModalConfirm]=useState('');
    //E.L. para setear el estado de la respuesta del Modal de Confirmacion
    const[estadoModalConfirm, setEstadoModalConfirm]=useState(false);

    //E.L. para filtro de estado de las vacantes
    //puede ser: "todas", "disponibles" o "asignadas"
    const[estadoVacantes, setEstadoVacantes]=useState('todas');
    //E.L guardo el id del listado de vacantes
    const[idListVacMov,setIdListVacMov]=useState();

    //E.L. que almacena los datos de una Vacante Seleccionada
    const[datosVacanteSelect, setDatosVacanteSelect]=useState('');

    //E.L. donde se almacena el listado de Vacantes  (carga inicial)
    //y segun el tipo de listado de vacantes indicado en configuracion
    const[listadoVacantesMov, setListadoVacantesMov]=useState([]);

    //E.L para aplicar filtros sobre el listado de Vacantes
    const[filterListadoVacantesMov, setFilterListadoVacantesMov]=useState([]);

    //E.L que se usa para validar si se modifico algun dato del formulario, si es asi
    //el estado cambia a "editar" -> habilita botones GUARDAR y CANCELAR
    //si no modifica nada el estado es "ver" - habilita boton CERRAR
    const[estadoForm, setEstadoForm]=useState('ver');    

    //E.L. de id de vacante seleccionada
    const[idVacanteSelect, setIdVacanteSelect]=useState();

    //E.L. de form que se usa para actualizar los datos de la Vacante
    const[formVacante, setFormVacante]=useState({
        establecimiento:'', 
        obs_establecimiento:'', 
        cargo:'', 
        modalidad:'', 
        turno:'', 
        cupof:'',
        localidad:'', 
        departamento:'',
        region:'', 
        zona:''
    });

    //E.L. para validar si va a permitir guardar nueva vacante.
    const[validaFormNuevaVacante, setValidaFormNuevaVacante]=useState(false);

    //E.L. de form que se usa para Nueva Vacante
    const[formNuevaVacante, setFormNuevaVacante]=useState({
        establecimiento:'', 
        obs_establecimiento:'', 
        cargo:'', 
        modalidad:'', 
        turno:'', 
        cupof:'',
        localidad:'', 
        departamento:'',
        region:'', 
        zona:''
    });

    //E.L. para cuadro de busqueda
    const[inputSearch, setInputSearch]=useState('');

    //E.L. para guardar los datos del inscripto al que se asigno vacante
    const[inscriptoAsignado, setInscriptoAsignado]=useState([]);

    //E.L. para guardar datos de paginacion
    const[paginacion, setPaginacion]=useState('');

    //pagina actual
    const[currentPage, setCurrentPage]=useState(1);

    //E.L. donde se almacena el listado de especialidades
    const[listadoEspecialidades, setListadoEspecialidades]=useState([]);

    //E.L. donde guarda la especialidad seleccionada
    const[filtroEspecialidadVac, setFiltroEspecialidadVac]=useState("");

    const[obsEliminaVacante, setObsEliminaVacante]=useState("");

    const[isIntervalActive, setIsIntervalActive]=useState(true);

    const[totalVacantes, setTotalVacantes]=useState({
        disponibles:0,
        asignadas:0
    });

    //-----------PROCESOS Y FUNCIONES-----------

    const handleChangeFormVacante =(event)=>{
        const{name, value} = event.target;
        setFormVacante({
            ...formVacante,
            [name]:value
        });
        setEstadoForm('editar')
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




    const configSG = useSelector((state)=>state.config);
    const navigate=useNavigate();

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
        const idFilterListado = configFilterNivel[0]?.id_listado_vacantes_mov;
        //console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo id_listado_vacantes_mov para usarlo en nueva Vacante
        setIdListVacMov(idFilterListado);

        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE VACANTES
        await getVacantesMov(idFilterListado,currentPage,estadoVacantes,inputSearch,filtroEspecialidadVac)
    };

    //Este Proc carga el listado de VACANTES al E.L
    const getVacantesMov = async(id_listado,page,filtroAsignacion,valorBusqueda,filtroEspecialidad) =>{
        let data;
        const limit=10;
        //console.log('que trae id_listado getVacantesDisponiblesMov: ', id_listado);
        if(id_listado){
            //paso idListado, limit y page
            data = await fetchAllVacantesMov(id_listado,limit,page,filtroAsignacion,valorBusqueda,filtroEspecialidad);

            //console.log('que trae data de fetchVacantesDispMov: ', data);

            if(data.result?.length!=0){
                setListadoVacantesMov(data.result); 
                setPaginacion(data.paginacion);
                //setFilterListadoVacantesMov(data);
            }else{
                setListadoVacantesMov([]);
                setPaginacion(data.paginacion)
            }

            //LLAMO A PROC PARA CONTADOR DE VACANTES ASIGNADAS Y DISPONIBLES
            traeVacantesTotales(id_listado);
        };
    };  

    const traeVacantesTotales=async(id_listado)=>{
        let dataVacAsignadas;
        let dataVacDisponibles;
        const limit=999999;
        const page=1;
        const filtroBusqueda="";
        const filtroEspecialidad="";


        dataVacAsignadas = await fetchAllVacantesMov(id_listado,limit,page,'asignadas',filtroBusqueda,filtroEspecialidad);

        //console.log('que trae DATA ASIGNADAS de fetchVacantesDispMov: ', dataVacAsignadas);

        dataVacDisponibles = await fetchAllVacantesMov(id_listado,limit,page,'disponibles',filtroBusqueda,filtroEspecialidad);

        //console.log('que trae DATA DISPONIBLES de fetchVacantesDispMov: ', dataVacDisponibles);

        setTotalVacantes({
            asignadas:dataVacAsignadas?.paginacion.totalItems,
            disponibles:dataVacDisponibles?.paginacion.totalItems
        });

    };

    //Proceso para filtrar el listado de vacantes por todos/disponibles/asignado
    const aplicoFiltroListadoVacantes = async(data)=>{
        setInputSearch('');
        //console.log('que tiene listado: ', data);
        let dataFilter = await data.filter(item=>{
            if(estadoVacantes==='todas'){
                return(item.datetime_asignacion===null || item.datetime_asignacion!=null)
            }else if(estadoVacantes==='disponibles'){
                return(item.datetime_asignacion===null)
            }else if(estadoVacantes==='asignadas'){
                return(item.datetime_asignacion!=null)
            }
        })
        setFilterListadoVacantesMov(dataFilter);
    };

    const submitVerDatosVacante = async(datosVacante) => {
        setInscriptoAsignado([]);
        //console.log('presiono en submitVerDatosVacante');
        //console.log('que tiene datos de vacante: ', datosVacanteSelect)
        await setDatosVacanteSelect(datosVacante);
        //busco datos de inscripto asignado si datetime_asignacion no es null
        if(datosVacante.datetime_asignacion!=null){
            //console.log('Busco datos del inscripto asignado')
            try{
                await axios.post(`${URL}/api/vacanteasignadainscripto/${datosVacante.id_vacante_mov}`)
                    .then(async res=>{
                        //console.log('que trae res de vacanteasignadainscripto: ', res.data);
                        if(res.data.length!=0){
                            setInscriptoAsignado(res.data);
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

    const seteoDatosInicialesFormVacante = () =>{
        setFormVacante({
            establecimiento:datosVacanteSelect.establecimiento, 
            obs_establecimiento:datosVacanteSelect.obs_establecimiento, 
            cargo:datosVacanteSelect.cargo, 
            modalidad:datosVacanteSelect.modalidad, 
            turno:datosVacanteSelect.turno, 
            cupof:datosVacanteSelect.cupof,
            localidad:datosVacanteSelect.localidad, 
            departamento:datosVacanteSelect.departamento,
            region:datosVacanteSelect.region, 
            zona:datosVacanteSelect.zona
        });
        setIdVacanteSelect(datosVacanteSelect.id_vacante_mov);
        setEstadoForm('ver');
    };

    const submitGuardarFormVacante = async() => {
        //console.log('presiono en submitGuardarFormVacante');
        const idVacanteMov=idVacanteSelect;
        await axios.put(`${URL}/api/editvacantemov/${idVacanteMov}`,formVacante)
            .then(async res=>{
                //console.log('que trae res de editvacantemov: ', res);
                //Mostar mensaje de datos actualizados.
                setMensajeModalInfo('Datos Modificados Correctamente')
                openModal();
            })
            .catch(error=>{
                console.log('que trae error editvacantemov: ', error);
            })
    };

    const submitEliminarVacante = async(datos) => {
        setIdVacanteSelect(datos.id_vacante_mov);
        setDatosVacanteSelect(datos);
        //console.log('presiono en submitEliminarVacante');
        //console.log('que trae datos de vacante a eliminar: ', datos);

        try{
            await axios.post(`${URL}/api/vacantedeinscripto/${datos.id_vacante_mov}`)
                .then(async res=>{
                    //console.log('que trae res de vacantedeinscripto: ', res.data);
                    if(res.data.length===0){
                        setMensajeModalConfirm('¿Seguro Elimina la Vacante?');
                        openModalConfirm();
                    }else{
                        setMensajeModalInfo(`Para eliminar la Vacante generada del Movimiento de: ${res.data[0].apellido}, ${res.data[0].nombre} (DNI: ${res.data[0].dni}), dirijase a Inscriptos`);
                        openModal();
                    }
                })
        }catch(error){
            console.log(error.message)
        }

    };
    
    const procesoEliminarVacante = async() => {
        //console.log('Ingresa a procesoEliminarVacante');
        const idVacanteMov = idVacanteSelect;
        //console.log('que tiene idVacanteMov: ', idVacanteMov);
        const fechaHoraActual = traeFechaHoraActual();
        let datosBody={}
        if(obsEliminaVacante===""){
            datosBody={obsDesactiva:`Se desactiva la VACANTE por Eliminacion ${fechaHoraActual}`}
        }else{
            datosBody={obsDesactiva:`${fechaHoraActual} - ${obsEliminaVacante}`}
        }

        try{
            await axios.put(`${URL}/api/delvacantemov/${idVacanteMov}`,datosBody)
            .then(async res=>{
                //console.log('que trae res de delvacantemov: ', res);

                //Mostrar Notificacion de Eliminacion de Vacante
                setMensajeModalInfo('Vacante Eliminada');
                openModal();

            }).catch(error=>{
                console.log('que trae error delvacantemov: ', error)
            });
            
        }catch(error){
            console.error(error.message);
        }
        //Al final del Proceso de Eliminar Vacante recargo el listado de Vacantes Disponibles
        await buscoIDListadoVacantes(configSG.nivel.id_nivel);

    };

    const submitCloseModal = () => {
        closeModal();
        closeModalVerVacante();
        closeModalNuevo();

        //cambio estado de formVacante
        setEstadoForm('ver');
        //recargo listao de inscriptos con datos actualizados
        buscoIDListadoVacantes(configSG.nivel.id_nivel);
    };

    const submitNuevaVacante = () =>{
        setValidaFormNuevaVacante(false);
        setInicialFormNuevaVacante();
        openModalNuevo();
    };

    const submitCloseModalNuevo = ()=>{
        closeModalNuevo();
    };

    const setInicialFormNuevaVacante=async()=>{
        const fechaHoraActualNuevaVac = await traeFechaHoraActual();
        setFormNuevaVacante({
            id_listado_vac_mov:idListVacMov, //sale del listado de configuracion
            orden:null, //va a ser null
            id_especialidad:null, //va a ser null
            datetime_creacion:fechaHoraActualNuevaVac, //traigo hora y fecha actual
            establecimiento:'', 
            obs_establecimiento:'', 
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

    const submitGuardarFormNuevaVacante = async() => {

        //console.log('presiono en submitGuardarFormNuevaVacante');
        //console.log('como queda formNuevaVacante: ', formNuevaVacante);
        // const idVacanteMov=idVacanteSelect;
        await axios.post(`${URL}/api/vacantemov`,formNuevaVacante)
            .then(async res=>{
                //console.log('que trae res de vacantemov: ', res);
                //Mostar mensaje de datos actualizados.
                setMensajeModalInfo('Vacante Creada Correctamente')
                openModal();
            })
            .catch(error=>{
                console.log('que trae error vacantemov: ', error);
            })
    };

    //---------PROCESO BUSQUEDA DINAMICA VACANTES -----------

    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setInputSearch(value);
        setCurrentPage(1);
    };

    // const busquedaDinamica=()=>{
    //     if(inputSearch!=''){
    //         searchVacante();
    //     }else{
    //         aplicoFiltroListadoVacantes(listadoVacantesMov);
    //     }
    // };

    // const searchVacante=async()=>{
    //     const searchVac = await filterListadoVacantesMov.filter(vacante=>vacante.establecimiento.toLowerCase().includes(inputSearch.toLocaleLowerCase()) || vacante.cargo.toLowerCase().includes(inputSearch.toLowerCase()) || vacante.modalidad.toLowerCase().includes(inputSearch.toLowerCase()) || vacante.turno.toLowerCase().includes(inputSearch) || vacante.region.toLowerCase().includes(inputSearch) || vacante.localidad.toLowerCase().includes(inputSearch));
    //     setFilterListadoVacantesMov(searchVac);
    // };

    const handleCancelSearch =()=>{
        setInputSearch('');
        //aplicoFiltroListadoVacantes(listadoVacantesMov);
    };


    //---------------------


    const handlePageChange = (nuevaPagina)=>{
        if(nuevaPagina>0 && nuevaPagina<=paginacion?.totalPages){
            setCurrentPage(nuevaPagina);
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

    const handleSelectFiltroEspecialidad=(event)=>{
        const{value} = event.target;
        console.log('que tiene filtroEspecialidad: ', value);
        setFiltroEspecialidadVac(value);
        
        setCurrentPage(1);
        //al seleccionar una especialidad, regrso a la primer pagina, por si no hay tantos inscriptos
        
    };

    const handleCancelFiltroEspecialidadVac =()=>{
        setFiltroEspecialidadVac("");
    };

    const handleChangeObsEliminaVacante = (event) =>{
        const {name, value}=event.target;
        setObsEliminaVacante(value);
    };

    useEffect(()=>{
        //console.log('que tiene CONTADOR: ',totalVacantes);
    },[totalVacantes])

    useEffect(()=>{
        //console.log('que tiene leyenda para eliminar vacante: ', obsEliminaVacante);
    },[obsEliminaVacante])

    useEffect(()=>{
        //console.log('que tiene inscriptoAsignado: ', inscriptoAsignado);
    },[inscriptoAsignado])

    // useEffect(()=>{
    //     busquedaDinamica();
    // },[inputSearch]);

    useEffect(()=>{
        if(formNuevaVacante.establecimiento!='' && formNuevaVacante.cargo!='' ){
            setValidaFormNuevaVacante(true);
        }else{
            setValidaFormNuevaVacante(false);
        }
    },[formNuevaVacante])

    useEffect(()=>{
        //console.log('como actualiza formVacante: ', formVacante);
    },[formVacante])

    //cada vez que aplco filtro, 
    useEffect(()=>{
        //console.log('APLICO FILTRO');
        //console.log('que tiene estado local estadoVacantes: ', estadoVacantes);
        //aplicoFiltroListadoVacantes(listadoVacantesMov);
        getVacantesMov(idListVacMov,currentPage,estadoVacantes,inputSearch,filtroEspecialidadVac)
    },[estadoVacantes,currentPage,inputSearch,filtroEspecialidadVac])

    useEffect(()=>{
        if (!isIntervalActive) return;

        const intervalId = setInterval(()=>{
            getVacantesMov(idListVacMov,currentPage,estadoVacantes,inputSearch,filtroEspecialidadVac)
        }, 10000);

        return()=>clearInterval(intervalId);

    },[isIntervalActive,idListVacMov,estadoVacantes,currentPage,inputSearch,filtroEspecialidadVac])

    useEffect(()=>{
        seteoDatosInicialesFormVacante()
    },[datosVacanteSelect])

    //VEO CONFIGURACION GLOBAL
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //console.log('que tiene configSG en VacantesMov (CARGA INICIAL): ', configSG);
    },[configSG]);

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
                <div className="desktop:w-[60vw] flex desktop:flex-col desktop:justify-center desktop:items-start  movil:flex-row movil:w-full movil:items-center movil:justify-center">
                    <label className="ml-4 text-base font-semibold">NIVEL {configSG.nivel.descripcion}</label>
                    <div className="flex flex-col">
                        <div className="flex flex-row mb-2">
                            <label className="ml-4 text-lg font-sans font-bold">VACANTES</label>
                            {(userSG.permiso!=3 && userSG.permiso!=4) &&
                                <button 
                                    className="ml-2 px-[2px] border-[1px] border-[#73685F] rounded hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] shadow"
                                    onClick={submitNuevaVacante}
                                >Nueva Vacante</button>
                            }
                        </div>
                        {/* SECCION FILTRO ESPECIALIDAD */}
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
                        </div>
                    </div>
                </div>


                {/* SECCION DATOS USUARIO */}
                <div className="movil:hidden w-[25vw] desktop:flex items-center justify-end">
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
                                onClick={()=>setEstadoVacantes('todas')}
                            >Todas</label>
                            <label 
                                className={`font-semibold border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoVacantes==='disponibles')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoVacantes('disponibles');setCurrentPage(1)}}
                            >Disponibles</label>
                            <label 
                                className={`font-semibold border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoVacantes==='asignadas')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoVacantes('asignadas');setCurrentPage(1)}}
                            >Asignadas</label>
                        </div>

                        {/* CAMPO DE FILTRO */}


                        {/* Campo de Busqueda */}
                        <div className="desktop:w-[50%]  flex desktop:justify-end movil:w-full ">
                            <div className="desktop:w-[20vw] movil:w-[90vw] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between mx-2">
                                <input 
                                    className="desktop:w-[15vw] movil:w-[85vw] focus:outline-none rounded"
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
                    <div className=" desktop:h-[70vh] movil:h-[63vh] overflow-y-auto">
                        <table className="border-[1px] bg-slate-50 w-full">
                            <thead>
                                <tr className="sticky top-0 text-sm border-b-[2px] border-zinc-300 bg-zinc-200">
                                    <th className="border-r-[1px] border-zinc-300">ID</th>
                                    <th className="border-r-[1px] border-zinc-300">Orden</th>
                                    <th className="border-r-[1px] border-zinc-300">Establecimiento</th>
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
                                    listadoVacantesMov?.map((vacante, index)=>{
                                        const colorFila = vacante.datetime_asignacion ?`bg-red-200` :(((vacante.id_vacante_mov %2)===0) ?'bg-zinc-200' :'')
                                        return(
                                            <tr 
                                                className={`text-lg font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 ${colorFila}`}
                                                key={index}
                                            >
                                                <td className="w-[2vw] pl-[4px] font-light text-sm">{vacante.id_vacante_mov}</td>
                                                <td className="text-center">{vacante.orden}</td>
                                                <td className="text-center">{vacante.establecimiento} {vacante.obs_establecimiento}</td>
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
                                                            (vacante.datetime_asignacion===null && (userSG.permiso!=3 && userSG.permiso!=4))
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
                        currentpage={paginacion.page}
                        totalpage={paginacion.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={paginacion.totalItems}
                    />

                </div>
            </div>

            {/* MODAL VER DATOS */}
            <ModalEdit isOpen={isOpenModalVerVacante} closeModal={closeModalVerVacante}>
                <ContentModalVerVacante
                    idVacante={idVacanteSelect}
                    formVacante={formVacante}
                    closeModal={closeModalVerVacante}
                    handleChangeFormVacante={handleChangeFormVacante}
                    estadoForm={estadoForm}
                    datosVacante={datosVacanteSelect}
                    submitGuardarFormVacante={submitGuardarFormVacante}
                    inscriptoAsignado={inscriptoAsignado}
                    userSG = {userSG}
                />
                
            </ModalEdit>

            {/* MODAL NUEVA VACANTE */}
            <ModalEdit isOpen={isOpenModalNuevo} closeModal={closeModalNuevo}>
                <ContentModalNuevaVacante
                    formNuevaVacante={formNuevaVacante}
                    closeModalNuevaVacante={submitCloseModalNuevo}
                    handleChangeFormVacante={handleChangeFormNuevaVacante}
                    valida={validaFormNuevaVacante}
                    submitGuardarFormNuevaVacante={submitGuardarFormNuevaVacante}
                    listadoEspecialidades={listadoEspecialidades}
                />
            </ModalEdit>

            {/* MODAL DE CONFIRMACION ELIMINA VACANTE*/}
            <ModalEdit isOpen={isOpenModalConfirm} closeModal={closeModalConfirm}>
            <div className="mt-2 w-[30vw] flex flex-col items-center">
                    {/* <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1> */}
                    <h1 className="text-xl text-center font-bold mb-4">Eliminar la Vacante</h1>
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

export default VacantesMov;