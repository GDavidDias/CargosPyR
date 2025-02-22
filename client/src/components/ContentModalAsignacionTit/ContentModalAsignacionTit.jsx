import { IoMdPrint } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";

const ContentModalAsignacionTit = ({closeModalAsign,datosInscriptoSelect,datosVacanteSelect,procesoImpresion,submitAsignarVacante}) =>{    
    return(
        <div className="h-100 w-100  flex flex-col items-center">
                <label 
                    className="text-2xl text-center font-bold " 
                    translate='no'
                >
                ASIGNACION VACANTE TITULARIZACION
                </label>
                {/* DATOS DEL INSCRIPTO */}
                <div className="border-[1px] border-purple-400 flex flex-col justify-center rounded-md shadow font-semibold text-2xl bg-purple-100 m-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <label className="mx-4 font-bold text-zinc-800">Docente: {datosInscriptoSelect.apellido} {datosInscriptoSelect.nombre}</label>
                        </div>
                        <div className="flex flex-row">
                            <label className="mx-4 text-zinc-800">DNI: {datosInscriptoSelect.dni}</label>
                            <label className="mr-4 text-sky-600">Puntaje: {datosInscriptoSelect.total}</label>
                        </div>
                    </div>
                </div>
                
                {/* AVISO ESPECIALIDAD DIFIERE DE LA SOLICITADA */}
                {/* PARA TRASLADO */}
                {(datosInscriptoSelect.id_especialidad!=datosVacanteSelect.id_especialidad)
                    ?<div className="flex flex-row items-center">
                        <FiAlertTriangle  className="mr-2 text-xl desktop-xl:text-3xl  text-red-500"/>
                        <div className="border-[2px] border-red-500 flex flex-row justify-center rounded-md shadow font-semibold text-lg bg-red-100 mb-2 desktop-xl:text-xl animate-parpadeoborde">
                            <label className="mx-2">La especialidad del docente: </label>
                            <label className="mr-2 font-bold">{datosInscriptoSelect.abreviatura_especialidad}</label>
                            <label className="mr-2">, es distinto al cargo a tomar: </label>
                            <label className="mr-2 font-bold">{datosVacanteSelect.cargo}</label>
                        </div>
                        {/* <FiAlertTriangle  className="ml-2 text-xl desktop-xl:text-3xl blink text-red-500"/> */}
                    </div>
                    :``
                }

                {/* DATOS DEL CARGOS */}
                <div className="flex flex-row w-[50vw] justify-center">
            
                    {/* CARGO A TOMAR */}
                    <div className="flex flex-col border-[5px] border-emerald-500 w-[85%] items-center  ml-[9px] rounded-md shadow-lg bg-emerald-100">
                        <div className="flex items-center">
                            <label className="font-bold text-3xl m-2">Datos de Vacante</label>
                        </div>
                        <div className="flex flex-col items-end text-2xl">
                            <div className="flex flex-row my-1">
                                <label className="mb-0 font-semibold  mr-2">N° Establecimiento</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.nro_establecimiento}</div>
                            </div>
                            <div className="flex flex-row my-1">
                                <label className="mb-0 font-semibold  mr-2">Establecimiento</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[8vh] pl-[4px] bg-neutral-50 text-xl">{datosVacanteSelect.nombre_establecimiento}</div>
                            </div>
                            <div className="flex flex-row my-1">
                                <label className="font-semibold  mr-2">Cargo</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.cargo}</div>
                            </div>
                            <div className="flex flex-row my-1">
                                <label className="font-semibold  mr-2">Modalidad</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.modalidad}</div>
                            </div>
                            <div className="flex flex-row my-1">
                                <label className="font-semibold  mr-2">Turno</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.turno}</div>
                            </div>
                            <div className="flex flex-row my-1">
                                <label className="font-semibold  mr-2">Region</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.region}</div>
                            </div>
                            <div className="flex flex-row my-1">
                                <label className="font-semibold  mr-2">Departamento</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.departamento}</div>
                            </div>
                            <div className="flex flex-row my-1">
                                <label className="font-semibold  mr-2">Localidad</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.localidad}</div>
                            </div>
                            <div className="flex flex-row mt-2 mb-4">
                                <label className="font-semibold  mr-2">Zona</label>
                                <div className="flex items-center border-[1px]  border-zinc-300 rounded w-[20vw] h-[4vh] pl-[4px] bg-neutral-50">{datosVacanteSelect.zona}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        className="border-2 border-[#7C8EA6] mt-5 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                        onClick={()=>submitAsignarVacante()}
                        translate='no'
                    >ACEPTAR</button>
                    <button
                        className="border-2 border-[#7C8EA6] mt-5 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                        onClick={closeModalAsign}
                        translate='no'
                    >CANCELAR</button>
                    <button
                        onClick={()=>procesoImpresion()}
                    >
                        <IoMdPrint 
                            title="Imprimir Designacion"
                            className="text-2xl"
                            onClick={()=>procesoImpresion()}
                        />
                    </button>
                </div>                
            </div>
    )
};

export default ContentModalAsignacionTit;