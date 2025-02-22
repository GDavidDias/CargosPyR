import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchAllEspecialidades } from '../../utils/fetchAllEspecialidades';
import {URL} from '../../../varGlobal';
import io from 'socket.io-client';


//-------ICONOS--------
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";

const connectSocketServer = () =>{
    const socket = io(`${URL}`,{
        transports:['websocket']
    });
    //const socket = io(`${URL}`);
    return socket;
};

// const socket = io(`${URL}`,{
//     transports: ['websocket']
// });

//const socket = io.connect(`${URL}`);

const VacMovDoc = () => {
    //const[socket]=useState(connectSocketServer());
    const userSG = useSelector((state)=>state.user);    
    const configSG = useSelector((state)=>state.config);

    //E.L. donde se almacena el listado de especialidades
    const[listadoEspecialidades, setListadoEspecialidades]=useState([]);

    //E.L. donde guarda la especialidad seleccionada
    const[filtroEspecialidadVac, setFiltroEspecialidadVac]=useState("");

    //E.L. para filtro de estado de las vacantes
    //puede ser: "todas", "disponibles" o "asignadas"
    const[estadoVacantes, setEstadoVacantes]=useState('todas');
    
    //E.L. para cuadro de busqueda
    const[inputSearch, setInputSearch]=useState('');    

    //E.L. donde se almacena el listado de Vacantes  (carga inicial)
    //y segun el tipo de listado de vacantes indicado en configuracion
    const[listadoVacantesMov, setListadoVacantesMov]=useState([]);

    //E.L para aplicar filtros sobre el listado de Vacantes
    const[filterListadoVacantesMov, setFilterListadoVacantesMov]=useState([]);

    const [vacantes, setVacantes] = useState([]);
    

    const handleSelectFiltroEspecialidad=(event)=>{
        const{value} = event.target;
        console.log('que tiene filtroEspecialidad: ', value);
        setFiltroEspecialidadVac(value);
        
        //setCurrentPage(1);
        //al seleccionar una especialidad, regrso a la primer pagina, por si no hay tantos inscriptos
        
    };

    //Este Proc carga el listado de especialidades en E.L.
    const cargaEspecidalidades=async()=>{
        const data = await fetchAllEspecialidades();
        //console.log('que tiene especialidades: ', data);
        if(data?.length!=0){
            setListadoEspecialidades(data);
        }
    };   
    
    const handleCancelFiltroEspecialidadVac =()=>{
        setFiltroEspecialidadVac("");
    };

    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setInputSearch(value);
    };

    const handleCancelSearch =()=>{
        setInputSearch('');
        //aplicoFiltroListadoVacantes(listadoVacantesMov);
    };

    //----------------------------------------
    //------USE EFFECT DE SOCKET
    // useEffect(()=>{
    //     // socket.on('current-vacantes', (vacantes)=>{
    //     //   console.log(vacantes);
    //       //setVacantes(vacantes);
    //     socket.on('mensaje-bienvenida', (data)=>{
    //       console.log(data);
    //       //setVacantes(vacantes);
    //     })
    //   },[socket])

    // useEffect(()=>{
    //     socket.on('mensaje-bienvenida',(data)=>{
    //         console.log(data);
    //     })
    // },[])

    //----------------------------------------


    //CARGO LISTADO DE VACANTES AL RENDERIZAR
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //LLAMO AL PROCEDIMIENTO buscoIDListadoVacantes Y PASO EL NIVEL CARGADO EN STORE GLOBAL
        //buscoIDListadoVacantes(configSG.nivel.id_nivel);
        //solicito datos al servidor

        //Cargo las especialidades
        cargaEspecidalidades();

        //socket.emit('solicitud-cliente',{message:"Listado de Vacantes"});

        // // Limpia el evento al desmontar el componente
        // return () => {
        //     socket.off('ensaje-bienvenida');
        // };
    },[])    

    //VEO CONFIGURACION GLOBAL
    useEffect(()=>{
        //?PROCESO SE EJECUTA EN CARGA INICIAL
        //console.log('que tiene configSG en VacantesMov (CARGA INICIAL): ', configSG);
    },[configSG]);

  return (
    <div className=" notranslate h-full w-full">
        {/* ENCABEZADO DE PAGINA */}
        <div className="bg-[#C9D991] desktop:h-[12vh] movil:h[5vh] flex flex-row">
                {/* TITULOS - BOTONES - NIVEL */}
                <div className="desktop:w-[60vw] flex desktop:flex-col desktop:justify-center desktop:items-start  movil:flex-row movil:w-full movil:items-center movil:justify-center">
                    <label className="ml-4 text-base font-semibold">NIVEL {configSG.nivel.descripcion}</label>
                    <div className="flex flex-col">
                        <div className="flex flex-row ">
                            <label className="ml-4 text-lg font-sans font-bold">VACANTES</label>
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
                                onClick={()=>{setEstadoVacantes('disponibles')}}
                            >Disponibles</label>
                            <label 
                                className={`font-semibold border-b-2 px-2 cursor-pointer transition-all duration-500 
                                    ${(estadoVacantes==='asignadas')
                                        ?`border-sky-500 text-sky-500`
                                        :`border-zinc-300 text-black`
                                    }
                                    `}
                                onClick={()=>{setEstadoVacantes('asignadas')}}
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
                                    {/* <th className="border-r-[1px] border-zinc-300">Orden</th> */}
                                    <th className="border-r-[1px] border-zinc-300">Escuela</th>
                                    <th className="border-r-[1px] border-zinc-300">Cargo</th>
                                    <th className="border-r-[1px] border-zinc-300">Modalidad</th>
                                    <th className="border-r-[1px] border-zinc-300">Turno</th>
                                    {/* <th className="border-r-[1px] border-zinc-300">Region</th> */}
                                    <th className="border-r-[1px] border-zinc-300">Localidad</th>
                                    {/* <th className="border-r-[1px] border-zinc-300">Zona</th> */}
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
                                                {/* <td className="text-center">{vacante.orden}</td> */}
                                                <td className="text-center">{vacante.establecimiento} {vacante.obs_establecimiento}</td>
                                                <td className="text-center">{vacante.cargo}</td>
                                                <td className="text-center">{vacante.modalidad}</td>
                                                <td className="text-center">{vacante.turno}</td>
                                                {/* <td className="text-center w-[10vw]">{vacante.region}</td> */}
                                                <td className="text-center">{vacante.localidad}</td>
                                                {/* <td className="text-center">{vacante.zona}</td> */}
                                                <td>
                                                    <div className="flex flex-row items-center justify-center  ">
                                                        <FaEye 
                                                            className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                            title="Ver Datos"
                                                            onClick={()=>submitVerDatosVacante(vacante)}
                                                        />
                                                        {
                                                            (vacante.datetime_asignacion===null && userSG.permiso!=3)
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
                {/* <div className="flex justify-center w-[50%] ">
                    <Paginador
                        currentpage={paginacion.page}
                        totalpage={paginacion.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={paginacion.totalItems}
                    />

                </div> */}
            </div>

    </div>
  )
};

export default VacMovDoc;
