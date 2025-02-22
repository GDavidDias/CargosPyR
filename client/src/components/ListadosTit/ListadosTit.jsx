import { useSelector } from "react-redux";
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

//-------ICONOS--------
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import ReporteVacantesDisponibles from "../ReporteVacantesDisponibles/ReporteVacantesDisponibles";
import ReporteAsignacionesRealizadas from "../ReporteAsignacionesRealizadas/ReporteAsignacionesRealizadas";
import { fetchRepoAsignacionesRealizadas } from "../../utils/fetchRepoAsignacionesRealizadas";
import { fetchVacantesDispTit } from "../../utils/fetchVacantesDispTit";
import { fetchAllAsignacionesRealizadasTit } from "../../utils/fetchAllAsignacionesRealizadasTit";
import ReporteAsignacionesRealizadasTit from "../ReporteAsignacionesRealizadasTit/ReporteAsignacionesRealizadasTit";
import { fetchEstadoInscriptosTit } from "../../utils/fetchEstadoInscriptosTit";
import ReporteEstadoInscriptosTit from "../ReporteEstadoInscriptosTit/ReporteEstadoInscriptosTit";
import ReporteVacantesDisponiblesTit from "../ReporteVacantesDisponiblesTit/ReporteVacantesDisponiblesTit";

