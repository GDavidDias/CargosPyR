import { useSelector } from "react-redux";
import { URL } from '../../../varGlobal';
import axios from "axios";

//-------ICONOS--------
import { FaRegUserCircle, FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MdOutlineDoubleArrow } from "react-icons/md";

const VisorAsignacionesPyR = () => {
    const componentRef = useRef(null);
    const navigate = useNavigate();

    //EstadosGlogales
    const configSG = useSelector((state) => state.config);
    const userSG = useSelector((state) => state.user);

    // ESTADOS LOCALES
    const [asignaciones, setAsignaciones] = useState([]);
    const [ultimaAsignacion, setUltimaAsignacion] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const logOut = () => {
        navigate('/');
    };

    const traigoAsignacionesRealizadas = async () => {
        const datosBody = {
            idListadoVacTit: 4,
            limit: 5,
            page: 1,
        };

        try {
            const res = await axios.post(`${URL}/api/allasignacionestit`, datosBody);
            //const res = await axios.post(`${URL}/api/asignacionesrealizadastit`, datosBody); //SE CAMBIA RUTA POR ERROR
            //const res = await axios.post(`${URL}/api/allasignacionesmov`, datosBody);
            console.log('que trae res de getAllAsignacionesRealizadasTit: ', res.data);

            //const lista = Array.isArray(res.data) ? res.data : (res.data.result || []);
            const lista = res.data.result;

            setAsignaciones(lista);

            if (lista?.length > 0) {
                // lista viene ORDENADA de más nueva a más vieja
                const posibleUltima = lista[0];

                // ⚠️ Ajustá el campo ID real de la asignación:
                // por ejemplo id_asignacion_mov, id_vacante_mov, etc.
                const getId = (a) => a?.id_asignacion_mov ?? a?.id_vacante_mov ?? a?.id_inscripto_mov;

                setUltimaAsignacion((prev) => {
                    const prevId = getId(prev);
                    const nuevaId = getId(posibleUltima);

                    // Si es la misma asignación, no disparo de nuevo el visor
                    if (prevId && prevId === nuevaId) {
                        return prev;
                    }
                    // Si es una nueva asignación, la guardo
                    return posibleUltima;
                });
            }
        } catch (error) {
            console.log('que trae error getAsignacionesMov: ', error);
        }
    };

    // Se ejecuta al montar: traigo la lista inicial
    useEffect(() => {
        traigoAsignacionesRealizadas();
    }, []);


    // Polling cada X segundos para detectar nuevas asignaciones
    useEffect(() => {
        const intervalo = setInterval(() => {
            traigoAsignacionesRealizadas();
        }, 10000); // 10 segundos (ajustable)

        return () => clearInterval(intervalo);
    }, []);


    // Cada vez que cambia la ultimaAsignacion, muestro el detalle 1 minuto
    useEffect(() => {
        if (!ultimaAsignacion) return;

        setMostrarDetalle(true);

        const timer = setTimeout(() => {
            setMostrarDetalle(false);
        }, 60_000); // 1 minuto

        return () => clearTimeout(timer);
    }, [ultimaAsignacion]);

    return (
        <div className="notranslate">
            {/* ENCABEZADO PAGINA */}
            <div className="bg-[#C9D991] h-[8vh] flex flex-row ">
                {/* TITULOS - BOTONES - NIVEL */}
                <div className="w-[55vw] flex justify-center items-start flex-col">
                    <label className="ml-4 text-base font-semibold">
                        NIVEL {configSG.nivel.descripcion}
                    </label>
                    <div className="flex flex-row">
                        <label className="ml-4 text-lg font-sans font-bold">
                            VISOR DE ASIGNACIONES REALIZADAS - PROVISIONALES Y REEMPLAZANTES
                        </label>
                    </div>
                </div>
                {/* SECCION DATOS USUARIO */}
                <div className=" w-[30vw] flex items-center justify-end">
                    <label className="mr-2 italic text-sm">{userSG.nombre}</label>
                    <FaRegUserCircle className="mr-2 text-2xl text-[#73685F] " />
                    <FaPowerOff
                        className="mr-4 text-2xl text-[#73685F] hover:cursor-pointer hover:text-[#7C8EA6] transition-transform duration-500 transform hover:scale-125"
                        title="Salir"
                        onClick={logOut}
                    />
                </div>
            </div>

            {/* CONTENIDO DE PAGINA - ENCABEZADO */}
            <div className="h-[6vh] border-b-2 border-zinc-400 py-2 shadow-md flex flex-row justify-between">
                <div className=" flex flex-row">
                    {/**label con noticias */}
                </div>
                <div className="flex flex-row mr-4">
                </div>
            </div>

            {/* CONTENIDO DE PAGINA - DATOS */}
            <div
                className="flex flex-row h-[79vh] overflow-y-auto m-2 border-[1px] border-[#7C8EA6] "
                ref={componentRef}
            >
                {/**LISTADO DESIGNACIONES REALIZADAS */}
                <div className="w-[15vw] h-[78vh] ">
                    {/**TITULO */}
                    <div>
                        <h2 className="text-center font-bold underline">Ultimas Designaciones Realizadas</h2>
                    </div>
                    {/**LISTADO DE DESIGNACIONES*/}
                    <div className="p-2 text-sm overflow-y-auto h-[70vh]">
                        {asignaciones.length === 0 && (
                            <p className="text-center text-zinc-500 italic">
                                Sin designaciones todavía...
                            </p>
                        )}

                        {asignaciones.map((asig, idx) => (
                            <div
                                key={idx}
                                className="mb-2 p-2 border border-zinc-300 rounded bg-zinc-50 "
                            >
                                {/* campos por cada tarjeta */}
                                <p className="font-semibold text-xs">
                                    Docente: {asig.apellido || asig.nombre}
                                </p>
                                <p className="text-xs">
                                    DNI: {asig.dni}
                                </p>
                                <p className="text-xs">
                                    Vacante: {asig.cargo_destino} - {asig.turno_destino} - {asig.modalidad_destino}
                                </p>
                                <p className="text-[11px] text-zinc-500">
                                    Escuela: {asig.obs_establecimiento_destino || 'N/D'} - {asig.nombre_establecimiento}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/**ASIGNACIONES GENERADAS */}
                <div className="w-[70vw] h-[78vh] ">
                    {/**VISOR DE ASIGNACIONES */}
                    <div className="m-4 h-[74vh] border border-zinc-400 rounded bg-zinc-50 shadow-md p-4 flex items-center justify-center">
                        {mostrarDetalle && ultimaAsignacion ? (
                
                            // 💠 "Ventana" con detalle de la última asignación (1 minuto)
                            <div className="w-full h-full flex flex-col justify-start">
                                <div className="flex flex-row justify-between items-center mb-3">
                                    <h3 className="font-bold text-xl text-sky-700">
                                        NUEVA ASIGNACION REALIZADA
                                    </h3>
                                    <span className="text-xs text-zinc-500 blink ">
                                        Se ocultará en 1 minuto
                                    </span>
                                </div>

                                <div className="flex flex-col gap-x-6 gap-y-2 text-xl items-center">
                                    {/**DATOS DEL DOCENTE ASIGNADO */}
                                    <div className="flex flex-row border-[2px] bg-blue-50 border-sky-400 rounded-md p-2 shadow-md w-[90%] justify-center">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">Docente: </span>
                                            <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[350px] bg-white">{ultimaAsignacion.apellido || ultimaAsignacion.nombre}</span>
                                        </div>
                                        <div className="ml-2 flex flex-col">
                                            <span className="font-semibold">DNI: </span>
                                            <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[110px] bg-white">{ultimaAsignacion.dni}</span>
                                        </div>
                                        <div className="ml-2 flex flex-col">
                                            <span className="font-semibold">Puntaje: </span>
                                            <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[110px] bg-white font-bold text-sky-700">{ultimaAsignacion.total}</span>
                                        </div>
                                    </div>

                                    {/**DATOS DE CARGOS*/}
                                    <div className="flex flex-row justify-center w-[100%]">
                                        {/**CARGO DE ORIGEN*/}
                                        {/*
                                        <div className="flex flex-col bg-red-100 border-[4px] border-red-400 rounded-md p-2 shadow-md w-[48%]">
                                            <div className="flex justify-center">
                                                <span className="font-bold text-lg mb-2 justify-center">CARGO ORIGEN</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Escuela: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] h-[60px]  bg-white line-clamp-2">{ultimaAsignacion.escuela_origen} - {ultimaAsignacion.obs_escuela_origen}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Cargo: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.cargo_actual}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Modalidad: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.modalidad_actual}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Turno: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.turno_actual}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Cupof: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.cupof_actual}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Region: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.region_actual}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Localidad: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.localidad_actual}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Zona: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.zona_actual}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <MdOutlineDoubleArrow className="text-2xl animate-left-disappear"/>
                                        </div>
                                        */}
                                        {/**CARGO DESTINO*/}
                                        <div className="flex flex-col bg-green-100 border-[4px] border-green-400 rounded-md p-2 shadow-md w-[55%] items-center">
                                            <div className="flex justify-center">
                                                <span className="font-bold text-lg mb-2 justify-center">CARGO ASIGNADO</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Escuela: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] h-[60px] bg-white line-clamp-2">{ultimaAsignacion.establecimiento_destino} - {ultimaAsignacion.obs_establecimiento_destino}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Cargo: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.cargo_destino}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Modalidad: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.modalidad_destino}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Turno: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.turno_destino}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Cupof: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.cupof}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Region: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.region_destino}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Localidad: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.localidad_destino}</span>
                                                </div>
                                                <div className="ml-2 mb-2 flex flex-row">
                                                    <span className="font-semibold">Zona: </span>
                                                    <span className="px-2 border-[1px] border-zinc-500 rounded-md w-[250px] bg-white">{ultimaAsignacion.zona_destino}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Agregá más campos si querés */}
                                </div>
                            </div>
                        ) : (
                            // 💬 Mensaje por defecto / luego del minuto
                            <p className="text-3xl font-bold text-red-600 italic blink">
                                En proceso de designación...
                            </p>
                        )}
                    </div>
                </div>

                {/**LISTADO DE DOCENTES EN ESPERA */}
                {/**
                 
                <div className="w-[15vw] h-[78vh] border-[1px] border-emerald-500">
                    
                    <div>
                        <h2 className="text-center font-bold underline">Docentes en Espera</h2>
                    </div>
                    
                    <div>

                    </div>
                </div>
                 */}

            </div>
        </div>
    );
};

export default VisorAsignacionesPyR;
