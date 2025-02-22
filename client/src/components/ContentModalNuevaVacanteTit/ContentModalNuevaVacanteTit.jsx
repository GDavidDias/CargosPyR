const ContentModalNuevaVacanteTit = ({formNuevaVacante,closeModalNuevaVacante,handleChangeFormVacante,valida,submitGuardarFormNuevaVacante,listadoEspecialidades})=>{
    //console.log('que tiene Valida: ', valida);
    //console.log('ingresa a ContentModalNuevaVacanteTit');
    return(
        <div className="notranslate h-100 w-100  flex flex-col items-center">
            <label 
                className="text-xl text-center font-bold " 
                translate='no'
            >Nueva Vacante</label>
            <div>
                <div className="min-h-[32vh]  mt-2 border-[1px] border-sky-800 rounded">
                    <div className="flex flex-row ml-2 mt-2">
                        {/* <div className="flex flex-col mr-2">
                            <label className="text-sm">ID</label>
                            <input 
                                className="border-[1px] border-zinc-400 w-[15mm] text-center"
                                //value={idVacante}
                                //disabled={true}
                            />
                        </div> */}
                        
                        <div className="flex flex-col mr-2">
                            <label className="text-sm">N° Establecimiento</label>
                            <input 
                                name="nro_establecimiento"
                                className="border-[1px] border-zinc-400 w-[50mm] pl-[2px]"
                                value={formNuevaVacante?.nro_establecimiento}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>

                        <div className="flex flex-col mx-2">
                            <label className="text-sm">Nombre Establecimiento</label>
                            <input 
                                name="nombre_establecimiento"
                                className="border-[1px] border-zinc-400 w-[67mm] pl-[2px]"
                                value={formNuevaVacante?.nombre_establecimiento}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>


                    </div>

                    <div className="flex flex-row ml-2 mt-2">
                        <div>
                            <label className="mr-2">Especialidad</label>
                            <select
                                className=" border-[1px] rounded border-gray-500 w-[30vw]"
                                name="id_especialidad"
                                onChange={handleChangeFormVacante}
                                value={formNuevaVacante.id_especialidad}
                            >
                                <option value='' selected disabled>Seleccione...</option>
                                {
                                    listadoEspecialidades?.map((especialidad,index)=>(
                                        <option key={index} value={especialidad.id_especialidad}>{especialidad.abreviatura} - {especialidad.descripcion}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-row ml-2 mt-2">
                        <div className="flex flex-col mr-2">
                            <label className="text-sm">Cargo</label>
                            <input 
                                name="cargo"
                                className="border-[1px] border-zinc-400 w-[40mm] pl-[2px]"
                                value={formNuevaVacante?.cargo}
                                onChange={handleChangeFormVacante}
                                disabled={true}
                            />
                        </div>
                        <div className="flex flex-col mr-2">
                            <label className="text-sm">Modalidad</label>
                            <input 
                                name="modalidad"
                                className="border-[1px] border-zinc-400 w-[30mm] pl-[2px]"
                                value={formNuevaVacante?.modalidad}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>
                        <div className="flex flex-col mx-2">
                            <label className="text-sm">Turno</label>
                            <input 
                                name="turno"
                                className="border-[1px] border-zinc-400 w-[30mm] pl-[2px]"
                                value={formNuevaVacante?.turno}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>
                        <div className="flex flex-col mx-2">
                            <label className="text-sm">Cupof</label>
                            <input 
                                name="cupof"
                                className="border-[1px] border-zinc-400 w-[30mm] pl-[2px]"
                                value={formNuevaVacante?.cupof}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>

                    </div>

                    <div className="flex flex-row ml-2 mt-2">
                        <div className="flex flex-col mr-2">
                            <label className="text-sm">Region</label>
                            <input 
                                name="region"
                                className="border-[1px] border-zinc-400 w-[12mm] pl-[2px]"
                                value={formNuevaVacante?.region}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>
                        <div className="flex flex-col mx-2">
                            <label className="text-sm">Departamento</label>
                            <input 
                                name="departamento"
                                className="border-[1px] border-zinc-400 w-[50mm] pl-[2px]"
                                value={formNuevaVacante?.departamento}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>
                        <div className="flex flex-col mx-2">
                            <label className="text-sm">Localidad</label>
                            <input 
                                name="localidad"
                                className="border-[1px] border-zinc-400 w-[50mm] pl-[2px]"
                                value={formNuevaVacante?.localidad}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>
                        <div className="flex flex-col mx-2">
                            <label className="text-sm">Zona</label>
                            <input 
                                name="zona"
                                className="border-[1px] border-zinc-400 w-[16mm] pl-[2px]"
                                value={formNuevaVacante?.zona}
                                onChange={handleChangeFormVacante}
                                //disabled={(datosVacante.datetime_asignacion!=null)}
                            />
                        </div>

                    </div>
                </div>

                {/* VISIBILIDAD DE BOTONES */}
                <div className="flex justify-center">
                    <div>
                        {(valida) &&
                            <button
                                className="border-2 border-[#7C8EA6] mt-10 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={submitGuardarFormNuevaVacante}
                                translate='no'
                            >GUARDAR</button>
                        }
                        <button
                            className="border-2 border-[#7C8EA6] mt-10 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                            onClick={closeModalNuevaVacante}
                            translate='no'
                        >CANCELAR</button>
                    </div>
                    {/* {(estadoForm==='ver' || datosVacante.datetime_asignacion!=null) &&
                        <button
                            className="border-2 border-[#7C8EA6] mt-10 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                            onClick={closeModal}
                            translate='no'
                        >CERRAR</button>
                    }
                    {(estadoForm==='editar' && datosVacante.datetime_asignacion===null) &&
                        <div>
                            <button
                                className="border-2 border-[#7C8EA6] mt-10 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={submitGuardarFormVacante}
                                translate='no'
                            >GUARDAR</button>
                            <button
                                className="border-2 border-[#7C8EA6] mt-10 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={closeModal}
                                translate='no'
                            >CANCELAR</button>
                        </div>
                    } */}
                </div>

            </div>
        </div>
    )
};

export default ContentModalNuevaVacanteTit;