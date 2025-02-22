import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInscriptosMov } from "../../utils/fetchAllInscriptosMov";
import { useNavigate } from "react-router-dom";
import {useModal} from '../../hooks/useModal';
import ModalEdit from "../ModalEdit/ModalEdit";
import Modal from '../Modal/Modal';
import axios from "axios";
import {URL} from '../../../varGlobal';
import { fetchVacantesDispMov } from "../../utils/fetchVacanteDispMov";
import { TbSortAscending , TbSortDescending } from "react-icons/tb";
import { fetchVacantesAsignadaMov } from "../../utils/fetchVacanteAsignadaMov";
import { fetchAsignacionByVacante } from "../../utils/fetchAsignacionByVacante";
import { updateIdVacanteGenerada } from "../../utils/updateIdVacanteGenerada";
import './InscriptosMov.modules.css';

import { useReactToPrint } from 'react-to-print';

//-------ICONOS--------
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import { BiTransferAlt } from "react-icons/bi";
import { LuArrowUpDown } from "react-icons/lu";
import { IoTrash } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import { deleteVacanteMov } from "../../utils/deleteVacanteMov";
import { MdOutlineDoubleArrow } from "react-icons/md";
import Paginador from "../Paginador/Paginador";
import PaginaDesignacion from "../PaginaDesignacion/PaginaDesignacion";
import { outUser } from "../../redux/userSlice";
import { IoMdPrint } from "react-icons/io";
import { fetchAllEspecialidades } from "../../utils/fetchAllEspecialidades";
import { fetchAllVacantesMov } from "../../utils/fetchAllVacantes";
import { validaDniAsignadoListado } from "../../utils/validaDniAsignadoListado";
import { IoMdMore } from "react-icons/io";
import { updateEstadoAsignadoInscripto } from "../../utils/updateEstadoAsignadoInscripto";
import PaginaAsistencia from "../PaginaAsistencia/PaginaAsistencia";
import { validaLegajoAsignadoListado } from "../../utils/validateLegajoAsignadoListado";



