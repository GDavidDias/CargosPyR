import { useNavigate } from "react-router-dom";
import Paginador from "../Paginador/Paginador";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

//----------ICONOS
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import { BiTransferAlt } from "react-icons/bi";

import { fetchAllEspecialidades } from "../../utils/fetchAllEspecialidades";
import { fetchAllInscriptosPyR } from "../../utils/fetchAllInscriptosPyR";
import { fetchAllVacantesPyR } from "../../utils/fetchAllVacantesPyR";
import { useModal } from "../../hooks/useModal";
import ContentModalDatosInscriptoPyR from "../ContentModalDatosInscriptoPyR/ContentModalDatosInscriptoPyR";

const InscriptosPyR = () =>{

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //E.G que trae la configuracion de sistema
    const configSG = useSelector((state)=>state.config);
    const userSG = useSelector((state)=>state.user);    

    //VENTANAS MODALES
    const[isOpenModalEdit,openModalEdit,closeModalEdit]=useModal(false);

    //ESTADOS LOCALES Y VARIABLES

    //E.L. guardo el id del lsitado de vacantes de Provsionaels y Reemplazantes
    const[idListadoVacantesPyR, setIdListadoVacantesPyR]=useState('');

    //estado que guarda el estado de especialidad
    const[selectFiltroEspecialidad, setSelectFiltroEspecialidad]=useState("");

    //estado que guarda estado de especialidad para vacantes
    const[filtroEspecialidadVac, setFiltroEspecialidadVac]=useState("");

    //E.L. guarda la pagina actual de listado Inscriptos
    const[currentPage, setCurrentPage]=useState(1);
    //E.L. para guardar datos de paginacion de listado Inscriptos
    const[paginacion, setPaginacion]=useState('');

    //E.L. guarda la pagina actual de listado Vacantes
    const[currentPageVac, setCurrentPageVac]=useState(1);
    //E.L. para guardar datos de paginacion de listado Vacantes
    const[paginacionVac, setPaginacionVac]=useState('');

    //E.L. donde se almacena el listado de especialidades
    const[listadoEspecialidades, setListadoEspecialidades]=useState([]);

    //E.L. para filtro de estado de los incriptos
    //puede ser: "todos", "sinasignar" o "asignados"
    const[estadoInscripto, setEstadoInscripto]=useState('todos');

    //E.L. para input busqueda Inscriptos
    const[inputSearch, setInputSearch]=useState('');

    //E.L. donde se almacena el Listado de Inscriptos (carga inicial)
    //y segun el tipo de listado segun configuracion
    const[listadoInscriptosPyR, setListadoInscriptosPyR]=useState([]);

    //E.L donde se almacena listado de vacants disponibles
    const[listadoVacantesDispPyR,setListadoVacantesDispPyR]=useState([]);    

    //EL guardo el id del listado de inscriptos de titularizacion
    const[idListadoInscriptosPyR, setIdListadoInscriptosPyR]=useState('');

    const componentRef = useRef(null);
    const componentRefAsistencia = useRef(null);

    //E.L. para input busqueda Vacantes
    const[inputSearchVac, setInputSearchVac]=useState('');

    const[datosInscriptoSelect, setDatosInscriptoSelect]=useState({});

    const[cargoAsignado, setCargoAsignado]=useState('');

    const[datosVacante, setDatosVacante]=useState({});
    const[idInscriptoSelect, setIdInscriptoSelect]=useState('');
    //---------------------------------------------------------
    //PROCESOS Y FUNCIONES

    //Proc que trae el ID del listado configurado
    const buscoIdlistadoInscrip = async(id_nivel) =>{
        //Filtro configuracion para el nivel
        const configFilterNivel = await configSG.config.filter((configNivel)=>configNivel.id_nivel==id_nivel);
        //console.log('que trae configFilterNivel: ', configFilterNivel);

        //Traigo el id_listado cargado en configuracion para:
        //LISTADO DE INSCRIPTOS DE PROVISIONALES Y REEMPLAZANTES -> id_listado_inscriptos_pr
        const idFilterListado = configFilterNivel[0]?.id_listado_inscriptos_pr;
        //console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo el id del listado de inscriptos
        setIdListadoInscriptosPyR(idFilterListado);

        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO
        await getInscriptosPyR(idFilterListado,currentPage,estadoInscripto,inputSearch,selectFiltroEspecialidad);
        
    };


    //Este Proc carga el listado de inscriptos_tit al E.L
    const getInscriptosPyR = async(id_listado,page,filtroAsignacion,valorBusqueda,filtroEspecialidad) =>{
        let data;
        const limit=10;
        console.log('que trae id_listado getInscriptosPyRListado: ', id_listado);
        if(id_listado){
            //paso id_listado, limit y page
            data = await fetchAllInscriptosPyR(id_listado, limit, page,filtroAsignacion, valorBusqueda,filtroEspecialidad);
            console.log('que trae data de fetchAllInscriptosPyR: ', data);

            if(data.result?.length!=0){
                setListadoInscriptosPyR(data.result); 
                setPaginacion(data.paginacion);
            }else{
                setListadoInscriptosPyR([]);
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
        console.log('que trae configFilterNivel: ', configFilterNivel);

        //Traigo el id del listado cargado en configuracion para:
        //LISTADO DE VACANTES DE PYR -> id_listado_vacantes_pr
        const idFilterListado = configFilterNivel[0]?.id_listado_vacantes_pr;
        console.log('que tiene idFilterListado: ',idFilterListado);

        //Guardo id_listado_vacantes_tit para usarlo despues
        setIdListadoVacantesPyR(idFilterListado);

        //LLAMO AL PROCEDIMIENTO PARA TRAER EL LISTADO DE VACANTES DISPONIBLES
        await getVacantesDisponiblesPyR(idFilterListado, currentPageVac,'disponibles',filtroEspecialidadVac,inputSearchVac)
    };


    //Este Proc carga el listado de VACANTES Disponibles al E.L
    const getVacantesDisponiblesPyR = async(id_listado,page,filtroAsignacion,filtroEspecialidad,valorBusqueda, filtroRegion, filtroModalidad) =>{
        console.log('que ingresa a id_listado: ', id_listado);
        console.log('que ingresa a page: ', page);
        console.log('que ingresa a filtroAsignacion: ', filtroAsignacion);
        console.log('que ingresa a filtroEspecialidad: ', filtroEspecialidad);
        console.log('que ingresa a valorBusqueda: ', valorBusqueda);
        console.log('que ingresa a filtroRegion: ', filtroRegion);
        console.log('que ingresa a filtroModalidad: ', filtroModalidad);
        let data;
        const limit=10;
        //console.log('que trae id_listado getVacantesDisponiblesMov: ', id_listado);
        if(id_listado){
            data = await fetchAllVacantesPyR(id_listado,limit,page, filtroAsignacion, filtroEspecialidad, valorBusqueda, filtroModalidad, filtroRegion);
            console.log('que trae data de fetchAllVacantesPyR: ', data);

            if(data.result?.length!=0){
                setListadoVacantesDispPyR(data.result); 
                setPaginacionVac(data.paginacion);
            }else{
                setListadoVacantesDispPyR([]);
                setPaginacionVac(data.paginacion);
            }
        };
    }; 

    //--------Proceso de seleccion de especialidad
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


    const handlePageChange = (nuevaPagina)=>{
        if(nuevaPagina>0 && nuevaPagina<=paginacion?.totalPages){
            setCurrentPage(nuevaPagina);
        };
    };

    const handleCancelFiltroEspecialidadLuom =()=>{
        setSelectFiltroEspecialidad("");
        setCurrentPage(1);
    };

    const submitVerDatosInscripto = async(datosInscripto)=>{
        //console.log('presiono en submitVerDatosInscripto');
        //console.log('que tiene datos inscripto: ', datosInscripto);
        setDatosInscriptoSelect(datosInscripto);
        //traigo datos de la vacante asignada
        if(datosInscripto.vacante_asignada!=null && datosInscripto.vacante_asignada!=''){
            //console.log('TIENE CARGO ASIGNADO');
            const data = await fetchVacanteAsignadaTit(datosInscripto.vacante_asignada);
            console.log('que trae data de fetchVacanteAsignadaPyR: ',data);
            setCargoAsignado(data[0]);
            setDatosVacante(data[0])
        }else{
            setCargoAsignado('');
            setDatosVacante({})
        }

        openModalEdit();
    };    


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
                                    listadoInscriptosPyR?.map((inscripto, index)=>{
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
                <ContentModalDatosInscriptoPyR
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
            {/* <ModalEdit isOpen={isOpenModalVac} closeModal={closeModalVac}>
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
                    //Procesos de filtros de region
                    handleSelectFiltroRegion = {handleSelectFiltroRegion}
                    filtroRegionVac = {filtroRegionVac}
                    handleCancelFiltroRegionVac = {handleCancelFiltroRegionVac}
                    //Procesos de Filtros de Modalidad
                    handleSelectFiltroModalidad={handleSelectFiltroModalidad}
                    filtroModalidadVac={filtroModalidadVac}
                    handleCancelFiltroModalidadVac={handleCancelFiltroModalidadVac}
                />
            </ModalEdit> */}

            {/* MODAL DE ASIGNACION VACANTE */}
            {/* <ModalEdit isOpen={isOpenModalAsign} closeModal={closeModalAsign}>
                <ContentModalAsignacionTit
                    closeModalAsign={closeModalAsign}
                    datosInscriptoSelect={datosInscriptoSelect}
                    datosVacanteSelect={datosVacante}
                    procesoImpresion={procesoImpresion}
                    submitAsignarVacante={submitAsignarVacante}
                />
            </ModalEdit> */}

            {/* PAGINA DE IMPRESION DESIGNACION */}
            <div 
                className="flex flex-col print:page-break-after"
                ref={componentRef}
            >
                {/* <PaginaDesignacionTitular
                    datosInscripto={datosInscriptoSelect}
                    datosVacante={datosVacante}
                    id_nivel={configSG?.nivel.id_nivel}
                /> */}
            </div>

            {/* PAGINA DE IMPRESION ASISTENCIA */}
            <div 
                className="flex flex-col print:page-break-after"
                ref={componentRefAsistencia}
            >
                {/* <PaginaAsistenciaTitular
                    datosInscripto={datosInscriptoSelect}
                    datosVacante={datosVacante}
                    id_nivel={configSG?.nivel.id_nivel}
                /> */}
            </div>

            {/* MODAL DE NOTIFICACION Y CONFIRMACION DE IMPRESION DESIGNACION */}
            {/* <ModalEdit isOpen={isOpenModalConfirm} closeModal={closeModalConfirm}>
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
            </ModalEdit> */}


            {/* MODAL DE NOTIFICACIONES */}
            {/* <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-10 w-72">
                    <h1 className="text-xl text-center font-bold">{mensajeModalInfo}</h1>
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>submitCloseModal()}
                        >OK</button>
                    </div>
                </div>
            </Modal> */}
        </div>
    )
};

export default InscriptosPyR;