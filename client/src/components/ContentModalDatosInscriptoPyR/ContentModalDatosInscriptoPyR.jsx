import { IoMdPrint } from "react-icons/io";
import { IoTrash } from "react-icons/io5";

const ContentModalDatosInscriptoPyR =({datosFormInscripto,datosInscriptoSelect,idInscriptoSelect,closeModal,handleChangeFormInscripto,formEstadoInscripto,submitGuardarFormInscripto,cargoAsignado,procesoImpresion,submitEliminarTomaCargo, procesoImpresionAsistencia, handleCancelDatosInscriptoTit,userSG})=>{
    console.log('ingreso a ContentModalDatosInscriptoPyR');
    return(
        <div className="notranslate h-100 w-100 flex flex-col items-center">
            <label 
                className="text-xl text-center font-bold flex flex-row items-center" 
                translate='no'
            >Datos del Inscripto <p className="text-sm font-light ml-2">({idInscriptoSelect})</p></label>

            <div className="flex flex-col">
                <div className="flex flex-row">
                    {/* DATOS DEL INSCRIPTO */}
                    <div className="border-[1px] border-sky-500 rounded-md w-[95mm] h-[75mm] py-2 my-2 font-semibold bg-blue-100 ">
                        <div className="flex flex-col ml-2 mt-[2px] items-end justify-start">
                            <div className="flex flex-row my-[4px] mx-2 text-start items-center">
                                <label className="font-semibold text-base mr-2">Orden:</label>
                                <input 
                                    name="dni"
                                    className="border-[1px] border-zinc-500 w-[70mm] h-[4vh] text-start pl-2 bg-neutral-50 rounded"
                                    value={datosFormInscripto?.orden}
                                    disabled={true}
                                />
                            </div>

                            <div className="flex flex-row my-[4px] mx-2 text-start items-start">
                                <label className="font-semibold text-base mr-2">Nombre:</label>
                                <textarea 
                                    name="apellido"
                                    className="border-[1px] border-zinc-500 w-[70mm] h-[8vh] pl-2 text-start pl-2 bg-neutral-50 rounded text-wrap"
                                    value={datosFormInscripto?.apellido}
                                    onChange={handleChangeFormInscripto}
                                    //disabled={(datosInscriptoSelect.vacante_asignada!=null)}
                                    disabled={userSG.permiso==4} //si el nivel es consultor = 4 se deshabilita el input para modificar
                                />
                            </div>
                            {/**
                            <div className="flex flex-row my-[4px] mx-2 text-start items-center">
                                <label className="font-semibold text-base mr-2">Nombre:</label>
                                <input 
                                    name="nombre"
                                    className="border-[1px] border-zinc-500 w-[70mm] h-[4vh] pl-2 text-start pl-2 bg-neutral-50 rounded"
                                    value={datosFormInscripto?.nombre}
                                    onChange={handleChangeFormInscripto}
                                    disabled={(datosInscriptoSelect.vacante_asignada!=null)}
                                />
                            </div>
                             * 
                             */}

                        </div>
                        <div className="flex flex-col ml-2 mt-[2px] items-end justify-start">

                            <div className="flex flex-row my-[4px] mx-2 text-start items-center">
                                <label className="font-semibold text-base mr-2">Dni:</label>
                                <input 
                                    name="dni"
                                    className="border-[1px] border-zinc-500 w-[70mm] h-[4vh] text-start pl-2 bg-neutral-50 rounded"
                                    value={datosFormInscripto?.dni}
                                    onChange={handleChangeFormInscripto}
                                    //disabled={(datosInscriptoSelect.vacante_asignada!=null)}
                                    disabled={userSG.permiso==4} //si el nivel es consultor = 4 se deshabilita el input para modificar
                                />
                            </div>

                            <div className="flex flex-row my-[4px] mx-2 text-start items-center">
                                <label className="font-semibold text-base mr-2">Total:</label>
                                <input 
                                    name="total"
                                    className="border-[1px] border-zinc-500 w-[70mm] h-[4vh] pl-2 text-start pl-2 bg-neutral-50 rounded"
                                    value={datosFormInscripto?.total}
                                    onChange={handleChangeFormInscripto}
                                    //disabled={(datosInscriptoSelect.vacante_asignada!=null)}
                                    disabled={userSG.permiso==4} //si el nivel es consultor = 4 se deshabilita el input para modificar
                                />
                            </div>

                        </div>

                        <div className="flex flex-row my-[2px]  justify-end">
                            <div className="flex flex-row my-[4px] mx-2 text-start items-center">
                                <label className="font-semibold text-base mr-2">Estado: </label>
                                <input 
                                    className="border-[1px] border-zinc-400 w-[35mm] pl-2 text-start"
                                    value={(datosInscriptoSelect?.descripcion_estado_inscripto) ?datosInscriptoSelect.descripcion_estado_inscripto :`` }
                                    disabled={true}
                                />
                            </div>

                            {(datosInscriptoSelect.descripcion_estado_inscripto==='' || datosInscriptoSelect.descripcion_estado_inscripto===null || datosInscriptoSelect.descripcion_estado_inscripto=='Ausente')
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

                    {/* DATOS DE SU ASIGNACION */}
                    {(datosInscriptoSelect.vacante_asignada!=null && datosInscriptoSelect.vacante_asignada!='')  &&
                    <div className="h-[110mm] w-[100mm] ml-2 my-2 border-[1px] border-emerald-500 text-center rounded bg-emerald-50 ">
                        <div className="flex flex-row ">
                            <div className="w-[20%] "></div>
                            <div className="w-[60%] ">
                                <label className="text-xl text-center font-bold text-green-700" translate='no'>Vacante que Titularizó</label>
                            </div>
                            <div className="flex flex-row w-[20%] justify-end">
                                <button className="font-bold text-xl mr-2 hover:text-sky-500 hover:scale-150 transition-all duration-500">
                                    <IoMdPrint 
                                        title="IMPRIMIR DESIGNACION"
                                        onClick={()=>procesoImpresion()}
                                    />
                                </button>
                                <button className="font-bold text-lg mr-4 hover:text-red-500 hover:scale-150 transition-all duration-500">
                                    <IoTrash 
                                        title="ELIMINAR"
                                        onClick={()=>submitEliminarTomaCargo(cargoAsignado.id_asignacion_tit)}
                                    />
                                </button>
                            </div>
                        </div>
                        {/* Datos a mostrar: Escuela, cargo, modalidad, turno, region, localidad, zona */}
                        <div className="flex flex-col items-end">
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">ID Vacante:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50 ">{cargoAsignado.id_vacante_tit}</div>
                            </div>
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">Escuela:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50 ">{cargoAsignado.nro_establecimiento} {cargoAsignado.nombre_establecimiento}</div>
                            </div>
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">Cargo:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50">{cargoAsignado.cargo}</div>
                            </div>
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">Modalidad:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50">{cargoAsignado.modalidad}</div>
                            </div>
                        </div>    
                        <div className="flex flex-col items-end">
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">Turno:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50">{cargoAsignado.turno}</div>
                            </div>
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">Region:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50">{cargoAsignado.region}</div>
                                    </div>
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">Localidad:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50">{cargoAsignado.localidad}</div>
                            </div>
                            <div className="text-start my-[4px] mx-2 flex flex-row items-center">
                                <label className="font-semibold text-sm mr-2">Zona:</label>
                                <div className=" border-[1px] border-zinc-500 rounded w-[70mm] h-[4vh] pl-[4px] bg-neutral-50">{cargoAsignado.zona}</div>
                            </div>
                        </div>  
                    </div>
                    }
                </div>

                {/* VISIBILIDAD DE BOTONES */}
                <div className="flex justify-center">
                    {(formEstadoInscripto==='ver') &&
                        <button
                            className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                            onClick={closeModal}
                            translate='no'
                        >CERRAR</button>
                    }
                    {(formEstadoInscripto==='editar') &&
                        <div>
                            <button
                                className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={submitGuardarFormInscripto}
                                translate='no'
                            >GUARDAR</button>
                            <button
                                className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={handleCancelDatosInscriptoTit}
                                translate='no'
                            >CANCELAR</button>
                        </div>
                    }
                </div>

            </div>
        </div>
    );
};

export default ContentModalDatosInscriptoPyR;