const InscriptosMov = ()=>{

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //E.G que trae la configuracion de sistema
    const configSG = useSelector((state)=>state.config);
    const userSG = useSelector((state)=>state.user);
    const nivelSG = useSelector((state)=>state.config.nivel);

    const isIntervalActive = useSelector((state)=>state.interval.isIntervalActive); 

    //E.L. de Ventanas Modales
    const[isOpenModalConfirm,openModalConfirm,closeModalConfirm]=useModal(false);
    const[isOpenModalAsign,openModalAsign,closeModalAsign]=useModal(false);
    const[isOpenModalVac,openModalVac,closeModalVac]=useModal(false);
    const[isOpenModalEdit,openModalEdit,closeModalEdit]=useModal(false);
    const[isOpenModalDatos,openModalDatos,closeModalDatos]=useModal(false);
    const[isOpenModal,openModal,closeModal]=useModal(false);
    const[mensajeModalInfo, setMensajeModalInfo]=useState('');
    const[mensajeModalConfirm, setMensajeModalConfirm]=useState('');
    const[mensajeModalDatos, setMensajeModalDatos]=useState('');
    
    //E.L. para filtrar los listados, que se determinan por
    // disponibilidad -> 1  / activos -> 2
    const[tipoInscripto, setTipoInscripto]=useState(2);

    //E.L. donde se almacena el Listado de Inscriptos (carga inicial)
    //y segun el tipo de listado segun configuracion
    const[listadoInscriptosMov, setListadoInscriptosMov]=useState([]);

    //guarda el id del listado de inscriptos
    const[idListadoInscriptosMov, setIdListadoInscriptosMov]=useState('');
    const[idListadoInscriptosMovCompara, setIdListadoInscriptosMovCompara]=useState('');

    //E.L. para aplicar filtros sobre el listado de inscriptos
    const[filterListadoInscriptosMov, setFilterListadoInscriptosMov]=useState([]);

    //E.L. donde se almacena el listado de Vacantes Disponibles (carga inicial)
    //y segun el tipo de listado de vacantes indicado en configuracion
    const[listadoVacantesDispMov, setListadoVacantesDispMov]=useState([]);

    //E.L para aplicar filtros sobre el listado de Vacantes Disponibles
    const[filterListadoVacantesDispMov, setFilterListadoVacantesDispMov]=useState([]);

    //E.L. que almacena los datos de una Vacante Seleccionada
    const[datosVacanteSelect, setDatosVacanteSelect]=useState('');

    //E.L. que almacena los datos de un inscripto seleccionado
    const[datosInscriptoSelect, setDatosInscriptoSelect]=useState('');

    //E.L. de form que se usa para actualizar los datos del inscripto
    const[formInscripto, setFormInscripto]=useState({
        cargo_actual:'', 
        turno_actual:'',
        cargo_solicitado:'', 
        dni:'', 
        apellido:'', 
        nombre:'', 
        observacion:'', 
        total:'', 
        orden:'', 
        nro_escuela:'', 
        legajo:'', 
        id_especialidad:'', 
        id_tipo_inscripto:'', 
        id_listado_inscriptos:''
    });

    //E.L que se usa para validar si se modifico algun dato del formulario, si es asi
    //el estado cambia a "editar" -> habilita botones GUARDAR y CANCELAR
    //si no modifica nada el estado es "ver" - habilita boton CERRAR
    const[estadoForm, setEstadoForm]=useState('ver');

    //E.L. para input busqueda
    const[inputSearch, setInputSearch]=useState('');
    
    //E.L. para input busqueda en Vacantes Disponibles
    const[inputSearchVac, setInputSearchVac]=useState('');

    //E.L. para filtro de estado de los incriptos
    //puede ser: "todos", "sinasignar" o "asignados"
    const[estadoInscripto, setEstadoInscripto]=useState('todos');

    //E.L para guardar el campo que va a ordenar Vacantes
    const[campoOrderVac, setCampoOrderVac] = useState('');

    //E.L switch para guardar el tipo de Ordenamiento de los datos
    const[order, setOrder]=useState(true);

    //E.L guardo el id del listado de vacantes
    const[idListVacMov,setIdListVacMov]=useState();

    //E.L guardo el cargo(vacante) asignada al Inscripto seleccionado
    const[cargoAsignado, setCargoAsignado]=useState('');

    //E.L guardo datos de asignacion y docente que tomo cargo_original de otro docente
    const[asignacionCargoOriginal, setAsignacionCargoOriginal]=useState('');

    //E.L. para guardar datos de paginacion
    const[paginacion, setPaginacion]=useState('');

    //pagina actual
    const[currentPage, setCurrentPage]=useState(1);

    const componentRef = useRef(null);

    const componentRefAsistencia = useRef(null);

    //E.L. donde se almacena el listado de especialidades
    const[listadoEspecialidades, setListadoEspecialidades]=useState([]);

    //E.L. donde se almacena el listado de especialidades de LUOM
    const[listadoEspecialidadesLuom, setListadoEspecialidadesLuom]=useState([]);

    //E.L. donde guarda la especialidad seleccionada
    const[filtroEspecialidadVac, setFiltroEspecialidadVac]=useState("");

    //E.L. donde guarda la especialidad seleccionada del LUOM
    const[filtroEspecialidadLuom, setFiltroEspecialidadLuom]=useState("");

    //E.L. guarda la pagina actual de listado Vacantes
    const[currentPageVac, setCurrentPageVac]=useState(1);
    //E.L. para guardar datos de paginacion de listado Vacantes
    const[paginacionVac, setPaginacionVac]=useState('');

    //E.L. guarda el campo Order
    const[orderBy, setOrderBy]=useState('');
    //E.L. guarda el tipo de orden
    const[typeOrder, setTypeOrder]=useState('');

    const[totalVacantes, setTotalVacantes]=useState({
        disponibles:0,
        asignadas:0
    });

    const[datosValidaDni, setDatosValidaDni]=useState([]);

    const[estadoAsignadoInscripto, setEstadoAsignadoInscripto]=useState('');

    const[cantLegajoDni, setCantLegajoDni]=useState(0);

    const[isSubmitting, setIsSubmitting] = useState(false);

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
        //LISTADO DE INSCRIPTOS DE MOVIMIENTOS -> id_listado_inscriptos_mov
        const idFilterListado = configFilterNivel[0]?.id_listado_inscriptos_mov;
        //console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo el id del listado de inscriptos
        setIdListadoInscriptosMov(idFilterListado);

        //Traigo el id del listado con cual comparar inscriptos
        const idFilterListadoCompara = configFilterNivel[0]?.id_listado_inscriptos_mov_compara;
        //console.log('que tiene ID LISTADO COMPARA: ', idFilterListadoCompara);
        //Guardo id del Listado que compara
        setIdListadoInscriptosMovCompara(idFilterListadoCompara)


        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO
        await getInscriptosMov(idFilterListado,currentPage,tipoInscripto,estadoInscripto,inputSearch,idFilterListadoCompara,filtroEspecialidadLuom);
    };

    //Este Proc carga el listado de inscriptos_mov al E.L
    const getInscriptosMov = async(id_listado,page,idTipoInscripto,filtroAsignacion,valorBusqueda,idListadoCompara,especialidadLuom) =>{
        let data;
        const limit=10;
        //console.log('que trae id_listado getInscriptosMovListado: ', id_listado);
        if(id_listado){
            //paso id_listado, limit y page
            data = await fetchAllInscriptosMov(id_listado, limit, page,idTipoInscripto,filtroAsignacion, valorBusqueda, idListadoCompara,especialidadLuom);
            //console.log('que trae data de fetchAllInscriptosMov: ', data);

            if(data.result?.length!=0){
                setListadoInscriptosMov(data.result); 
                setPaginacion(data.paginacion);
            }else{
                setListadoInscriptosMov([]);
                setPaginacion(data.paginacion);
            };

            //LLAMO A PROC PARA CONTADOR DE VACANTES ASIGNADAS Y DISPONIBLES
            //traeVacantesTotales(id_listado);
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

        console.log('que trae DATA ASIGNADAS de fetchVacantesDispMov: ', dataVacAsignadas);

        dataVacDisponibles = await fetchAllVacantesMov(id_listado,limit,page,'disponibles',filtroBusqueda,filtroEspecialidad);

        console.log('que trae DATA DISPONIBLES de fetchVacantesDispMov: ', dataVacDisponibles);

        setTotalVacantes({
            asignadas:dataVacAsignadas?.paginacion.totalItems,
            disponibles:dataVacDisponibles?.paginacion.totalItems
        });

    };

    //Proc: traigo el ID del listado de Vacantes configurado
    const buscoIDListadoVacantes = async(id_nivel) =>{
        //Filtro configuracion para el nivel
        const configFilterNivel = await configSG.config.filter((configNivel)=>configNivel.id_nivel==id_nivel);
        //console.log('que trae configFilterNivel: ', configFilterNivel);

        //Traigo el id del listado cargado en configuracion para:
        //LISTADO DE VACANTES DE MOVIMIENTOS -> id_listado_vacantes_mov
        const idFilterListado = configFilterNivel[0]?.id_listado_vacantes_mov;
        //console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo id_listado_vacantes_mov para usarlo en Movimientos Rulos
        setIdListVacMov(idFilterListado);

        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE VACANTES
        await getVacantesDisponiblesMov(idFilterListado,currentPageVac,inputSearchVac,filtroEspecialidadVac,orderBy,typeOrder)
    };

    //Este Proc carga el listado de VACANTES Disponibles al E.L
    const getVacantesDisponiblesMov = async(id_listado,page,valorBusqueda,filtroEspecialidad,orderBy, typeOrder) =>{
        let data;
        const limit=10;
        //console.log('que trae id_listado getVacantesDisponiblesMov: ', id_listado);
        if(id_listado){
            data = await fetchVacantesDispMov(id_listado,limit,page,valorBusqueda,filtroEspecialidad,orderBy, typeOrder);
            //console.log('que trae data de fetchVacantesDispMov: ', data);

            if(data.result?.length!=0){
                setListadoVacantesDispMov(data.result); 
                //setFilterListadoVacantesDispMov(data);
                setPaginacionVac(data.paginacion);
            }else{
                setListadoVacantesDispMov([]);
                setPaginacionVac(data.paginacion);
            };
        };
    };  


    //Proc al presionar icono "Ver Datos", setea en E.L los datos del inscripto
    const submitVerDatosInscripto = async(datos) =>{
        //console.log('que recibe datos inscripto: ', datos);
        setDatosInscriptoSelect(datos);

        //seteo el estadoAsignadoInscripto
        //console.log('QUE TIENE datos.id_estado_inscripto: ', datos.id_estado_inscripto);
        if(datos.id_estado_inscripto!=null){
            setEstadoAsignadoInscripto(datos.id_estado_inscripto);
        }else{
            setEstadoAsignadoInscripto('');
        }


        //traigo los datos del cargo (vacante) asignado
        if (datos.vacante_asignada!=null && datos.vacante_asignada!=''){
            //console.log('TIENE CARGO ASIGNADO');
            const data = await fetchVacantesAsignadaMov(datos.vacante_asignada);
            //console.log('que trae data de fetchVacantesAsignadaMov: ', data[0]);
            setCargoAsignado(data[0]);
            setDatosVacanteSelect(data[0]);
        }else{
            setCargoAsignado('');
        }

        //Traigo los datos de asignacion de su cargo original y docente quien lo tomo
        
        const datosAsignacion = await fetchAsignacionByVacante(datos.id_vacante_generada_cargo_actual);
        //console.log('que tra datosAsignacion de vacante generada: ', datosAsignacion);
        setAsignacionCargoOriginal(datosAsignacion);

        openModalEdit();
    };

    //Proc que se ejecuta al realizar alguna modificacion en los inputs de los 
    //datos del inscripto, cambiando el estado del form a "editar"
    const handleChange = (event) => {
        const{name, value} = event.target;
        if(name==='turno_actual'){
            setFormInscripto({
                ...formInscripto,
                [name]:value.toUpperCase()
            });
        }else{

            setFormInscripto({
                ...formInscripto,
                [name]:value
            });
        }
        setEstadoForm('editar');
    };

    //Proc q carga en E.L. datos de inscripto seleccionado
    const valoresInicialesFormInscripto = ()=>{
        setFormInscripto({
            cargo_actual:datosInscriptoSelect.cargo_actual, 
            turno_actual:(datosInscriptoSelect.turno_actual===null) ?`` :datosInscriptoSelect.turno_actual, 
            cargo_solicitado:datosInscriptoSelect.cargo_solicitado, 
            dni:datosInscriptoSelect.dni, 
            apellido:datosInscriptoSelect.apellido, 
            nombre:datosInscriptoSelect.nombre, 
            observacion:datosInscriptoSelect.observacion, 
            total:datosInscriptoSelect.total, 
            orden:datosInscriptoSelect.orden, 
            nro_escuela:datosInscriptoSelect.nro_escuela, 
            legajo:datosInscriptoSelect.legajo, 
            id_especialidad:datosInscriptoSelect.id_especialidad, 
            id_tipo_inscripto:datosInscriptoSelect.id_tipo_inscripto, 
            id_listado_inscriptos:datosInscriptoSelect.id_listado_inscriptos
        });
        setEstadoForm('ver');
    };

    //Proc al guardar cambios en los datos del inscripto
    const submitGuardarCambiosFormInscripto = async() =>{
        const idInscripto = datosInscriptoSelect.id_inscriptos_mov;
        //console.log(' que tiene idInscripto: ', idInscripto);
        await axios.put(`${URL}/api/editinscriptosmov/${idInscripto}`,formInscripto)
            .then(async res=>{
                //console.log('que trae res de editinscriptosmov: ', res);
                //MOSTRAR MENSAJE DE DATOS ACTUALIZADOS
                setMensajeModalInfo('Datos Modificados Correctamente')
                openModal();
            })
            .catch(error=>{
                console.log('que trae error editinscriptosmov: ', error)
            });
    };

    //Proc al cerrar Ventana Modal de Notificacion llamado desde
    //Ventana Modal de Datos de Inscripto
    const submitCloseModal = ()=>{
        //Cierro Modal Notificacion
        closeModal();
        //Cierro Modal de Asignacion
        closeModalAsign();
        //Cierro Modal de Vacantes Disponibles
        closeModalVac();
        //Cambio estado de form inscripto
        setEstadoForm('ver');
        //Vacio estado de Inscripto Seleccionado
        setDatosInscriptoSelect('');
        //Vacio estado de Vacante Seleccionada
        setDatosVacanteSelect('');
        //Cargo de nuevo listado de inscriptos con datos actualizados,
        //aplico los filtros y traigo dato si fue asignado o no
        //recargaListadoInscriptos();
        getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,inputSearch,idListadoInscriptosMovCompara,filtroEspecialidadLuom);
    };

    
    //Proc: realiza recarga de listado de inscriptos, por alguna modificacion
    //tambien aplica los filtros seteados en los estados
    const recargaListadoInscriptos = async() =>{
        try{
            //LLAMO A PROCECIMIENTO PARA BUSCAR ID_LISTADO Y EL MISMO TRAE
            //DATOS DE INCRIPTOS Y CARGA EN ESTADO LOCAL
            await buscoIdlistadoInscrip(configSG.nivel.id_nivel);
    
            //APLICO LOS FILTROS
            aplicoFiltrosListado(listadoInscriptosMov);

        }catch(error){
            console.error('Error al recargar el listado de inscriptos: ', error);
        }
    };


    //Proc: se ejecuta al aplicar algun filtro
    const aplicoFiltrosListado = async(data) =>{
        //Borro campos Input Busqueda, ya que primero se aplica filtro y luego busqueda
        setInputSearch('');

        let dataFilter = await data.filter(item=>{
            if(tipoInscripto===1){
                if(estadoInscripto==='asignados'){
                    return(
                        (!tipoInscripto || item.id_tipo_inscripto===1) &&
                        (!estadoInscripto || item.vacante_asignada!=null)
                    );
                }else if(estadoInscripto==='sinasignar'){
                    return(
                        (!tipoInscripto || item.id_tipo_inscripto===1) &&
                        (!estadoInscripto || item.vacante_asignada===null)
                    );
                }else if(estadoInscripto==='todos'){
                    return(
                        (!tipoInscripto || item.id_tipo_inscripto===1)
                    );
                }
            }else{
                if(estadoInscripto==='asignados'){
                    return(
                        (!tipoInscripto || item.id_tipo_inscripto!=1) &&
                        (!estadoInscripto || item.vacante_asignada!=null)
                    );
                }else if(estadoInscripto==='sinasignar'){
                    return(
                        (!tipoInscripto || item.id_tipo_inscripto!=1) &&
                        (!estadoInscripto || item.vacante_asignada===null)
                    );
                }else if(estadoInscripto==='todos'){
                    return(
                        (!tipoInscripto || item.id_tipo_inscripto!=1)
                    );
                }
            };
        });

        setFilterListadoInscriptosMov(dataFilter)
    };


    //Proc: se ejecuta en Carga Inicial, inicia filtrando inscriptos "Activos" = 1
    const filtroInicialListado = () =>{
        const listadoFiltrado = listadoInscriptosMov.filter((inscriptos)=>inscriptos.id_tipo_inscripto===1);

        setFilterListadoInscriptosMov(listadoFiltrado);
    };

    //-----------PROCESOS DE BUSQUEDA EN LISTADO INSCRIPTOS------------
    //Escribir dentro del input de busqueda
    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setCurrentPage(1);
        setInputSearch(value);
    };

    //Presiono boton Cancelar (X) dentro de input busqueda
    const handleCancelSearch=async()=>{
        //seteoFiltrosBusquedaInicio();
        setInputSearch('')
        setCurrentPage(1);
        //setDocRecFilter(docrecSG);
        //aplicoFiltrosListado(listadoInscriptosMov);
        //await getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,'');
    };
    
    //Proc: ejecuta la busqueda, filtrando datos de input busqueda en los campos
    //del listado de inscriptos filtrado
    const submitSearch = async()=>{
        //console.log('presiono buscar con este input: ', inputSearch);
        const valorBusqueda = inputSearch;
        // let searchDoc;
        // searchDoc = await filterListadoInscriptosMov.filter(inscripto=>inscripto.nombre.toLowerCase().includes(inputSearch.toLowerCase()) || inscripto.apellido.toLowerCase().includes(inputSearch.toLowerCase()) || inscripto.nro_escuela.toLowerCase().includes(inputSearch.toLowerCase()) || inscripto.dni.includes(inputSearch));
        // setFilterListadoInscriptosMov(searchDoc);
        //await getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,valorBusqueda);
    };    
    //-------------------------------------------------------------------

    //-----------PROCESOS DE BUSQUEDA EN VACANTES DISPONIBLES------------
    //Escribir dentro del input de busqueda
    const handleInputSearchVacChange = (event) =>{
        const {value} = event.target;
        setInputSearchVac(value);
        setCampoOrderVac('');
        setCurrentPageVac(1);
    };

    const busquedaDinamica=()=>{
        if(inputSearchVac!=''){
            submitSearchVac();
        }else{
            setFilterListadoVacantesDispMov(listadoVacantesDispMov);
        }
    };

    //Presiono boton Cancelar (X) dentro de input busqueda
    const handleCancelSearchVac = async()=>{
        setInputSearchVac('')
        setCurrentPageVac(1);
        //setFilterListadoVacantesDispMov(listadoVacantesDispMov);
        //setFiltroEspecialidadVac("");
        //setDocRecFilter(docrecSG);
        //aplicoFiltrosListado(listadoInscriptosMov);
    };
    
    //Proc: ejecuta la busqueda, filtrando datos de input busqueda en los campos
    //del listado de Vacantes Disponibles
    const submitSearchVac = async()=>{
        //console.log('presiono buscar con este input: ', inputSearch);
        let searchVac;
        searchVac = await filterListadoVacantesDispMov.filter(vacante=>vacante.establecimiento.toLowerCase().includes(inputSearchVac.toLowerCase()) || vacante.cargo.toLowerCase().includes(inputSearchVac.toLowerCase()) || vacante.modalidad.toLowerCase().includes(inputSearchVac.toLowerCase()) || vacante.turno.toLowerCase().includes(inputSearchVac) || vacante.region.toLowerCase().includes(inputSearchVac) || vacante.localidad.toLowerCase().includes(inputSearchVac));
        setFilterListadoVacantesDispMov(searchVac);
    };    
    //-------------------------------------------------------------------    

    //-------------- PROCESOS DE ORDENAMIENTO --------------------
    const submitOrderVac = (campo_order)=>{
        //seteo vacio campo busqueda
        setInputSearchVac('')
        setCampoOrderVac(campo_order);
        if(campo_order==='establecimiento'){
            if(order){
                setOrderBy('establecimiento');
                setTypeOrder('DESC');
                setCurrentPageVac(1);
            }else{

                setOrderBy('establecimiento');
                setTypeOrder('ASC');
                setCurrentPageVac(1);
            }
        }else if(campo_order==='localidad'){
            if(order){

                setOrderBy('localidad');
                setTypeOrder('DESC');
                setCurrentPageVac(1);
            }else{

                setOrderBy('localidad');
                setTypeOrder('ASC');
                setCurrentPageVac(1);
            }

        }else if(campo_order==='zona'){
            if(order){
                //ordenar Descencente
                // const sortVac = [...filterListadoVacantesDispMov].sort((a,b)=>{
                //     return a.zona>b.zona ?1 :-1;
                // });
                // setFilterListadoVacantesDispMov(sortVac);
            }else{
                //Ordernar Ascendente
                // const sortVac = [...filterListadoVacantesDispMov].sort((a,b)=>{
                //     return a.zona<b.zona ?1 :-1;
                // });
                // setFilterListadoVacantesDispMov(sortVac);
            }
        }
    };

    //------------ PROCESO DE FILTRO POR ESPECIALIDAD -----------------
    const filterEspecialidad =async(idEspecialidad)=>{
        setInputSearchVac("")
        //console.log('que ingresa a idEspecialidad: ', idEspecialidad);
        //console.log('que tiene listado a filtrar: ', filterListadoVacantesDispMov);
        if(idEspecialidad===""){
            setFilterListadoVacantesDispMov(listadoVacantesDispMov);
        }else{
            const filterListadoVacantes = await listadoVacantesDispMov.filter(vac=>vac.id_especialidad==idEspecialidad);
            //console.log('como filtra listado: ', filterListadoVacantes);
            setFilterListadoVacantesDispMov(filterListadoVacantes);
        }
    };


    //Proc: Al presionar sobre icono Ver Vacantes Disponibles
    const submitVerVacantes = async(datos) =>{
        //VALIDACION DNI YA TOMO CARGO
        // const datosValidate = await validaDniAsignadoListado(idListadoInscriptosMov,datos.dni);
        // console.log('que trae validaDniAsignadoListado: ', datosValidate);

        //VALIDA CANTIDAD DE LEGAJOS QUE TIENE EL DNI PARA VALIDAR TURNO
        validacantidadlegajo(datos.dni);

        //VALIDACION LEGAJO YA TOMO CARGO
        const datosValidate = await validaLegajoAsignadoListado(idListadoInscriptosMov, datos.legajo);
        //console.log('que trae validaLegajoAsignadoListado: ', datosValidate);
        //seteo el estadoAsignadoInscripto
        //console.log('QUE TIENE datos.id_estado_inscripto: ', datos.id_estado_inscripto);
        setEstadoAsignadoInscripto(datos.id_estado_inscripto);


        if(datosValidate.length!=0){
            setDatosValidaDni(datosValidate[0]);
            //console.log('Inscripto ya tomo cargo');
            setMensajeModalDatos(`El Docente ${datosValidate[0].apellido}, ${datosValidate[0].nombre} con DNI(${datosValidate[0].dni}) ya tomo el siguiente cargo:`);
            openModalDatos();
        }else{
            //vacion input busqueda
            setInputSearchVac('')
            //console.log('que recibe datos inscripto al Ver Vacantes: ', datos);
            setDatosInscriptoSelect(datos);
            //cargo listado original de vacantes disponibles
            setFilterListadoVacantesDispMov(listadoVacantesDispMov);
            openModalVac();
        }
    };

    //Proc prsiona sobre icono asignar en Vacantes disponibles
    const submitAsignar = (vacante)=>{
        //console.log('datos recibidos de Vacante: ', vacante);
        setDatosVacanteSelect(vacante);
        openModalAsign();
    };

    //?---------------------------------------------------------------
    //?  -  -  -  PROCESO DE ASIGNACION
    //?---------------------------------------------------------------
    const submitAsignarVacante = async() => {
        //Deshabilito boton para no ejecutar muchas veces.
        setIsSubmitting(true);
        
        if(datosInscriptoSelect.id_vacante_generada_cargo_actual === datosVacanteSelect.id_vacante_mov){
            setMensajeModalInfo('No puede seleccionar la misma vacante de su cargo original, seleccione otra vacante');
            openModal();
        }else{

            //console.log('Asignacion Simple');
    
            const fechaHoraActual = await traeFechaHoraActual();
            const formAsignacion={
                id_vacante_mov:datosVacanteSelect.id_vacante_mov, 
                id_inscripto_mov:datosInscriptoSelect.id_inscriptos_mov, 
                datetime_asignacion:fechaHoraActual, 
                id_estado_asignacion:1 //estado Asignada
            }
            //console.log('como arma form para Asignacion: ', formAsignacion);

            //?REALIZO ASIGNACION
            await axios.post(`${URL}/api/createasignacionmov`,formAsignacion)
                .then(async res=>{
                    //Antes de continuar Actualizo el ESTADO DEL INSCRIPTO A: 1-"Asignado"
                    await updateEstadoAsignadoInscripto(datosInscriptoSelect.id_inscriptos_mov, 1);

                    //console.log('que trae res de createasignacionmov: ', res);
                    //?Verifico que tipo de Asignacion es para mensajes u otra validacion
                    if(datosInscriptoSelect.id_tipo_inscripto===1){
                        //?INSCRIPTO EN DISPONIBILIDAD -> Solo Asigna Vacante a Inscripto
                        //Mostrar Notificacion de Movimiento realizado
                        //setMensajeModalInfo('Movimiento Asignado Correctamente')
                        //openModal();
                        setMensajeModalConfirm('Movimiento Asignado Correctamente, ¿Imprime Designacion?');
                        openModalConfirm();
                    }else{
                        //?INSCRIPTO ACTIVO -> Una vez asignada vacante, deebe Generar Nueva Vacante del cargo que deja el inscripto
                        //?SOLO CREA NUEVA VACANTE SI NO ESTA GENERADA -> id_vacante_generada_cargo_actual IS NULL
                        if(datosInscriptoSelect.id_vacante_generada_cargo_actual===null){

                            //!VERIFICA SI SU CARGO GENENERA O NO VACANTE
                            if(datosInscriptoSelect.genera_vacante==='NO'){
                                setMensajeModalConfirm('Movimiento Asignado Correctamente, ¿Imprime Designacion?');
                                openModalConfirm();
                            }else{

                                creaNuevaVacante();
                            };

                        }else{
                            // setMensajeModalInfo('Movimiento Asignado Correctamente')
                            // openModal();
                            setMensajeModalConfirm('Movimiento Asignado Correctamente, ¿Imprime Designacion?');
                            openModalConfirm();
                        }
    
                    }
                })
                .catch(error=>{
                    console.log('que trae error createasignacionmov: ', error)
                })
                .finally(()=>{
                    //Espero 2 segundos ants de habilitar boton
                    setTimeout(()=>{
                        console.log('finaliza asignacion');
                        setIsSubmitting(false); //Vuelvo a habilitar boton
                    },5000)
                })
    
            //Al final del Proceso de Asignacion recargo el listado de Vacantes Disponibles
            await buscoIDListadoVacantes(configSG.nivel.id_nivel);
        }
    };

    const creaNuevaVacante = async() => {
        //Creo una nueva Vacante con los datos del cargo que deja el Inscripto
        //id_listado_vac_mov, orden, establecimiento, obs_establecimiento, region, departamento, localidad, cargo, turno, modalidad, cupof, id_especialidad, datetime_creacion, zona
        //console.log('que tiene datosInscriptoSelect: ', datosInscriptoSelect);
        const fechaHoraActualNuevaVac = await traeFechaHoraActual();
        const formNuevaVacante={
            id_listado_vac_mov:idListVacMov, //INT
            orden:null,  //INT
            establecimiento:datosInscriptoSelect.nro_escuela, //VARCHAR
            obs_establecimiento:'', //VARCHAR
            region:'', //VARCHAR
            departamento:'', //VARCHAR
            localidad:'', //VARCHAR
            cargo:datosInscriptoSelect.cargo_actual, //VARCHAR
            turno:(datosInscriptoSelect.turno_actual) ?datosInscriptoSelect.turno_actual :``, //VARCHAR
            modalidad:'', //VARCHAR
            cupof:'', //VARCHAR
            id_especialidad:null, //INTEGER
            datetime_creacion:fechaHoraActualNuevaVac, //VARCHAR
            zona:'' //VARCHAR
        }
        //console.log('como arma formBody para Nueva Vacante: ', formNuevaVacante);
        await axios.post(`${URL}/api/vacantemov`,formNuevaVacante)
        .then(async res=>{
            //console.log('que trae res de createVacantesMov: ', res);
            //Mostrar Notificacion de Movimiento realizado
            //Una vez creada la vacante, se debe actualizar el id_vacante_mov generada del cargo que dejo el inscripto
            const idVacanteGenerada = res.data.id_vacantes_mov;
            //console.log('cual es el id de la vacante creada: ', idVacanteGenerada);

            const resUpdIdVacGen = await updateIdVacanteGenerada(datosInscriptoSelect.id_inscriptos_mov,idVacanteGenerada);
            //console.log('que trae resUpdIdVacGen: ', resUpdIdVacGen);

            // setMensajeModalInfo('Movimiento Asignado Correctamente')
            // openModal();
            setMensajeModalConfirm('Movimiento Asignado Correctamente, ¿Imprime Designacion?');
            openModalConfirm();
        })
        .catch(error=>{
            console.log('que trae error createVacantesMov: ', error)
        });
        //Al final del Proceso de Asignacion recargo el listado de Vacantes Disponibles
        await buscoIDListadoVacantes(configSG.nivel.id_nivel);
    };

    //Proceso para Imprimir la designacion
    const procesoImpresion = async()=>{
        //console.log('ingresa a Impresion');
        await handlePrint();
    };

    //Proceso para Imprimir la designacion
    const procesoImpresionAsistencia = async()=>{
        //console.log('ingresa a Impresion de Asistencia');
        await handlePrintAsistencia();
    };

    //?---------------------------------------------------------------


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


    const submitEliminarTomaCargo = async(idAsignacion) =>{
        //console.log('que trae idAsignacion: ', idAsignacion);
        const fechaHoraActual = traeFechaHoraActual();
        const datosBody={
            obsDesactiva:`Se desactiva la Asignacion por Eliminacion ${fechaHoraActual}`
        }

        try{
            await axios.post(`${URL}/api/delasignacionmov/${idAsignacion}`,datosBody)
            .then(async res=>{
                //Si se elimina la Asignacion, se debe volver a Actualizar el Estado del Inscrpto a NULL
                await updateEstadoAsignadoInscripto(datosInscriptoSelect.id_inscriptos_mov, null);
                //console.log('que trae res de delasignacionmov: ', res);
                //Mostrar Notificacion de Eliminacion de Asignacion
                setMensajeModalInfo('Toma de Cargo Eliminada');
                openModal();
            })
            .catch(error=>{
                console.log('que trae error createVacantesMov: ', error)
            });

        }catch(error){
            console.error(error.message);
        }
        //Al final del Proceso de Eliminar Asignacion recargo el listado de Vacantes Disponibles
        await buscoIDListadoVacantes(configSG.nivel.id_nivel);
    };

    //Proc: elimina una vacante de movimiento generada por toma de cargo
    //- Eliminar vacante de vacantes_mov
    //- Actualizar inscriptos_mov en su campo: id_vacante_generada_cargo_actual a NULL
    const submitEliminarVacanteMov = async(idVacanteMov)=>{
        //console.log('que trae idVacanteMo: ', idVacanteMov);
        const fechaHoraActual = traeFechaHoraActual();
        const datosBody={
            obsDesactiva:`Se desactiva la VACANTE por Eliminacion ${fechaHoraActual}`
        }
        try{
            await axios.put(`${URL}/api/delvacantemov/${idVacanteMov}`,datosBody)
            .then(async res=>{
                //console.log('que trae res de delvacantemov: ', res);
                //Actualizar campo id_vacante_generada_cargo_actual en Inscriptos_mov
                const idVacanteGenerada=null;
                const resUpdIdVacGen = await updateIdVacanteGenerada(datosInscriptoSelect.id_inscriptos_mov,idVacanteGenerada);
                //console.log('que trae resUpdIdVacGen: ', resUpdIdVacGen);

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

    const handlePageChange = (nuevaPagina)=>{
        if(nuevaPagina>0 && nuevaPagina<=paginacion?.totalPages){
            setCurrentPage(nuevaPagina);
        };
    };

    //PAGINA OFICIO
    const handlePrint = useReactToPrint({
        content:() => componentRef.current,
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

    //PAGINA MITAD OFICIO
    // const handlePrint = useReactToPrint({
    //     content:() => componentRef.current,
    //     pageStyle:`
    //     @page {
    //       size: 16.8cm 20cm   ; /* Tamaño del papel */
          
    //       }
    //       body{
    //         margin: 0cm;
    //       }
    //   `,
    // });

    //PAGINA MITAD OFICIO
    // const handlePrintAsistencia = useReactToPrint({
    //     content:() => componentRefAsistencia.current,
    //     pageStyle:`
    //     @page {
    //       size: 21.59cm 17.78cm; /* Tamaño del papel */
    //       margin:0.4cm;
    //       orientation: portrait; /* Orientación vertical */
    //     }
    //   `,
    // });

    const submitCloseModalConfirm = () =>{

        closeModalConfirm();
        closeModalAsign();
        closeModalVac();
        getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,inputSearch,idListadoInscriptosMovCompara,filtroEspecialidadLuom);
    };


    const cargaInicialListados=(nivel)=>{
        //LLAMO AL PROCEDIMIENTO buscoIdlistadoInscrip Y PASO EL NIVEL CARGADO EN STORE GLOBAL
        buscoIdlistadoInscrip(nivel);
        //LLAMO AL PROCEDIMIENTO buscoIDListadoVacantes Y PASO EL NIVEL CARGADO EN STORE GLOBAL
        buscoIDListadoVacantes(nivel);
        //Cargo las especialidades
        cargaEspecidalidades();

        //setIsIntervalActive(true);

    };

    //Este Proc carga el listado de especialidades en E.L.
    const cargaEspecidalidades=async()=>{
        const data = await fetchAllEspecialidades();
        //console.log('que tiene especialidades: ', data);
        if(data?.length!=0){
            setListadoEspecialidades(data);
            setListadoEspecialidadesLuom(data);

        }
    };
    

    const handleCancelFiltroEspecialidadVac =()=>{
        setFiltroEspecialidadVac("");
    };
    const handleCancelFiltroEspecialidadLuom =()=>{
        setFiltroEspecialidadLuom("");
        setCurrentPage(1);
    };

    const handleSelectFiltroEspecialidad=(event)=>{
        const{value} = event.target;
        //console.log('que tiene filtroEspecialidad: ', value);
        setFiltroEspecialidadVac(value);
        
        setCurrentPageVac(1);
        //al seleccionar una especialidad, regrso a la primer pagina, por si no hay tantos inscriptos
        
    };

    const handleSelectFiltroEspecialidadLuom=(event)=>{
        const{value} = event.target;
        console.log('que tiene filtroEspecialidad: ', value);
        setFiltroEspecialidadLuom(value);
        
        setCurrentPageVac(1);
        //al seleccionar una especialidad, regrso a la primer pagina, por si no hay tantos inscriptos
        
    };

    const submitCloseModalVac = () =>{
        setFiltroEspecialidadVac("");
        setCurrentPageVac(1);
        setCampoOrderVac('');
        setOrderBy('');
        setTypeOrder('');
        setEstadoAsignadoInscripto('');
        setCantLegajoDni(0);
        closeModalVac();
    };

    const handlePageChangeVac = (nuevaPagina)=>{
        if(nuevaPagina>0 && nuevaPagina<=paginacionVac?.totalPages){
            setCurrentPageVac(nuevaPagina);
        };
    };

    const SubmitCloseModalDatos = ()=>{
        closeModalDatos();
        setMensajeModalDatos('');
    };

    const HandleSelectEstadoAsignadoInscripto=(event)=>{
        const{value} = event.target;
        //console.log('que viene en handleSelectEstadoAsignadoInscripto: ', value);
        setEstadoAsignadoInscripto(value);
    };

    const submitGuardarEstadoInscripto=async()=>{
        //console.log('que tiene estadoAsignadoInscripto: ', estadoAsignadoInscripto)
        try{
            const datosUpdateEstado = await updateEstadoAsignadoInscripto(datosInscriptoSelect.id_inscriptos_mov, estadoAsignadoInscripto);
            //console.log('que trae datosUpdateEstado: ', datosUpdateEstado)
            setMensajeModalInfo('Estado del Inscripto Actualizado');
            openModal();
            setEstadoAsignadoInscripto('');
        }catch(error){
            console.log('error en updateEstadoAsignadoInscripto', error);
        }

    };

    const validacantidadlegajo=async(dni)=>{
        const result =  await validaDniAsignadoListado(idListadoInscriptosMov, dni);

        //console.log('que trae validadniasignadolistado: ', result[0].cantidad);

        const cantidad = result[0].cantidad;

        setCantLegajoDni(cantidad);
    };

    // const resetInterval = useCallback(()=>{
    //     console.log('INGRESO A RESET INTERVALO')
    //     setIsIntervalActive(false);
    //     setTimeout(()=>setIsIntervalActive(true),0);
    // },[]);

    useEffect(()=>{
        //console.log('que tiene CONTADOR: ',totalVacantes);
    },[totalVacantes])

    useEffect(()=>{
        //Al cambiar pagina de Vacantes disponibles
        getVacantesDisponiblesMov(idListVacMov,currentPageVac,inputSearchVac,filtroEspecialidadVac,orderBy,typeOrder)
    },[currentPageVac])

    useEffect(()=>{
        //recargo listado de inscriptos con la nueva pagina
        getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,inputSearch,idListadoInscriptosMovCompara,filtroEspecialidadLuom);
    },[currentPage])

    //A medida que se escribe en el Input de BUsqueda de Vacantes Disponibles se ejecuta
    //la busqueda filtrando el listado de vacantes
    // useEffect(()=>{
    //     busquedaDinamica();
    // },[inputSearchVac])

    useEffect(()=>{
        //console.log('que especialidad de Vacante selecciono: ', filtroEspecialidadVac);
        //filterEspecialidad(filtroEspecialidadVac);
        //console.log('APLICO FILTRO LISTADO VACANTES')
        getVacantesDisponiblesMov(idListVacMov,currentPageVac,inputSearchVac,filtroEspecialidadVac,orderBy,typeOrder)
    },[filtroEspecialidadVac,inputSearchVac,orderBy,typeOrder])


    //Al setear en E.L los datos del inscripto seleccionado
    useEffect(()=>{
        //llamo a Proc para cargar valores iniciales en formInscripto y estadoForm en "ver"
        valoresInicialesFormInscripto();
    },[datosInscriptoSelect]);

    useEffect(()=>{
        //console.log('como queda el listado filtrado filterListadoInscriptosMov: ', filterListadoInscriptosMov);
    },[filterListadoInscriptosMov])


    //APLICO FILTROS de tipoInscripto (Activos / Disponibilidad), estadoInscripto(todos/sinasignar/asignados) y busquedadinamica(inputSearch)
    useEffect(()=>{
        //console.log('APLICO FILTRO')
        getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,inputSearch,idListadoInscriptosMovCompara,filtroEspecialidadLuom);
    },[tipoInscripto,estadoInscripto,inputSearch])

    useEffect(()=>{
        if (!isIntervalActive) return;

        getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,inputSearch,idListadoInscriptosMovCompara,filtroEspecialidadLuom);

        const intervalId = setInterval(()=>{
            //console.log('ACTIVO INTERVALO')
            getInscriptosMov(idListadoInscriptosMov,currentPage,tipoInscripto,estadoInscripto,inputSearch,idListadoInscriptosMovCompara,filtroEspecialidadLuom);
        }, 10000);
        
        return()=>clearInterval(intervalId);

    },[isIntervalActive, nivelSG, formInscripto, tipoInscripto, estadoInscripto, inputSearch, currentPage,filtroEspecialidadLuom])

    useEffect(()=>{
        //console.log('que tiene isIntervalActive: ', isIntervalActive);
    },[isIntervalActive])

    useEffect(()=>{
        //console.log('que tiene asignacionCargoOriginal: ', asignacionCargoOriginal);
    },[asignacionCargoOriginal])

    //ADMIN CAMBIA DE NIVEL
    // useEffect(()=>{
    //     //resetInterval();
    //     //setIsIntervalActive(false);
    //     console.log('>>que tiene nivelSG: ', nivelSG);
    //     //cargaInicialListados(nivelSG.id_nivel);
    // },[nivelSG])


    //VEO EL LISTADO DE VACANTES DE MOVIMIENTO
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //console.log('que tiene listadoVacantesMov: ', listadoVacantesDispMov);
    },[listadoVacantesDispMov])

    //VEO EL LISTADO DE INSCRIPTOS DE MOVIMIENTO
    useEffect(()=>{
        //console.log('que tiene listadoInscriptosMov (CARGA INICIAL): ', listadoInscriptosMov);
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //NI BIEN CARGO EL LISTADO DE INSCRIPTOS FILTRO CON ESTADO ACTIVO
        //FILTRO EL LISTADO DE INSCRIPTOS DE MOVIMIENTO
        filtroInicialListado();
    },[listadoInscriptosMov])

    //VEO LA CONFIGURACION GLOBAL
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //console.log('que tiene configSG en InscriptosMov (CARGA INICIAL): ', configSG);
        
        cargaInicialListados(configSG.nivel.id_nivel);
    },[configSG])

    useEffect(()=>{
        //console.log('que tiene userSG: ',userSG);
    },[userSG])

    //AL INGRESAR SE CARGA EL LISTADO DE INSCRIPTOS
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        cargaInicialListados(configSG.nivel.id_nivel);
    },[]);

    return(
        <div className=" notranslate h-full w-full">
            {/* ENCABEZADO DE PAGINA */}
            <div className="bg-[#C9D991] h-[12vh] flex flex-row">
                {/* TITULOS - BOTONES - NIVEL */}
                <div className="w-[20vw] flex justify-center items-start flex-col ">
                    <label className="ml-4 text-base desktop-xl:text-xl font-semibold">NIVEL {configSG.nivel.descripcion}</label>
                    <div className="flex flex-row">
                        <label className="ml-4 text-lg desktop-xl:text-xl font-sans font-bold">INSCRIPTOS - LUOM</label>
                    </div>
                    <div className="flex flex-row desktop-xl:text-xl">
                        <button 
                            className={`ml-4 mr-2 px-[2px] border-[1px] rounded shadow 
                                ${(tipoInscripto===2)
                                    ?`border-[#7C8EA6] bg-[#7C8EA6] text-white`
                                    :`border-[#73685F]  hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] `
                                }`}
                            onClick={()=>{setTipoInscripto(2);setCurrentPage(1)}}
                        >Activos</button>
                        <button 
                            className={`ml-2 px-[2px] border-[1px] rounded shadow 
                                ${(tipoInscripto===1)
                                    ?`border-[#7C8EA6] bg-[#7C8EA6] text-white`
                                    :`border-[#73685F]  hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] `
                                }`}
                            onClick={()=>{setTipoInscripto(1);setCurrentPage(1)}}
                        >Disponibilidad</button>
                    </div>
                </div>
                {/* SECCION FILTRO ESPECIALIDAD */}
                <div className="w-[30vw] flex justify-center items-start flex-col ">
                    <label className=" ">Especialidad Luom: </label>
                    <div className="border-[1px] rounded border-gray-500 bg-neutral-50">
                        <select
                            className="w-[27vw] border-[1px] rounded focus:outline-none focus:ring-0 focus:border-none"
                            name="filtroEspecialidad"
                            onChange={handleSelectFiltroEspecialidadLuom}
                            value={filtroEspecialidadLuom}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoEspecialidadesLuom?.map((especialidad,index)=>(
                                    <option 
                                        key={index} 
                                        value={especialidad.id_especialidad}
                                        className="text-base"
                                    >{especialidad.abreviatura} - {especialidad.descripcion}</option>
                                ))
                            }
                        </select>
                        {(filtroEspecialidadLuom!="") &&
                            <label 
                                className="font-bold mx-2 cursor-pointer"
                                onClick={handleCancelFiltroEspecialidadLuom}
                            >X</label>
                        }
                    </div>
                </div>

                {/* SECCION CONTADOR INFORMATIVO */}
                <div className="w-[15vw] flex justify-center items-start flex-col ">
                    {/* <div className="ml-8 text-base italic font-semibold">
                    </div>
                    <div className="p-[1px] border-[2px] border-[#7C8EA6] rounded-md shadow">
                        <table >
                            <thead>
                                <tr className="">
                                    <th colSpan={2} className=" text-center bg-gray-100 ">Vacantes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-y-[1px] border-gray-400">
                                    <td  className="border-r-[1px] border-gray-400 bg-sky-100 text-sm font-semibold">Disponibles</td>
                                    <td  className=" bg-red-100 text-sm font-semibold">Asignadas</td>
                                </tr>
                                <tr>
                                    <td  className="border-r-[1px] border-gray-400 text-center font-semibold bg-sky-100">{totalVacantes.disponibles}</td>
                                    <td  className=" text-center font-semibold bg-red-100">{totalVacantes.asignadas}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> */}
                </div>
                {/* SECCION DATOS USUARIO */}
                <div className=" w-[20vw] flex items-center justify-end ">
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
                                className={`border-b-2 px-2 cursor-pointer transition-all duration-500 desktop-xl:text-lg
                                    ${(estadoInscripto==='todos')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoInscripto('todos');setCurrentPage(1)}}
                            >Todos</label>
                            <label 
                                className={`border-b-2 px-2 cursor-pointer transition-all duration-500 desktop-xl:text-lg
                                    ${(estadoInscripto==='sinasignar')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoInscripto('sinasignar');setCurrentPage(1)}}
                            >Sin Asignar</label>
                            <label 
                                className={`border-b-2 px-2 cursor-pointer transition-all duration-500 desktop-xl:text-lg
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
                                    className="w-[15vw] focus:outline-none rounded desktop-xl:text-lg"
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
                                        //onClick={()=>handleInputSearchChange()}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PARTE INFERIOR DE DATOS DE TABLA */}
                    <div className="desktop:h-[65vh] desktop-lg:h-[65vh] desktop-md:h-[65vh] overflow-y-auto">
                        <table className="border-[1px] bg-slate-50 w-full">
                            <thead>
                                <tr className="sticky top-0 text-sm desktop-xl:text-lg border-b-[1px] border-zinc-300 bg-zinc-200">
                                    <th className="border-r-[1px] font-semibold text-purple-500 border-zinc-300">ID</th>
                                    {/* <th className="border-r-[1px] border-zinc-300">Ord.</th> */}
                                    <th className="border-r-[1px] border-zinc-300">Puntaje</th>
                                    <th className="border-r-[1px] border-zinc-300">Apellido</th>
                                    <th className="border-r-[1px] border-zinc-300">Nombre</th>
                                    <th className="border-r-[1px] border-zinc-300">DNI</th>
                                    <th className="border-r-[1px] border-zinc-300">Legajo</th>
                                    <th className="border-r-[1px] border-zinc-300">Escuela</th>
                                    <th className="border-r-[1px] border-zinc-300">Cargo Actual</th>
                                    <th className="border-r-[1px] border-zinc-300">Turno</th>
                                    <th className="border-r-[1px] border-zinc-300">Cargo Solicitado</th>
                                    <th className="border-r-[1px] border-zinc-300">Observacion</th>
                                    <th className="border-r-[1px] border-zinc-300">Estado</th>
                                    <th className="">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    // filterListadoInscriptosMov?.map((inscripto, index)=>{
                                    listadoInscriptosMov?.map((inscripto, index)=>{
                                        const colorFila = (inscripto.vacante_asignada || inscripto.legajoEnOtroNivel) ?`bg-red-200` :(((inscripto.id_inscriptos_mov % 2)===0) ?`bg-zinc-200` :``)
                                        return(
                                            <tr 
                                                className={`text-lg desktop-xl:text-xl font-medium border-b-[1px] border-zinc-500 h-[5vh] desktop-xl:h-[5.5vh] hover:bg-orange-300 ${colorFila}`}
                                                key={index}
                                            >
                                                <td className="text-center text-sm font-light">{inscripto.id_inscriptos_mov}</td>
                                                {/* <td className="text-center font-light">{inscripto.orden}</td> */}
                                                <td className="text-center font-bold text-sky-800">{inscripto.total}</td>
                                                <td className="pl-2">{inscripto.apellido}</td>
                                                <td className="pl-2">{inscripto.nombre}</td>
                                                <td className="text-center px-2">{inscripto.dni}</td>
                                                <td className="text-center">{inscripto.legajo}</td>
                                                <td className="text-center">{inscripto.nro_escuela}</td>
                                                <td className="text-center">{inscripto.cargo_actual}</td>
                                                <td className="text-center">{inscripto.turno_actual}</td>
                                                <td className="text-center">{inscripto.cargo_solicitado}</td>
                                                <td className="text-sm text-center">{inscripto.observacion}</td>
                                                <td 
                                                    className={`text-sm text-center
                                                            ${(inscripto.estado_inscripto=='Ausente')
                                                                ?`text-red-500`
                                                                :``
                                                            }
                                                        `}
                                                >{inscripto.estado_inscripto}</td>
                                                <td>
                                                    <div className="flex flex-row items-center justify-center  ">
                                                        {(inscripto.vacante_asignada===null && inscripto.id_vacante_generada_cargo_actual!=null)
                                                            ?<FiAlertTriangle    
                                                                className="mr-2 blink text-red-500"
                                                                />
                                                            :``
                                                        }
                                                        <FaEye 
                                                            className="hover:cursor-pointer hover:text-[#83F272]" 
                                                            title="Ver Datos"
                                                            onClick={()=>submitVerDatosInscripto(inscripto)}
                                                        />
                                                        {
                                                            ((inscripto.vacante_asignada===null || inscripto.vacante_asignada==='' ) && inscripto.legajoEnOtroNivel===null && (userSG.permiso!=3 && userSG.permiso!=4))
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
        
        
        {/* MODAL DE VACANTES DISPONIBLES*/}
        <ModalEdit isOpen={isOpenModalVac} closeModal={closeModalVac}>
            <div className="h-full w-100  flex flex-col items-center">
                <label className="text-xl desktop-xl:text-2xl text-center font-bold " translate='no'>VACANTES DISPONIBLES</label>
                {/* DATOS DEL INSCRIPTO */}
                <div className="flex flex-row">
                    <div className="my-2 border-[1px] border-zinc-400 flex flex-row justify-center rounded-md shadow font-semibold desktop-xl:text-2xl">
                        <label className="ml-2 text-zinc-500">{datosInscriptoSelect.apellido} {datosInscriptoSelect.nombre}</label>
                        <label className="mx-2 text-zinc-500 font-bold">({datosInscriptoSelect.tipoinscripto})</label>
                        <label className="mr-[2px] text-red-400">C. Origen: </label>
                        <label className="mr-4 text-red-400 font-bold">{datosInscriptoSelect.cargo_actual}</label>
                        <label className="mr-[2px] text-red-400">Turno:</label>
                        <label className="mr-2 text-red-400 font-bold">{datosInscriptoSelect.turno_actual}</label>
                        <label className="mr-2 font-bold">/</label>
                        <label className="mr-[2px] text-sky-500">C. Solicitado: </label>
                        <label className="mr-4 text-sky-500 font-bold">{datosInscriptoSelect.cargo_solicitado}</label>
                    </div>
                    <div className="ml-2 flex flex-row items-center">
                        <label className="text-base desktop-xl:text-lg font-bold">Estado: </label>
                        <div className="ml-2 border-[1px] border-zinc-400  flex justify-center rounded-md shadow font-semibold text-base desktop-xl:text-lg">
                            <select 
                                className="focus:outline-none rounded-md"
                                value={estadoAsignadoInscripto}
                                onChange={HandleSelectEstadoAsignadoInscripto}
                            >
                                <option value='' disabled selected>Seleccione...</option>
                                <option value={2}>No Asignado</option>
                                <option value={3}>En Espera</option>
                                <option value={4}>Ausente</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="h-[60vh] w-full mt-2 ">
                    {/* PARTE SUPERIOR - FILTROS Y BUSQUEDA */}
                    <div className="border-[1px] border-zinc-400 rounded-t-lg h-[9vh] flex flex-col bg-[#dde8b7]">
                        {/* FILTROS */}
                        <div className="flex flex-row justify-between">
                            {/* FILTRO ESPECIALIDAD */}
                            <div className="flex flex-row my-[4px]">
                                <label className="mx-4 text-base desktop-xl:text-lg ">Especialidad: </label>
                                <div className="border-[1px] h-[26px] rounded border-zinc-400 bg-neutral-50">
                                    <select
                                        className="w-[40vw] h-[24px] border-[1px] rounded focus:outline-none focus:ring-0 focus:border-none"
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
                            {/* CUADRO BUSQUEDA */}
                            <div className="flex justify-end my-[4px]">
                                <div className="border-[1px] border-zinc-400 w-[20vw] rounded flex flex-row items-center justify-between mr-2 bg-white">
                                    <input 
                                        className="w-[15vw] focus:outline-none rounded pl-[2px] desktop-xl:text-lg"
                                        placeholder="Buscar..."
                                        type="text"
                                        value={inputSearchVac}
                                        onChange={handleInputSearchVacChange}
                                    />
                                    <div className="flex flex-row items-center ">
                                        {(inputSearchVac!='') &&
                                            <FaTimes
                                                className="text-slate-400 cursor-pointer text-lg"
                                                onClick={()=>handleCancelSearchVac()}
                                            />
                                        }
                                        {/* <FaSearch 
                                            className="text-zinc-500 cursor-pointer mr-2"
                                            onClick={()=>submitSearchVac()}
                                        /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ORDENAMIENTO POR CAMPOS SEGUN FILTRO BUSQUEDA */}
                        <div className="flex flex-row desktop-xl:text-lg">
                            <div className="flex flex-row items-center justify-center w-[2vw] border-r-[1px] border-zinc-200 ">
                                <label className="font-base text-sm">ID</label>
                            </div>
                            <div className="flex flex-row items-center justify-center w-[4vw] border-r-[1px] border-zinc-200  ">
                                <label className="font-base font-semibold">Orden</label>
                            </div>
                            <div className="flex flex-row items-center justify-center w-[30vw] border-r-[1px] border-zinc-200  ">
                                <label className="font-base font-semibold">Escuela</label>
                            </div>
                            {/* <div 
                                className={`flex flex-row items-center justify-center w-[30vw] border-r-    [1px] border-zinc-200 hover:text-sky-500  cursor-pointer
                                    ${(campoOrderVac==='establecimiento')
                                        ?`text-sky-500`
                                        :``
                                    }`}
                                onClick={()=>{submitOrderVac('establecimiento');setOrder(!order)}}
                            >
                                <label className="font-semibold cursor-pointer">Escuela</label>
                                {
                                    (campoOrderVac==='establecimiento') &&
                                    <div>
                                        {(order)
                                            ?<TbSortDescending className=" ml-2 cursor-pointer"/>
                                            :<TbSortAscending className=" ml-2 cursor-pointer"/>
                                        }
                                    </div>
                                }
                                {
                                    (campoOrderVac!='establecimiento') &&
                                    <LuArrowUpDown 
                                        className="ml-2 cursor-pointer"
                                    />
                                }
                                
                            </div> */}
                            <div className="flex flex-row items-center justify-center w-[10vw] border-r-[1px] border-zinc-200">
                                <label className="font-semibold">Cargo</label>
                                {/* <LuArrowUpDown className="ml-2"/> */}
                            </div>
                            <div className="flex flex-row items-center justify-center w-[13vw] border-r-[1px] border-zinc-200">
                                <label className="font-semibold">Modalidad</label>
                                {/* <LuArrowUpDown className="ml-2"/> */}
                            </div>
                            <div className="flex flex-row items-center justify-center w-[10vw] border-r-[1px] border-zinc-200">
                                <label className="font-semibold">Turno</label>
                                {/* <LuArrowUpDown className="ml-2"/> */}
                            </div>
                            <div className="flex flex-row items-center justify-center w-[10vw] border-r-[1px] border-zinc-200">
                                <label className="font-semibold">CUPOF</label>
                                {/* <LuArrowUpDown className="ml-2"/> */}
                            </div>
                            <div className="flex flex-row items-center justify-center w-[10vw] border-r-[1px] border-zinc-200">
                                <label className="font-semibold">Region</label>
                                {/* <LuArrowUpDown className="ml-2"/> */}
                            </div>
                            <div 
                                className={`flex flex-row items-center justify-center w-[15vw] border-r-    [1px] border-zinc-200 hover:text-sky-500 cursor-pointer
                                    ${(campoOrderVac==='localidad')
                                        ?`text-sky-500`
                                        :``
                                    }`}
                                    onClick={()=>{submitOrderVac('localidad');setOrder(!order)}}
                            >
                                <label className="font-semibold cursor-pointer">Localidad</label>
                                {
                                    (campoOrderVac==='localidad') &&
                                    <div>
                                        {(order)
                                            ?<TbSortDescending className="ml-2 cursor-pointer"/>
                                            :<TbSortAscending className="ml-2 cursor-pointer"/>
                                        }
                                    </div>
                                }
                                {
                                    (campoOrderVac!='localidad') &&
                                    <LuArrowUpDown 
                                        className="ml-2 cursor-pointer"
                                    />
                                }
                            </div>
                            <div className="flex flex-row items-center justify-center w-[8vw] ">
                                <label className="font-semibold">Zona</label>
                            </div>
                            {/* <div 
                                className={`flex flex-row items-center justify-center w-[8vw] border-r-    [1px] border-zinc-200 hover:text-sky-500 cursor-pointer
                                    ${(campoOrderVac==='zona')
                                        ?`text-sky-500`
                                        :``
                                    }`}
                                    onClick={()=>{submitOrderVac('zona');setOrder(!order)}}
                            >
                                <label className="font-semibold cursor-pointer">Zona</label>
                                {
                                    (campoOrderVac==='zona') &&
                                    <div>
                                        {(order)
                                            ?<TbSortDescending className="ml-2 cursor-pointer"/>
                                            :<TbSortAscending className="ml-2 cursor-pointer"/>
                                        }
                                    </div>
                                }
                                {
                                    (campoOrderVac!='zona') &&
                                    <LuArrowUpDown 
                                        className="ml-2 cursor-pointer"
                                    />
                                }
                            </div> */}
                            <div className="flex flex-row items-center justify-center w-[8vw] ">
                                <label className="font-semibold">Acciones</label>
                            </div>
                        </div>
                    </div>

                    {/* PARTE INFERIOR - DATOS DE TABLA */}
                    <div className="w-full h-[51vh] overflow-y-auto border-[1px] border-zinc-400 rounded-b-lg border-t-0">
                        <table className="">
                            <tbody>
                                {
                                    listadoVacantesDispMov?.map((vacante, index)=>{
                                        return(
                                            <tr
                                                className={`text-lg desktop-xl:text-xl font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 `}
                                                        key={index}
                                            >
                                                <td className="w-[2vw] pl-[4px] text-sm font-light">{vacante.id_vacante_mov}</td>
                                                <td className="w-[4vw] pl-[4px] font-light">{vacante.orden}</td>
                                                {/* <td className="w-[10vw] pl-[4px] text-center">{vacante.establecimiento}</td>
                                                <td className="w-[30vw] pl-[4px] text-start">{vacante.obs_establecimiento}</td> */}
                                                <td className="w-[30vw] pl-[4px] text-start">
                                                    <div className="flex flex-row">
                                                        <p className="text-purple-700">{vacante.establecimiento}</p>
                                                        <p className="ml-2">{vacante.obs_establecimiento}</p>
                                                    </div>
                                                </td>
                                                {/* <td className="w-[30vw] pl-[4px] text-center">{vacante.obs_establecimiento}</td> */}
                                                <td className="w-[10vw] pl-[4px] text-center">{vacante.cargo}</td>
                                                <td className="w-[13vw] pl-[4px] text-center">{vacante.modalidad}</td>
                                                <td className="w-[10vw] pl-[4px] text-center">{vacante.turno}</td>
                                                <td className="w-[10vw] pl-[4px] text-center">{vacante.cupof}</td>
                                                <td className="w-[10vw] pl-[4px] text-center">{vacante.region}</td>
                                                <td className="w-[15vw] pl-[4px] text-center">{vacante.localidad}</td>
                                                <td className="w-[8vw] pl-[4px] text-center">{vacante.zona}</td>
                                                <td className="w-[8vw]">
                                                    <div className="flex flex-row items-center justify-center">
                                                        {/* <FaEye 
                                                            className="mr-2 hover:cursor-pointer hover:text-[#83F272]" 
                                                            title="Ver Datos"
                                                            //onClick={()=>submitVerDatosInscripto(inscripto)}
                                                        /> */}
                                                        <BiTransferAlt 
                                                            className="text-2xl hover:cursor-pointer hover:text-[#83F272]"      title="Asignacion"
                                                            onClick={()=>submitAsignar(vacante)}
                                                        />
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

                <div className="mt-4">
                    <Paginador
                        currentpage={paginacionVac?.page}
                        totalpage={paginacionVac?.totalPages}
                        onPageChange={handlePageChangeVac}
                        totalItems={paginacionVac?.totalItems}
                    />
                </div>

                <div>
                    {(estadoAsignadoInscripto==='' || estadoAsignadoInscripto===null)
                        ?<button
                            className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2 desktop-xl:text-lg"
                            onClick={submitCloseModalVac}
                            translate='no'
                        >CERRAR</button>
                        :<div>
                            <button
                                className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={submitGuardarEstadoInscripto}
                                translate='no'
                            >GUARDAR ESTADO</button>
                            <button
                                className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={()=>{submitCloseModalVac();setEstadoAsignadoInscripto('')}}
                                translate='no'
                            >CANCELAR</button>
                        </div>

                    }
                    
                </div>
            </div>
        </ModalEdit>

        {/* MODAL DE ASIGNACION */}
        <ModalEdit isOpen={isOpenModalAsign} closeModal={closeModalAsign}>
            <div className="h-100 w-[55vw] desktop-xl:w-[55vw] flex flex-col items-center">
                <label 
                    className="text-xl text-center font-bold desktop-xl:text-2xl" 
                    translate='no'
                >
                {`ASIGNACION VACANTE (
                    ${datosInscriptoSelect.tipoinscripto} ) `}
                </label>
                {/* DATOS DEL INSCRIPTO */}
                <div className="border-[1px] border-purple-400 flex flex-col justify-center rounded-md shadow font-semibold text-lg bg-purple-100 mb-2 desktop-xl:text-2xl my-2">
                    <div className="flex flex-row">
                        <label className="mx-4 text-zinc-800">Docente: {datosInscriptoSelect.apellido} {datosInscriptoSelect.nombre}</label>
                        <label className="mr-4 text-zinc-800">DNI: {datosInscriptoSelect.dni}</label>
                        <label className="mr-4 text-zinc-800">Puntaje: {datosInscriptoSelect.total}</label>
                    </div>
                </div>
                {/* AVISO ESPECIALIDAd DIFIERE DE LA SOLICITADA */}
                {/* PARA TRASLADO */}
                {((datosInscriptoSelect.cargo_solicitado!=datosVacanteSelect.cargo) && (datosInscriptoSelect.id_tipo_inscripto===2))
                    ?<div className="flex flex-row items-center">
                        <FiAlertTriangle  className="mr-2 text-xl desktop-xl:text-3xl  text-red-500"/>
                        <div className="border-[2px] border-red-500 flex flex-row justify-center rounded-md shadow font-semibold text-lg bg-red-100 mb-2 desktop-xl:text-xl animate-parpadeoborde">
                            <label className="mx-2">El cargo solicitado: </label>
                            <label className="mr-2 font-bold">{datosInscriptoSelect.cargo_solicitado}</label>
                            <label className="mr-2">, es distinto al cargo a tomar: </label>
                            <label className="mr-2 font-bold">{datosVacanteSelect.cargo}</label>
                        </div>
                        {/* <FiAlertTriangle  className="ml-2 text-xl desktop-xl:text-3xl blink text-red-500"/> */}
                    </div>
                    :``
                }
                {/* PARA CAMBIO FUNCION */}
                {/* {((datosInscriptoSelect.cargo_solicitado===datosVacanteSelect.cargo) && (datosInscriptoSelect.id_tipo_inscripto===3)) &&
                    <div className="border-[2px] border-red-500 flex flex-row justify-center rounded-md shadow font-semibold text-lg bg-red-100 mb-2 desktop-xl:text-xl blink">
                    <label className="mx-2">El cargo solicitado: </label>
                    <label className="mr-2 font-bold">{datosInscriptoSelect.cargo_solicitado}</label>
                    <label className="mr-2">, es igual al cargo a tomar: </label>
                    <label className="mr-2 font-bold">{datosVacanteSelect.cargo}</label>
                </div>
                } */}
                {/* PARA TURNOS DIFERENTES */}
                {((datosInscriptoSelect.turno_actual!=datosVacanteSelect.turno) && cantLegajoDni>1)
                    ?<div className="flex flex-row items-center ">
                        <FiAlertTriangle  className="mr-2 text-xl desktop-xl:text-3xl  text-red-500"/>
                        <div className="border-[2px] border-red-500 flex flex-row justify-center rounded-md shadow font-semibold text-lg bg-red-100 mb-2 desktop-xl:text-xl animate-parpadeoborde">
                            <label className="mx-2">El Turno Origen: </label>
                            <label className="mr-2 font-bold">{datosInscriptoSelect.turno_actual}</label>
                            <label className="mr-2">, difiere al Turno del Cargo a Tomar: </label>
                            <label className="mr-2 font-bold">{datosVacanteSelect.turno}</label>
                        </div>
                        {/* <FiAlertTriangle  className="ml-2 text-xl desktop-xl:text-3xl blink text-red-500"/> */}
                    </div>
                    :``
                }
                {/* DATOS DE LOS CARGOS */}
                <div className="flex flex-row  w-[55vw]">
                    {/* CARGO ORIGEN */}
                    <div className="flex flex-col border-[5px] border-red-500 w-[50%] items-center m-y-[4px] rounded-md shadow-lg bg-red-100 ">
                        <label className="my-2 font-bold text-lg desktop-xl:text-xl">ANTES</label>
                        <div className="flex flex-col items-end">
                            <div className="flex flex-row items-center my-2">
                                <label className="font-semibold mr-2 text-lg ">Escuela</label>
                                <div className="border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosInscriptoSelect.nro_escuela}</div>
                            </div>
                            <div className="flex flex-row items-center  my-2">
                                <label className="font-semibold mr-2 text-lg">Cargo</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosInscriptoSelect.cargo_actual}</div>
                            </div>
                            <div className="flex flex-row items-center  my-2">
                                <label className="font-semibold mr-2 text-lg">Modalidad</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl"></div>
                            </div>
                            <div className="flex flex-row items-center  my-2">
                                <label className="font-semibold mr-2 text-lg">Turno</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosInscriptoSelect.turno_actual}</div>
                            </div>
                            <div className="flex flex-row items-center  my-2">
                                <label className="font-semibold mr-2 text-lg">CUPOF</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl"></div>
                            </div>
                            <div className="flex flex-row items-center  my-2">
                                <label className="font-semibold mr-2 text-lg">Region</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl"></div>
                            </div>
                            <div className="flex flex-row items-center my-2">
                                <label className="font-semibold mr-2 text-lg">Localidad</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl"></div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">Zona</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <MdOutlineDoubleArrow className="text-2xl animate-left-disappear"/>
                    </div>
                    {/* CARGO A TOMAR */}
                    <div className="flex flex-col border-[5px] border-emerald-500 w-[50%] items-center items-center m-y-[4px] ml-[9px] rounded-md shadow-lg bg-emerald-100">
                        <label className="my-2 font-bold text-lg desktop-xl:text-xl">DESPUES</label>
                        <div className="flex flex-col items-end">
                            <div className="flex flex-row items-center my-2 ">
                                <label className="mb-0 font-semibold mr-2 text-lg ">Escuela</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">
                                    <p className="truncate ...">
                                        {datosVacanteSelect.establecimiento} {datosVacanteSelect.obs_establecimiento}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">Cargo</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50  text-base desktop-xl:text-xl">{datosVacanteSelect.cargo}</div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">Modalidad</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosVacanteSelect.modalidad}</div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">Turno</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosVacanteSelect.turno}</div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">CUPOF</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosVacanteSelect.cupof}</div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">Region</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosVacanteSelect.region}</div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">Localidad</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosVacanteSelect.localidad}</div>
                            </div>
                            <div className="flex flex-row items-center my-2 ">
                                <label className="font-semibold mr-2 text-lg">Zona</label>
                                <div className="mt-[4px] border-[1px] border-zinc-300 rounded w-[15vw] h-[4vh] pl-[4px] bg-neutral-50 text-base desktop-xl:text-xl">{datosVacanteSelect.zona}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <button
                        className="border-2 border-[#7C8EA6] mt-10 font-semibold w-40 h-8  bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2 desktop-xl:h-10 desktop-xl:text-xl"
                        onClick={()=>submitAsignarVacante()}
                        translate='no'
                        disabled={isSubmitting}
                    >ACEPTAR</button>
                    <button
                        className="border-2 border-[#7C8EA6] mt-10 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2 desktop-xl:h-10 desktop-xl:text-xl"
                        onClick={closeModalAsign}
                        translate='no'
                    >CANCELAR</button>
                    {/* <button
                        onClick={()=>procesoImpresion()}
                    >imprimir (test)</button> */}
                    <button className="font-bold hover:text-orange-500 hover:scale-150 transition-all duration-500  ">
                        <IoMdPrint 
                            title="Imprimir Designacion"
                            className="text-2xl"
                            onClick={()=>procesoImpresion()}
                        />
                    </button>
                </div>                
            </div>
        </ModalEdit>

        
        {/* MODAL DE DATOS DEL INSCRIPTO */}
        <ModalEdit isOpen={isOpenModalEdit} closeModal={closeModalEdit}>
            <div className="h-100  flex flex-col items-center">
                <label className="text-xl text-center font-semibold " translate='no'>DATOS DEL INSCRIPTO</label>
                <div className="flex flex-row">
                    {/* DATOS INSCRIPTO IZQUIERDA */}
                    <div className="min-h-[32vh] min-w-[25vw] mt-2 border-[1px] border-sky-600 bg-sky-50 rounded mr-2">
                        <div className="flex flex-col ml-2 mt-2 items-end">
                            <div className="flex flex-row mr-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">N°Orden: </label>
                                <input 
                                    className="border-[1px] border-zinc-400 w-[60mm] text-start pl-2"
                                    value={formInscripto.orden}
                                    disabled={true}
                                />
                            </div>
                            
                            <div className="flex flex-row mx-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">Apellido: </label>
                                <input 
                                    name="apellido"
                                    className="border-[1px] border-zinc-400 w-[60mm] text-start pl-2"
                                    value={formInscripto.apellido}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-row mx-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">Nombre: </label>
                                <input 
                                    name="nombre"
                                    className="border-[1px] border-zinc-400 w-[60mm] pl-2 text-start"
                                    value={formInscripto.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col ml-2 items-end">
                            <div className="flex flex-row mr-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">Puntaje: </label>
                                <input 
                                    name="total"
                                    className="border-[1px] border-zinc-400 w-[60mm] text-start pl-2"
                                    value={formInscripto.total}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-row mr-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">DNI: </label>
                                <input 
                                    name="dni"
                                    className="border-[1px] border-zinc-400 w-[60mm] pl-2 text-start"
                                    value={formInscripto.dni}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-row mx-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">Cargo Solicitado: </label>
                                <input 
                                    name="cargo_solicitado"
                                    className="border-[1px] border-zinc-400 w-[60mm] pl-2 text-start"
                                    value={formInscripto.cargo_solicitado}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-row mr-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">Legajo: </label>
                                <input 
                                    name="legajo"
                                    className="border-[1px] border-zinc-400 w-[60mm] pl-2 text-start"
                                    value={formInscripto.legajo}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col ml-2 items-end">
                            <div className="flex flex-row mr-2 my-[2px]">
                                <label className="font-semibold text-base mr-2">Observaciones: </label>
                                <input 
                                    className="border-[1px] border-zinc-400 w-[60mm] pl-2 text-start"
                                    value={formInscripto.observacion}
                                    disabled={true}
                                />
                            </div>
                            <div className="flex flex-row my-[2px]">
                                <div className="flex flex-row mr-2">
                                    <label className="font-semibold text-base mr-2">Estado: </label>
                                    <input 
                                        className="border-[1px] border-zinc-400 w-[35mm] pl-2 text-start"
                                        value={(datosInscriptoSelect?.estado_inscripto) ?datosInscriptoSelect.estado_inscripto :`` }
                                        disabled={true}
                                    />
                                </div>
                                {(datosInscriptoSelect.estado_inscripto==='' || datosInscriptoSelect.estado_inscripto===null || datosInscriptoSelect.estado_inscripto=='Ausente')
                                ?``
                                :<div className="flex flex-row items-center mr-2">
                                    <label className="text-sm italid">Asistencia</label>
                                    <button className="font-bold hover:text-orange-500 hover:scale-150 transition-all duration-500 ">
                                        <IoMdPrint 
                                            title="IMPRIMIR ASISTENCIA"
                                            className="text-2xl"
                                            onClick={()=>procesoImpresionAsistencia()}
                                        />
                                    </button>
                                </div>
                                }
                                
                            </div>
                        </div>

                        <div className="flex flex-col mx-2 my-2">
                            <div className="flex flex-row">
                                <label className="text-base font-bold">{(datosInscriptoSelect.id_vacante_generada_cargo_actual!=null) ?`Cargo que dejó` :`Cargo Actual`}</label>
                                <label className="ml-2 italic text-red-500">{(datosInscriptoSelect.genera_vacante==='NO') ?`No genera vacante` :``}</label>
                            </div>
                            <div className="flex flex-col border-[1px] border-orange-500 rounded py-[2px] bg-orange-50 items-end">
                                <div className="flex flex-row mr-2 my-[2px]">
                                    <label className="text-base mr-2">Cargo Actual: </label>
                                    <input 
                                        name="cargo_actual"
                                        className="border-[1px] border-orange-400 w-[60mm] pl-2 text-start"
                                        value={formInscripto.cargo_actual}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-row mr-2 my-[2px]">
                                    <label className="text-base mr-2">Turno: </label>
                                    <input 
                                        name="turno_actual"
                                        className="border-[1px] border-orange-400 w-[60mm] pl-2 text-start"
                                        value={formInscripto.turno_actual}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-row mx-2 my-[2px]">
                                    <label className="text-base mr-2">Escuela: </label>
                                    <input 
                                        name="nro_escuela"
                                        className="border-[1px] border-orange-400 w-[60mm] pl-2 text-start"
                                        value={formInscripto.nro_escuela}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-row">
                                    {
                                        (datosInscriptoSelect.id_vacante_generada_cargo_actual!=null)
                                        ?<div className="flex flex-row mr-2 my-[2px]">
                                            <label className="text-base mr-2">N° Vac:</label>
                                            <input 
                                                name="nro_escuela"
                                                className="border-[1px] border-orange-400 w-[50mm] pl-2 text-start"
                                                value={datosInscriptoSelect.id_vacante_generada_cargo_actual}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        :``
                                    }
                                    {
                                        (datosInscriptoSelect.vacante_asignada===null && datosInscriptoSelect.id_vacante_generada_cargo_actual!=null && asignacionCargoOriginal.length===0)
                                        ?<div className="flex flex-col mx-2 justify-center">
                                            <IoTrash 
                                                className="font-bold text-xl text-red-500 hover:scale-150 transition-all duration-500 blink cursor-pointer"
                                                title="Eliminar Vacante Generada"
                                                onClick={()=>submitEliminarVacanteMov(datosInscriptoSelect.id_vacante_generada_cargo_actual)}
                                            />
                                        </div>
                                        :``
                                    }
                                </div>
                            </div>

                        </div>
                        
                    </div>

                    {/* CARGO QUE TOMO - PARTE DERECHA */}
                    {/* DATOS DE CARGO TOMADO - SI SE LE ASIGNO VACANTE */}
                    {(datosInscriptoSelect.vacante_asignada!=null && datosInscriptoSelect.vacante_asignada!='') &&
                    <div className="h-[40vh] min-w-[23vw] mt-2 border-[1px] border-emerald-500 text-center rounded bg-emerald-50">
                        {/* Titulo y Encabezado con iconos */}
                        <div className="flex flex-row mb-2">
                            <div className="w-[20%] "></div>
                            <div className="w-[60%] ">
                                <label className="text-lg text-center font-bold text-green-700" translate='no'>Cargo que tomó</label>
                            </div>
                            <div className="flex flex-row w-[20%] justify-end">
                                <button className="font-bold text-xl mr-2 hover:text-sky-500 hover:scale-150 transition-all duration-500">
                                    <IoMdPrint 
                                        title="IMPRIMIR DESIGNACION"
                                        onClick={()=>procesoImpresion()}
                                    />
                                </button>
                                {(userSG.permiso!=3 && userSG.permiso!=4) &&
                                    <button className="font-bold text-lg mr-4 hover:text-red-500 hover:scale-150 transition-all duration-500">
                                        <IoTrash 
                                            title="ELIMINAR"
                                            onClick={()=>submitEliminarTomaCargo(cargoAsignado.id_asignacion_mov)}
                                        />
                                    </button>
                                }
                            </div>
                        </div>
                        {/* Datos a mostrar: Escuela, cargo, modalidad, turno, region, localidad, zona */}
                        <div className="flex flex-col items-end">
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">ID Vacante:</label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">{cargoAsignado.id_vacante_mov}</div>
                            </div>
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">Escuela: </label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">
                                    <p className="truncate ...">
                                        {cargoAsignado.establecimiento} {cargoAsignado.obs_establecimiento}
                                    </p>
                                </div>
                            </div>
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">Cargo: </label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">{cargoAsignado.cargo}</div>
                            </div>
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">Modalidad: </label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">{cargoAsignado.modalidad}</div>
                            </div>
                        </div>    
                        <div className="flex flex-col items-end">
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">Turno: </label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">{cargoAsignado.turno}</div>
                            </div>
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">Region: </label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">{cargoAsignado.region}</div>
                            </div>
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">Localidad: </label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">{cargoAsignado.localidad}</div>
                            </div>
                            <div className="text-start mr-2 flex flex-row my-[2px]">
                                <label className="font-semibold text-base mr-2">Zona: </label>
                                <div className="border-[1px] border-zinc-400  w-[40mm] h-[7mm] pl-[4px] bg-neutral-50">{cargoAsignado.zona}</div>
                            </div>
                        </div>
                    </div>
                    }

                </div>
                {/* AVISO DE ALERTA */}
                {
                    (datosInscriptoSelect.vacante_asignada===null && datosInscriptoSelect.id_vacante_generada_cargo_actual!=null)
                    ?(asignacionCargoOriginal.length!=0)
                        ?<div className="w-[50vw]">
                            <label className="text-red-500 font-semibold ">Realice Toma de Cargo de Vacante Disponible. Si va a quedarse con su Cargo Original, elimine la asignacion del docente que tomo su cargo original.</label>
                        </div>
                        :<div className="w-[50vw]">
                            <label className="text-red-500 font-semibold ">Su Cargo Original genero una Vacante Disponible, elimine la vacante generada o realice Toma de Cargo de una Vacante</label>
                        </div>
                    :(datosInscriptoSelect.legajoEnOtroNivel!=null)
                        ?<div className="w-[50vw]">
                            <label className="text-red-500 font-semibold ">EL DOCENTE YA TOMO CARGO EN OTRO NIVEL.</label>
                        </div>
                        :``
                }


                {/* DATOS DE CARGO ORIGINAL TOMADO POR OTRO DOCENTE */}
                {/* Solo se muestra si su cargo original fue tomado por otro docente */}
                {(datosInscriptoSelect.id_tipo_inscripto!=1 && asignacionCargoOriginal.length!=0) &&
                <div className="h[10vh] min-w-[50vw] mt-2 border-[1px] border-orange-500 bg-orange-50 text-center rounded">
                <label className="text-lg text-center font-semibold " translate='no'>Docente que tomo su Cargo Original</label>
                
                {/* datos a mostrar: id vacante creada, id_inscripto que tomo su cargo, apellido, nombre, dni */}
                    <div className="flex flex-row mb-2">
                        <div className="text-start ml-2">
                            <label className="font-semibold text-sm">Id Vacante</label>
                            <div className="mt-[-4px] border-[1px] border-zinc-500 rounded w-[6vw] h-[4vh] pl-[4px]">{asignacionCargoOriginal[0].id_vacante_mov}</div>
                        </div>
                        <div className="text-start ml-2">
                            <label className="font-semibold text-sm">Apellido</label>
                            <div className="mt-[-4px] border-[1px] border-zinc-500 rounded w-[15vw] h-[4vh] pl-[4px] ">{asignacionCargoOriginal[0].apellido}</div>
                        </div>
                        <div className="text-start ml-2">
                            <label className="font-semibold text-sm">Nombre</label>
                            <div className="mt-[-4px] border-[1px] border-zinc-500 rounded w-[15vw] h-[4vh] pl-[4px] ">{asignacionCargoOriginal[0].nombre}</div>
                        </div>
                        <div className="text-start mx-2">
                            <label className="font-semibold text-sm">Dni</label>
                            <div className="mt-[-4px] border-[1px] border-zinc-500 rounded w-[10vw] h-[4vh] pl-[4px] ">{asignacionCargoOriginal[0].dni}</div>
                        </div>
                    </div>    
                </div>
                }                

                {/* VISIBILIDAD DE BOTONES */}
                <div className="flex justify-center">
                    {(estadoForm==='ver') &&
                        <button
                            className="border-2 border-[#7C8EA6] mt-5 font-semibold w-40 h-8 bg-[#7C8EA6] text-white hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                            onClick={closeModalEdit}
                            translate='no'
                        >CERRAR</button>
                    }
                    {(estadoForm==='editar') &&
                        <div>
                            <button
                                className="border-2 border-[#7C8EA6] mt-5 font-semibold w-40 h-8 bg-[#7C8EA6] text-white hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={()=>submitGuardarCambiosFormInscripto()}
                                translate='no'
                            >GUARDAR</button>
                            <button
                                className="border-2 border-[#7C8EA6] mt-5 font-semibold w-40 h-8 bg-[#7C8EA6] text-white hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={()=>valoresInicialesFormInscripto()}
                                translate='no'
                            >CANCELAR</button>
                        </div>
                    }

                </div>

            </div>
        </ModalEdit>

        {/* MODAL DE NOTIFICACION Y CONFIRMACION DE IMPRESION DESIGNACION */}
        <ModalEdit isOpen={isOpenModalConfirm} closeModal={closeModalConfirm}>
            <div className="mt-10 w-[30vw] flex flex-col items-center">
                <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1>
                <div className="flex flex-row">
                    <div className="flex justify-center mr-2">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>{procesoImpresion(); submitCloseModalConfirm()}}
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


        {/* MODAL DE NOTIFICACIONES */}
        <Modal isOpen={isOpenModalDatos} closeModal={closeModalDatos}>
            <div className="mt-10 w-full flex flex-col items-center">
                <h1 className="text-xl text-center font-bold">{mensajeModalDatos}</h1>
                <div className="flex flex-col mt-4 items-end border-[1px] border-orange-500 p-2 rounded bg-orange-50">
                    <div className="text-start mx-2 flex flex-row items-center my-[2px] ">
                        <label className="font-semibold text-base mr-2">Establecimiento:</label>
                        <div className="border-[1px] border-zinc-400  w-[45mm] h-[7mm] pl-[4px] flex items-center">
                            <p className="truncate ...">{datosValidaDni?.vac_establecimiento} {datosValidaDni?.vac_obs_establecimiento}</p>
                        </div>
                    </div>
                    <div className="text-start mx-2 flex flex-row items-center my-[2px]">
                        <label className="font-semibold text-base mr-2">Cargo:</label>
                        <div className="border-[1px] border-zinc-400  w-[45mm] h-[7mm] pl-[4px] flex items-center">{datosValidaDni?.vac_cargo}</div>
                    </div>
                    <div className="text-start mx-2 flex flex-row items-center my-[2px]">
                        <label className="font-semibold text-base mr-2">Modalidad:</label>
                        <div className="border-[1px] border-zinc-400  w-[45mm] h-[7mm] pl-[4px] flex items-center">{datosValidaDni?.vac_modalidad}</div>
                    </div>
                    <div className="text-start mx-2 flex flex-row items-center my-[2px]">
                        <label className="font-semibold text-base mr-2">Turno:</label>
                        <div className="border-[1px] border-zinc-400  w-[45mm] h-[7mm] pl-[4px] flex items-center">{datosValidaDni?.vac_turno}</div>
                    </div>
                    <div className="text-start mx-2 flex flex-row items-center my-[2px]">
                        <label className="font-semibold text-base mr-2">Region:</label>
                        <div className="border-[1px] border-zinc-400  w-[45mm] h-[7mm] pl-[4px] flex items-center">{datosValidaDni?.vac_region}</div>
                    </div>
                    <div className="text-start mx-2 flex flex-row items-center my-[2px]">
                        <label className="font-semibold text-base mr-2">Localidad:</label>
                        <div className="border-[1px] border-zinc-400  w-[45mm] h-[7mm] pl-[4px] flex items-center">
                            <p className="truncate ...">
                                {datosValidaDni?.vac_localidad}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                        onClick={()=>SubmitCloseModalDatos()}
                    >OK</button>
                </div>
            </div>
        </Modal>


        {/* PAGINA DE IMPRESION DESIGNACION */}
        <div 
            className="flex flex-col print:page-break-after"
            ref={componentRef}
        >
            <PaginaDesignacion
                datosInscripto={datosInscriptoSelect}
                datosVacante={datosVacanteSelect}
                id_nivel={configSG?.nivel.id_nivel}
            />
            <br/>
            {/* <PaginaDesignacion
                datosInscripto={datosInscriptoSelect}
                datosVacante={datosVacanteSelect}
                id_nivel={configSG?.nivel.id_nivel}
            /> */}
        </div>

        {/* PAGINA IMPRESION ASISTENCIA */}
        <div 
            className="flex flex-col print:page-break-after"
            ref={componentRefAsistencia}
        >
            <PaginaAsistencia
                datosInscripto={datosInscriptoSelect}
                datosVacante={datosVacanteSelect}
                id_nivel={configSG?.nivel.id_nivel}
            />
        </div>

        </div>
    )
};

export default InscriptosMov;