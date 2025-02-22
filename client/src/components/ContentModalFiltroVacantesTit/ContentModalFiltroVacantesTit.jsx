import { IoMdPrint } from "react-icons/io";
import { IoTrash } from "react-icons/io5";

const ContentModalFiltroVacantesTit =({closeModalFilter, submitCloseModalFilter, filtroRegionVac, handleSelectFiltroRegion, handleCancelFiltroRegionVac, filtroModalidadVac, handleSelectFiltroModalidad, handleCancelFiltroModalidadVac, submitAplicarFiltrosModales,listadoEspecialidades,filtroEspecialidadVac,handleCancelFiltroEspecialidadVac,handleSelectFiltroEspecialidadVac})=>{
    //console.log('ingreso a ContentModalFiltroVacantesTit');
    return(
        <div className="notranslate h-100 w-100 flex flex-col items-center">
            <label 
                className="text-xl text-center font-bold flex flex-row items-center" 
                translate='no'
            >Filtros</label>

            <div className="flex flex-col">
                <div className="flex flex-row">
                    {/* SELECCION DE FILTROS */}
                    <div className="border-[1px] border-slate-500 rounded-md w-[80mm] h-[40mm] py-2 my-2 font-semibold bg-slate-200 ">
                        <div className="flex flex-col ml-2 mt-[2px] items-end justify-start">
                            {/** FILTRO MODALIDAD */}
                            <div className="flex flex-row my-[4px] mx-2 text-start items-center">
                                <label className="font-semibold text-base mr-2">Modalidad:</label>
                                <select
                                    className={` h-[24px] border-[1px] rounded focus:outline-none focus:ring-0 focus:border-none 
                                        ${(filtroModalidadVac==='')
                                            ?` w-[40mm]`
                                            :` w-[33mm]`
                                        }
                                        `}
                                    name="filtroModalidad"
                                    onChange={handleSelectFiltroModalidad}
                                    value={filtroModalidadVac}
                                >
                                    <option value='' selected disabled>Seleccione...</option>   
                                    <option value='J.S.'>J.S.</option>
                                    <option value='J.C.'>J.C.</option>
                                    <option value='A.A.'>A.A.</option>
                                </select>
                                {(filtroModalidadVac!="") &&
                                    <label 
                                        className="font-bold mx-2 cursor-pointer"
                                        onClick={handleCancelFiltroModalidadVac}
                                    >X</label>
                                }
                            </div>

                            {/**FILTRO REGION */}
                            <div className="flex flex-row my-[4px] mx-2 text-start items-start">
                                <label className="font-semibold text-base mr-2">Region:</label>
                                <select 
                                    className={` h-[24px] border-[1px] rounded focus:outline-none focus:ring-0 focus:border-none desktop-xl:text-lg
                                        ${(filtroRegionVac==='')
                                            ?` w-[40mm]`
                                            :` w-[33mm]`
                                        }
                                        `}
                                    name="filtroRegion"
                                    onChange={handleSelectFiltroRegion}
                                    value={filtroRegionVac}
                                >
                                    <option value='' selected disabled>Seleccione...</option>
                                    <option value='I'>I</option>
                                    <option value='II'>II</option>
                                    <option value='III'>III</option>
                                    <option value='IV'>IV</option>
                                    <option value='V'>V</option>
                                    <option value='VI'>VI</option>
                                    <option value='VII'>VII</option>
                                </select>
                                {(filtroRegionVac!="") &&
                                        <label 
                                            className="font-bold mx-2 cursor-pointer"
                                            onClick={handleCancelFiltroRegionVac}
                                        >X</label>
                                    }
                            </div>

                            {/**FILTRO ESPECIALIDAD */}
                            <div className="flex flex-row my-[4px] mx-2 text-start items-start">
                                <label className="font-semibold text-base mr-2">Especialidad:</label>
                                <select 
                                    className={` h-[24px] border-[1px] rounded focus:outline-none focus:ring-0 focus:border-none desktop-xl:text-lg
                                        ${(filtroEspecialidadVac==='')
                                            ?` w-[40mm]`
                                            :` w-[33mm]`
                                        }
                                        `}
                                    name="filtroRegion"
                                    onChange={handleSelectFiltroEspecialidadVac}
                                    value={filtroEspecialidadVac}
                                >
                                    <option value='' selected disabled>Seleccione...</option>
                                        {listadoEspecialidades
                                            ?.filter(especialidad=>especialidad.activo_visor_tit=="1")
                                            .map((especialidad, index)=>(
                                            <option
                                                key={index}
                                                value={especialidad.id_especialidad}
                                            >{especialidad.abreviatura}</option>
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

                {/* VISIBILIDAD DE BOTONES */}
                <div className="flex justify-center">
                    <button
                        className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                        onClick={closeModalFilter}
                        translate='no'
                    >CERRAR</button>

                    {/**
                    {(filtroRegionVac==='' && filtroModalidadVac==='') &&
                        <button
                            className="border-2 border-[#7C8EA6] mt-2 font-semibold w-40 h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                            onClick={submitCloseModalFilter}
                            translate='no'
                        >CERRAR</button>
                    }
                    {(filtroRegionVac!='' || filtroModalidadVac!='') &&
                        <div>
                            <button
                                className="border-2 border-[#7C8EA6] mt-2 font-semibold w-[30mm] h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={submitAplicarFiltrosModales}
                                translate='no'
                            >APLICAR</button>
                            <button
                                className="border-2 border-[#7C8EA6] mt-2 font-semibold w-[30mm] h-8 bg-[#7C8EA6] text-white shadow hover:bg-[#C9D991] hover:border-[#C9D991] rounded mx-2"
                                onClick={submitCloseModalFilter}
                                translate='no'
                            >CANCELAR</button>
                        </div>
                    }
                     
                     */}
                </div>

            </div>
        </div>
    );
};

export default ContentModalFiltroVacantesTit;