import { PiUserListBold, PiListMagnifyingGlassBold  } from "react-icons/pi";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { CgList } from "react-icons/cg";
import logo from '../../assets/JUNTA-04-xs.png';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setNivel, setPage } from "../../redux/configSlice";
import { useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { outUser } from "../../redux/userSlice";
import { setIntervalActive } from "../../redux/intervalSlice";

const SideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    /**ESTADOS GLOBALES */
    const pageSG = useSelector((state)=>state.config.page);
    const nivelSG = useSelector((state)=>state.config.nivel);
    const userSG = useSelector((state)=>state.user);
    const configCompSG = useSelector((state)=>state.config.configComponente)

    const[open, setOpen]=useState(false);

    const logOut = () =>{
        navigate('/')
        dispatch(outUser());
    };

    const submitInscriptosMov =()=>{
        //
        console.log('Presiona en Inscriptos Movimientos');
        dispatch(setPage('InscriptosMov'));
    };

    const submitVacantesMov =()=>{
        //
        console.log('Presiona en Vacantes Movimientos');
        dispatch(setPage('VacantesMov'))
    };

    //PROCEDIMIENTO QUE LLAMA A PANTALLA DE VACANTES PARA DOCENTES
    const submitVacMovDoc = () =>{
        console.log('Presiona en VacMovDoc');
        dispatch(setPage('VacMovDoc'))
    };

    const submitListados = () =>{
        //
        console.log('Presiona en Listados');
        dispatch(setPage('Listados'))
    };

    const submitInscriptosTit = () =>{
        //
        console.log('Presiona en Inscriptos Titularizacion');
        dispatch(setPage('InscriptosTit'))
    };

    const submitVacantesTit = () =>{
        //
        console.log('Presiona en Vacantes Titularizacion');
        dispatch(setPage('VacantesTit'))
    };

    const submitVacantesTitDocentes = () =>{
        //
        console.log('Presiona en Visor Vacantes Titularizacion');
        dispatch(setPage('VacantesTitDocentes'))
    };

    const submitVacantesTitDocentesInicial = () =>{
        //
        console.log('Presiona en Visor Vacantes Titularizacion Inicial');
        dispatch(setPage('VacantesTitDocentesInicial'))
    };

    const submitListadosTit = () =>{
        //
        console.log('Presiona en Listados Titularizacion');
        dispatch(setPage('ListadosTit'))
    };

    const submitInscriptosPyR = () =>{
        //
        console.log('Presiona sobre Inscriptos Provisionales y Reemplazantes');
        dispatch(setPage('InscriptosPyR'))
    };

    const submitVacantesPyR = () =>{
        //
        console.log('Presiona sobre Vacantes Provisionales y Reemplazantes');
        dispatch(setPage('VacantesPyR'))
    };
    
    const submitListadosPyR = () =>{
        //
        console.log('Presiona sobre Listados Provisionales y Reemplazantes');
        dispatch(setPage('ListadosPyR'))
    };

    const submitConfigPage = () =>{
        //
        console.log('Presiona sobre Configuracion');
        dispatch(setPage('ConfigPage'))
    };
    
    const submitNivelInicial = async() =>{

        //console.log('Presiono Nivel Inicial');
        const datosNivel=[{id_nivel:1, descripcion:'INICIAL'}];
        //console.log('Que tiene datosNivel: ', datosNivel);
        dispatch(setNivel(datosNivel));
        resetInterval();
        navigate('/home');

    };

    const submitNivelPrimario = async()=>{

        //console.log('Presiono Nivel Primario');
        const datosNivel=[{id_nivel:2, descripcion:'PRIMARIO'}];
        //console.log('Que tiene datosNivel: ', datosNivel);
        dispatch(setNivel(datosNivel));
        resetInterval();
        navigate('/home');

    };

    const resetInterval =()=>{
        dispatch(setIntervalActive(false)); //Detener el intervalo

        setTimeout(()=>{
            dispatch(setIntervalActive(true)); //Reactiva Intervalo
        },1); //0 el tiempo que consideres necesario
    };    


    useEffect(()=>{
        //console.log('que tiene pageSG: ', pageSG);
        //console.log('que tiene nivelSG: ', nivelSG);
        //console.log('que tiene configComponente: ', configCompSG);
    },[pageSG,nivelSG,configCompSG])

    useEffect(()=>{
        //console.log('que tiene userSG: ', userSG);
        if(userSG.username===''){
            navigate('/');
        }else if(userSG.username==='invitadoPri'){ //modificar para invitadosPri
            dispatch(setPage('VacantesTitDocentes'));
            /**
             if(userSG.permiso===3){
                //Si es un invitado
                dispatch(setPage('VacantesMov'));
                }else{
                    dispatch(setPage('InscriptosMov'));
            }
            
            */
        }else{
            dispatch(setPage('PageIni'));
        }
    },[userSG])

    useEffect(()=>{
        setOpen(false);
    },[])

    return(
        <nav>
            {/* MENU MOVIL */}
            <div className="notranslate desktop:hidden bg-[#729DA6] h-[6vh] shadow-md">
                <div className="text-[30px] text-slate-50 flex flex-row justify-between">
                    <IoMdMenu 
                        className="text-slate-50 text-4xl font-bold "
                        onClick={()=>{setOpen(!open)}}
                        //onMouseEnter={()=>{setOpen(!open)}}
                    />
                    <div className="flex flex-row items-center justify-end mr-2">
                        <label className="pr-2 italic text-sm">{userSG.nombre}</label>
                        <FaRegUserCircle className="text-2xl text-slate-50 " />
                        {/* <FaPowerOff 
                        className="mx-2 text-2xl text-[#73685F] hover:cursor-pointer hover:text-[#7C8EA6] transition-transform duration-500 transform hover:scale-125"
                        title="Salir"
                        //onClick={()=>logOut()}
                        /> */}
                    </div>
                    
                </div>
                <div 
                    className={`absolute bg-[#006489] opacity-90 text-[24px] left-0 text-center z-50 w-[100vw] h-[100vh] font-['Helvetica']
                            ${(open)
                                ?` visible`
                                :` invisible`
                            }
                        `}
                    // ref={menuRef}
                >
                    <ul >
                        {/* <li className="my-4 text-slate-50 "
                            //onClick={()=>{handlePage('BoletinPage'); setOpen(false)}}
                            //onClick={()=>{submitNewDoc(); setOpen(false)}}
                            translate='no'
                        >Nuevo Documento</li>
                        <li className="my-8 text-slate-50"
                            //onClick={()=>{handlePage('VerNotasMateriasPage'); setOpen(false)}}
                            //onClick={()=>{submitDocumentosRec(); setOpen(false)}}
                        >Documentos Recibidos</li>
                        <li className="my-8 text-slate-50"
                            //onClick={()=>{handlePage('NotasMateriasPage'); setOpen(false)}}
                            //onClick={()=>{submitDashboard(); setOpen(false)}}
                            translate='no'
                            >Metricas</li> */}
                        <li className="my-8 text-slate-50"
                            //onClick={()=>cierraSesion()}
                            onClick={()=>{logOut(); setOpen(false)}}
                            translate='no'
                        >Salir</li>
                    </ul>
                </div>
            </div>

            {/* MENU ESCRITORIO */}
            <div className="notranslate movil:hidden desktop:flex flex-col bg-[#7C8EA6] w-full h-[95vh] shadow-right-only-md">
                {/* LOGO Y TITULO APP */}
                <div className="h-[8vh] p-[4px] flex flex-row items-center mt-[4px] ml-[4px] " >
                    <div className="flex h-[8vh] w-[30%]">
                        <img src={logo} className="max-w-full max-h-full object-contain"/>
                    </div>
                    <div className="w-[70%] flex flex-col ml-[5px] text-white ">
                        <p style={{lineHeight: '1'}} className="leading-none desktop:text-xs desktop-md:text-base desktop-lg:text-lg " >Sistema Entrega de Cargos</p>
                        {/* <label className="">Sistema </label>
                        <label className="mt-[-8px]">Entrega de </label>
                        <label className="mt-[-6px] font-semibold ">CARGOS</label> */}
                    </div>
                </div>

                {/* MENU MOVIMIENTOS */}
                <div className="ml-2 mt-2 text-white text-base">
                    {/**TITULO TRASLADOS Y CAMBIO DE FUNCION */}
                    {!(configCompSG[0]?.active==="" && configCompSG[1]?.active==="" && configCompSG[2]?.active==="") &&
                        <label className="font-normal desktop-xl:text-lg">Traslados y Cambio de Funcion</label>
                    }

                    {/**ENLACE A INSCRIPTOS */}
                    {(userSG.permiso!=3 && configCompSG[0]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='InscriptosMov')
                                ?'bg-[#C9D991] text-[#7C8EA6]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitInscriptosMov()}
                        >
                            <PiUserListBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Inscriptos</label>
                        </div>
                    }

                    {/**ENLACE A VACANTES */}
                    {(configCompSG[1]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='VacantesMov')
                                ?'bg-[#C9D991] text-[#7C8EA6]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitVacantesMov()}
                        >
                            <PiListMagnifyingGlassBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Vacantes</label>
                        </div>
                    }

                    {/**ENLACE A LISTADOS */}
                    {(userSG.permiso!=3 && userSG.permiso!=4 && configCompSG[2]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='Listados')
                                ?'bg-[#C9D991] text-[#7C8EA6]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitListados()}
                        >
                            <CgList className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Listados</label>
                        </div>
                    }

                </div>

                {/* MENU TITULARIZACION */}
                <div className="ml-2 mt-6 text-white text-base">
                    {/**TITULO TRASLADOS Y CAMBIO DE FUNCION */}
                    {!(configCompSG[3]?.active==="" && configCompSG[4]?.active==="" && configCompSG[5]?.active==="") &&
                        <label className="font-normal desktop-xl:text-lg">Titularizacion</label>
                    }

                    {/**ENLACE A INSCRIPTOS */}
                    {(userSG.permiso!=3 && configCompSG[3]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='InscriptosTit')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitInscriptosTit()}
                        >
                            <PiUserListBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Inscriptos</label>
                        </div>
                    }

                    {/**ENLACE A VACANTES */}
                    {(userSG.permiso!=3 && configCompSG[4]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='VacantesTit')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitVacantesTit()}
                        >
                            <PiListMagnifyingGlassBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Vacantes</label>
                        </div>
                    }

                    {/**ENLACE A LISTADOS */}
                    {((userSG.permiso!=3 && userSG.permiso!=4 ) && configCompSG[5]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='ListadosTit')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                                }
                                `}
                            onClick={()=>submitListadosTit()}
                        >
                            <CgList className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Listados y Metricas</label>
                        </div>
                    }

                    {/**ENLACE A VACANTES VISUALIZACION PARA DOCENTES */}
                    {(userSG.permiso!=4 && configCompSG[6]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='VacantesTitDocentes')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitVacantesTitDocentes()}
                        >
                            <PiListMagnifyingGlassBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Listado de Vacantes</label>
                        </div>
                    }

                    {/**ENLACE A VACANTES VISUALIZACION PARA DOCENTES de INICIAL */}
                    {(configCompSG[7]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='VacantesTitDocentesInicial')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitVacantesTitDocentesInicial()}
                        >
                            <PiListMagnifyingGlassBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Visor Vacantes Inicial</label>
                        </div>
                    }
                </div>


                {/* MENU PROVISIONALES Y REEMPLAZANTES */}
                <div className="ml-2 mt-6 text-white text-base">
                    {/**TITULO TRASLADOS Y CAMBIO DE FUNCION */}
                    {!(configCompSG[8]?.active==="" && configCompSG[9]?.active==="" && configCompSG[10]?.active==="") &&
                        <label className="font-normal desktop-xl:text-lg">Provisionales y Reemplazantes</label>
                    }
                    {/**ENLACE A INSCRIPTOS DE PROVISIONAL Y REEMPLAZANTES */}
                    {(userSG.permiso!=3 && configCompSG[8]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='InscriptosPyR')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitInscriptosPyR()}
                        >
                            <PiUserListBold className="text-xl font-bold mr-2"/>
                            <label className="font-light">Inscriptos Pr</label>
                        </div>
                    }

                    {/**ENLACE A VACANTES PROVISIONALES Y REEMPLAZANTES */}
                    {(userSG.permiso!=3 && configCompSG[9]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='VacantesPyR')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitVacantesPyR()}
                        >
                            <PiListMagnifyingGlassBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Vacantes PR</label>
                        </div>
                    }

                    {/**ENLACE A LISTADOS PROVISIONALES Y REEMPLAZANTES */}
                    {(userSG.permiso!=3 && configCompSG[10]?.active=="1") &&
                        <div 
                            className={` rounded p-[4px] flex flex-row justify-start items-center
                                ${(pageSG==='ListadosPyR')
                                ?'bg-[#C9D991]'
                                :'hover:bg-[#C9D991]'
                            }
                                `}
                            onClick={()=>submitListadosPyR()}
                        >
                            <PiListMagnifyingGlassBold className="text-xl font-bold mr-2"/>
                            <label className="font-light desktop-xl:text-lg">Listados PR</label>
                        </div>
                    }
                </div>


                {/* MENU ADMINISTRADORES */}
                {(userSG.permiso===1) &&
                    <div className="ml-2 mt-6 text-white text-base flex flex-col">
                        <label>Administrador</label>
                        {/*
                        <button 
                            className="border-[1px] border-white m-2 rounded"
                            onClick={()=>submitNivelInicial()}
                        >Inicial</button>
                        <button 
                            className="border-[1px] border-white m-2 rounded"
                            onClick={()=>submitNivelPrimario()}
                        >Primario</button>
                        */}
                        {(userSG.permiso!=3) &&
                            <div 
                                className={` rounded p-[4px] flex flex-row justify-start items-center
                                    ${(pageSG==='ConfigPage')
                                    ?'bg-[#C9D991]'
                                    :'hover:bg-[#C9D991]'
                                    }
                                    `}
                                onClick={()=>submitConfigPage()}
                            >
                                <CgList className="text-xl font-bold mr-2"/>
                                <label className="font-light desktop-xl:text-lg">Configuracion</label>
                            </div>
                        }
                    </div>
                }

                <FaPowerOff 
                    className="m-2 text-2xl text-white hover:cursor-pointer hover:text-[#7C8EA6] transition-transform duration-500 transform hover:scale-125"
                    title="Salir"
                    onClick={()=>logOut()}
                />
            </div>
        </nav>
    )
};

export default SideBar;