const ListadosTit = () => {

    const componentRef = useRef(null);
    const navigate = useNavigate();
    //EstadosGlogales
    const configSG = useSelector((state)=> state.config);
    const userSG = useSelector((state)=> state.user);

    //E.L guardo el id del listado de vacantes
    const[idListVacMov,setIdListVacMov]=useState();
    
    const[listado, setlistado]=useState([]);
    const[listadoFormat, setlistadoFormat]=useState([]);

    const[reporte, setReporte]=useState('');


    const logOut = () =>{
        navigate('/')
    };

    //Proc: traigo el ID del listado de Vacantes Configurado
    const buscoIDListadoVacantes = async(id_nivel) =>{
        //Filtro configuracion para el nivel
        const configFilterNivel = await configSG.config.filter((configNivel)=>configNivel.id_nivel==id_nivel);
        console.log('que trae configFilterNivel: ', configFilterNivel);

        //Traigo el id del listado cargado en configuracion para:
        //LISTADO DE VACANTES DE MOVIMIENTOS -> id_listado_vacantes_tit
        const idFilterListado = configFilterNivel[0]?.id_listado_vacantes_tit;
        console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo id_listado_vacantes_mov para usarlo en nueva Vacante
        setIdListVacMov(idFilterListado);
    };

    const submitVacDisponibles= async()=>{
        console.log('presiono vacantes disponibles')
        //traigo datos y guardo en store local
        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE VACANTES TITULARIZACION
        const limit = 999999;
        const page = 1;
        const valorBusqueda = "";
        const filtroEspecialidad = "";
        const orderBy = "";
        
        const data = await fetchVacantesDispTit(idListVacMov,limit,page,valorBusqueda,filtroEspecialidad,orderBy);
        console.log('que trae data de fetchVacantesDispMov: ', data.result);
        if(data.result.length!=0){
            setlistado(data.result);
        }
    };

    const submitAsignacionesRealizadas=async()=>{
        console.log('presiono asignaciones realizadas');
        //traigo datos y guardo en store local
        //setlistado([])
        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE ASIGNACIONES REALIZADAS        
        const data = await fetchAllAsignacionesRealizadasTit(idListVacMov);
        console.log('que trae data de fetchRepoAsignacionesRealizadas: ', data);
        if(data.length!=0){
            setlistado(data);
        }
    };

    const submitEstadoInscriptos=async()=>{
        console.log('presiono sobre estado inscriptos');
        //traigo datos de estado inscriptos y guardo en store local
        const limit = 999999;
        const page = 1;
        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE ESTADOS DE INSCRIPTOS
        const data = await fetchEstadoInscriptosTit(idListVacMov, limit, page);
        console.log('que trae data de fetchEstadoInscriptosTit: ', data.result);
        if(data.result.length!=0){
            setlistado(data.result);
        }
    };

    const handlePrint = useReactToPrint({
        content:() => componentRef.current,
        pageStyle:`
        @page {
          size: legal landscape; /* Tamaño del papel */
          orientation: landscape; /* Orientación horizontal */
        }
        @media print {
            table {
                page-break-inside: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
        }
      `
    }); 

    
    // Función para exportar la tabla a un archivo Excel
    const handleExportToExcel = () => {
        // Crea una hoja de cálculo
        let worksheet;
        if(reporte==='asignacionesRealizadas'){
            worksheet = XLSX.utils.json_to_sheet(formateaListadoAsignacionesRealizadas(listado));
        }else if(reporte==='vacantesDisponibles'){
            worksheet = XLSX.utils.json_to_sheet(formateaListadoVacantesDisponibles(listado));
        }else if(reporte==='estadoinscriptos'){
            worksheet = XLSX.utils.json_to_sheet(formateaListadoEstadoInscriptos(listado));
        }
        
        const workbook = XLSX.utils.book_new();
    
        // Agrega la hoja de cálculo al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    
        // Genera el archivo Excel y descarga
        let nombreArchivo;
        if(reporte==='asignacionesRealizadas'){
            nombreArchivo='Asignaciones Realizadas'
        }else if(reporte==='vacantesDisponibles'){
            nombreArchivo='Vacantes Disponibles'
        }else if(reporte==='estadoinscriptos'){
            nombreArchivo='Listado del Estado de Inscriptos'
        }
        XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
    }; 

    function formateaListadoVacantesDisponibles (datos){
        const datosformat = datos.map(objeto=>({
            'Orden':objeto.orden, 
            'Cargo':objeto.cargo, 
            'Cupof':objeto.cupof, 
            'N° Escuela': objeto.nro_establecimiento, 
            'Nombre Escuela':objeto.nombre_establecimiento, 
            'Turno':objeto.turno, 
            'Modalidad':objeto.modalidad, 
            'Region':objeto.region, 
            'Departamento':objeto.departamento, 
            'Localidad':objeto.localidad, 
            'Zona':objeto.zona, 
            'Resolucion':objeto.resolucion
        }));
        return datosformat;
    };

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const year = date.getFullYear();
      
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
      };

    function formateaListadoAsignacionesRealizadas (datos){
        const datosformat = datos.map(objeto=>({
            'Dni':objeto.dni, 
            'Total':objeto.total, 
            'Nombre':objeto.apellido, 
            'Observacion':objeto.observacion, 
            'N° Escuela Actual':objeto.nro_escuela_actual, 
            'Cargo Actual':objeto.cargo_actual, 
            'Cargo Solicitado':objeto.cargo_solicitado, 
            'Fecha y Hora Designacion':formatDateTime(objeto.datetime_asignacion),
            'Cargo que Toma':objeto.cargo_toma, 
            'Turno':objeto.turno,
            'Modalidad':objeto.modalidad,
            'Cupof':objeto.cupof,
            'N° Escuela que Toma':objeto.nro_escuela_toma, 
            'Region':objeto.region,
            'Departamento':objeto.departamento,
            'Localidad':objeto.localidad,
            'Zona':objeto.zona,
            'Resolucion':objeto.resolucion
            
        }));
        return datosformat;
    };


    function formateaListadoEstadoInscriptos (datos){
        const datosformat = datos.map(objeto=>({
            'Dni':objeto.dni, 
            'Total':objeto.total,
            'Nombre Docente':objeto.apellido, 
            'Especialidad':objeto.especialidad, 
            'Estado':objeto.descripcion_estado_inscripto, 
            /*'descripcion':objeto.descripcion, 
            'id_especialidad':objeto.id_especialidad, 
            'id_estado_inscripto':objeto.id_estado_inscripto, 
            'id_inscriptos_tit':objeto.id_inscriptos_tit,
            'id_listado_inscriptos':objeto.id_listado_inscriptos, 
            'nombre':objeto.nombre,
            'orden':objeto.orden,
            'vacante_asignada':objeto.vacante_asignada, */
            
        }));
        return datosformat;
    };


    useEffect(()=>{
        setlistado([]);
        if(reporte==='asignacionesRealizadas'){
            submitAsignacionesRealizadas();
        }else if(reporte==='vacantesDisponibles'){
            submitVacDisponibles();
        }else if(reporte==='estadoinscriptos'){
            submitEstadoInscriptos();
        }
    },[reporte])


    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //LLAMO AL PROCEDIMIENTO buscoIDListadoVacantes Y PASO EL NIVEL CARGADO EN STORE GLOBAL
        buscoIDListadoVacantes(configSG.nivel.id_nivel);
    },[])

    return(
        <div className="notranslate">
            {/* ENCABEZADO PAGINA */}
            <div className="bg-[#C9D991] h-[8vh] flex flex-row ">
                {/* TITULOS - BOTONES - NIVEL */}
                <div className="w-[55vw] flex justify-center items-start flex-col">
                    <label className="ml-4 text-base font-semibold">NIVEL {configSG.nivel.descripcion}</label>
                    <div className="flex flex-row">
                        <label className="ml-4 text-lg font-sans font-bold">LISTADOS Y REPORTES TITULARIZACION</label>
                    </div>
                </div>
                {/* SECCION DATOS USUARIO */}
                <div className=" w-[30vw] flex items-center justify-end">
                    <label className="mr-2 italic text-sm">{userSG.nombre}</label>
                    <FaRegUserCircle className="mr-2 text-2xl text-[#73685F] " />
                    <FaPowerOff 
                        className="mr-4 text-2xl text-[#73685F] hover:cursor-pointer hover:text-[#7C8EA6] transition-transform duration-500 transform hover:scale-125"
                        title="Salir"
                        onClick={()=>logOut()}
                    />
                </div>
            </div>

            {/* CONTENIDO DE PAGINA - ENCABEZADO */}
            <div className="h-[6vh] border-b-2 border-zinc-400 py-2 shadow-md flex flex-row justify-between">
                <div className=" flex flex-row">
                    <button 
                        className={`ml-2 px-[2px] border-[1px] border-[#73685F] rounded hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] shadow
                            ${(reporte==='asignacionesRealizadas')
                                ?`bg-[#7C8EA6] text-white border-[#7C8EA6]`
                                :``
                            }
                            `}
                        onClick={()=>setReporte('asignacionesRealizadas')}
                    >Asignaciones Realizadas</button>
                    <button 
                        className={`ml-2 px-[2px] border-[1px] border-[#73685F] rounded hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] shadow
                            ${(reporte==='vacantesDisponibles')
                                ?`bg-[#7C8EA6] text-white border-[#7C8EA6]`
                                :``
                            }
                            `}
                        onClick={()=>setReporte('vacantesDisponibles')}
                    >Vacantes Disponibles</button>
                    <button 
                        className={`ml-2 px-[2px] border-[1px] border-[#73685F] rounded hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] shadow
                            ${(reporte==='estadoinscriptos')
                                ?`bg-[#7C8EA6] text-white border-[#7C8EA6]`
                                :``
                            }
                            `}
                        onClick={()=>setReporte('estadoinscriptos')}
                    >Estado de Inscriptos</button>
                </div>
                <div className="flex flex-row mr-4">
                    {/* <button
                        className="ml-2 px-[2px] border-[1px] border-[#73685F] rounded hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] shadow"
                        onClick={handlePrint}
                    >Imprimir</button> */}
                    <button
                        className={`ml-2 px-[2px] border-[1px] border-[#73685F] rounded   shadow
                            ${(listado.length!=0)
                                ?`hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6]`
                                :`bg-gray-300 text-white border-gray-300`
                            }
                            `}
                        disabled={listado.length===0}
                        onClick={handleExportToExcel}
                    ><SiMicrosoftexcel/></button>
                </div>
            </div>

            {/* CONTENIDO DE PAGINA - DATOS */}
            <div 
                className="h-[79vh] overflow-y-auto m-2 border-[1px] border-[#7C8EA6] "
                ref={componentRef}
            >
                {(reporte==='vacantesDisponibles') &&
                    <ReporteVacantesDisponiblesTit
                    listado={listado}
                    />
                }
                {(reporte==='asignacionesRealizadas') &&
                    <ReporteAsignacionesRealizadasTit
                        listado={listado}
                    />
                }
                {(reporte==='estadoinscriptos') &&
                    <ReporteEstadoInscriptosTit
                        listado={listado}
                    />
                    
                }
                
            </div>
        </div>
    )
};

export default ListadosTit;