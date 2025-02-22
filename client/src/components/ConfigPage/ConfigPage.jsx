import React, { useEffect, useState } from 'react'
import { fetchConfigComponente } from '../../utils/fetchConfigComponente';
import { fetchAllEspecialidades } from "../../utils/fetchAllEspecialidades.js";
import {URL} from '../../../varGlobal';
import axios from "axios";

import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit, FaEyeSlash} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { setConfigComp, setEspecialidadVisorTit } from '../../redux/configSlice';

{/*Se veran todos los accesos en modo administrador y se podra configurar que modulo mostrar o no
    Modulos:
    - Traslado y Cambio de Funcion Nivel Primario
    - Titularizacion
    - Reemplazantes
    - Supervisores
    - ??? (JyA)
    - 

    SE veran la configuracion para ver que especialidad se vera en el Visor de Vacantes de Titularizacion para Docentes
    */}
const ConfigPage = () => {
  const dispatch = useDispatch();

  /**ESTADOS GLOBALES */
  const configCompSG = useSelector((state)=>state.config.configComponente);
  const configEspVisorTitSG = useSelector((state)=>state.config.especialidadVisorTit);

  /**PROCESOS Y FUNCIONES */
  const submitOcultarComponente = async(data) =>{
    console.log('que entra a submitOcultarComponente: ', data);
    const formUpdComp = {
      "idComponente":data.id_component,
      "estadoActivo":""
    }
  
    /**Se desactiva el componente con vacio*/
    try{
        await axios.put(`${URL}/api/updactivocomponente`,formUpdComp)
          .then(async res=>{
              console.log('que trae res de updactivocomponente: ', res);
          })
          .catch(error=>{
              console.log('que trae error updactivocomponente: ', error);
          })
    }catch(error){
      console.error(error.message);
    }
  
    actualizaCompSG();

  };

  const submitMostrarComponente = async(data) =>{
    console.log('que ingresa a submitMostrarComponente: ', data);
    const formUpdComp = {
      "idComponente":data.id_component,
      "estadoActivo":1
    }

    /**Se activa el componente con 1 */
    try{
        await axios.put(`${URL}/api/updactivocomponente`,formUpdComp)
          .then(async res=>{
              console.log('que trae res de updactivocomponente: ', res);
          })
          .catch(error=>{
              console.log('que trae error updactivocomponente: ', error);
          })
    }catch(error){
      console.error(error.message);
    }

    actualizaCompSG();

  };

  const actualizaCompSG = async() => {
    /**Trae la configuracion de los componentes */
    const dataComp = await fetchConfigComponente();
    console.log('que trae fetchConfigComponente: ', dataComp);
    dispatch(setConfigComp(dataComp));
  };

  const actualizaEspecialidadVisorTit = async()=>{
    /**Trae la configuracion de todas las especialidades y su campo activo_visor_tit */
    const dataEspeVisorTit = await fetchAllEspecialidades();
    console.log('que trae fetchAllEspecialidades: ', dataEspeVisorTit);
    dispatch(setEspecialidadVisorTit(dataEspeVisorTit));
  };


  const submitDeshabilitarEspecialidad = async(data)=>{
    /**DESHABILITA la especialidad del Visor de Vacantes */
    console.log('presiono sobre submitDeshabilitarEspecialidad');

    const updEspVisor = {
      "idEspecialidad": data.id_especialidad,
      "activoVisor":""
    }
    /**Se Deshabilita especialidad con vacio */
    try{
      await axios.put(`${URL}/api/updespevisortit`,updEspVisor)
      .then(async res=>{
          console.log('que trae res de updespevisortit: ', res);
      })
      .catch(error=>{
          console.log('que trae error updespevisortit: ', error);
      })
    }catch(error){
      console.error(error.message);
    }

    actualizaEspecialidadVisorTit();
  };


  const submitHabilitarEspecialidad = async(data) =>{
    /**HABILITA la especialidad en el Visor de Vacantes de Docentes */
    console.log('presiono sobre submitHabilitarEspecialidad: ', data);

    const updEspVisor = {
      "idEspecialidad": data.id_especialidad,
      "activoVisor":1
    }
    
    /**Se habilita especialidad con 1 */
    try{
      await axios.put(`${URL}/api/updespevisortit`,updEspVisor)
      .then(async res=>{
          console.log('que trae res de updespevisortit: ', res);
      })
      .catch(error=>{
          console.log('que trae error updespevisortit: ', error);
      })
    }catch(error){
      console.error(error.message);
    }

    actualizaEspecialidadVisorTit();

  };
  

  useEffect(()=>{
    console.log('que tiene configComponente: ', configCompSG);
  },[configCompSG]);

  useEffect(()=>{
    console.log('que tiene configEspVisorTitSG: ', configEspVisorTitSG);
  },[configEspVisorTitSG])

  return (
    <div className='m-2'>
        {/*ENCABEZADO */}
        <div>
            <h1 className='font-bold'>CONFIGURACIONES</h1>
        </div>

        {/**CUERPO */}
        <div className="h-[79vh] overflow-y-auto">

          {/* CONFIGURACION DE VISUALIZACION DE COMPONENTES */}
          <div className="">
            <div>
              <h3 className='font-bold'>Visualizacion de componentes</h3>
            </div>
            <div>
              <table className="border-[1px] bg-slate-50 w-full">
                  <thead>
                      <tr className="sticky top-0 text-sm border-b-[1px] border-zinc-300 bg-zinc-200">
                          <th className="border-r-[1px] border-zinc-300">Id</th>
                          <th className="border-r-[1px] border-zinc-300">Componente</th>
                          <th className="border-r-[1px] border-zinc-300">Descripcion</th>
                          <th className="border-r-[1px] border-zinc-300">Activo</th>
                          <th className="">Acciones</th>
                      </tr>
                  </thead>
                  <tbody> 
                      {
                          // filterListadoInscriptosMov?.map((inscripto, index)=>{
                          configCompSG?.map((componente, index)=>{
                              const colorFila = (((componente.id_component % 2)===0) ?`bg-zinc-200` :``)
                              return(
                                  <tr 
                                      className={`text-lg font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 ${colorFila}`}
                                      key={index}
                                  >
                                      <td className="text-center">{componente.id_component}</td>
                                      <td className="text-center">{componente.componente}</td>
                                      {/* <td>{inscripto.apellido}</td> */}
                                      <td>{componente.descripcion}</td>
                                      <td>{componente.active}</td>
                                      <td>
                                          <div className="flex flex-row items-center justify-center  ">
                                              {/* {(inscripto.vacante_asignada===null )
                                                  ?<FiAlertTriangle    
                                                      className="mr-2 blink text-red-500"
                                                      />
                                                  :``
                                              } */}
                                              {(componente.active === 1 || componente.active === "1")
                                                ?<FaEye 
                                                    className="hover:cursor-pointer hover:text-[#83F272]" 
                                                    title="Componente Visible"
                                                    onClick={()=>submitOcultarComponente(componente)}
                                                />
                                                :<FaEyeSlash
                                                    className='hover:cursor-pointer hover:text-[#83F272]'
                                                    title='Componente Oculto'
                                                    onClick={()=>submitMostrarComponente(componente)}
                                                  />
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

          {/**CONFIGURACION DE ESPECIALIDADES A MOSTRAR EN LISTADO_VACANTES_TITULARIZACION */}
          <div className='mt-4'>
            <div>
              <h3 className='font-bold'>Especialidades a Mostrar en Listado de Vacantes - TITULARIZACIONES</h3>
            </div>
            <div>
              <table className="border-[1px] bg-slate-50 w-full">
                  <thead>
                      <tr className="sticky top-0 text-sm border-b-[1px] border-zinc-300 bg-zinc-200">
                          <th className="border-r-[1px] border-zinc-300">Id</th>
                          <th className="border-r-[1px] border-zinc-300">Especialidad</th>
                          <th className="border-r-[1px] border-zinc-300">Abr.</th>
                          <th className="border-r-[1px] border-zinc-300">Activo en Visor</th>
                          <th className="">Acciones</th>
                      </tr>
                  </thead>
                  <tbody> 
                      {
                          // filterListadoInscriptosMov?.map((inscripto, index)=>{
                          configEspVisorTitSG?.map((especialidad, index)=>{
                              const colorFila = (((especialidad.id_especialidad % 2)===0) ?`bg-zinc-200` :``)
                              return(
                                  <tr 
                                      className={`text-base font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 ${colorFila}`}
                                      key={index}
                                  >
                                      <td className="text-center">{especialidad.id_especialidad}</td>
                                      <td className="text-center">{especialidad.descripcion}</td>
                                      {/* <td>{inscripto.apellido}</td> */}
                                      <td className='text-center'>{especialidad.abreviatura}</td>
                                      <td className='text-center'>{especialidad.activo_visor_tit}</td>
                                      <td>
                                          <div className="flex flex-row items-center justify-center  ">
                                              {/* {(inscripto.vacante_asignada===null )
                                                  ?<FiAlertTriangle    
                                                      className="mr-2 blink text-red-500"
                                                      />
                                                  :``
                                              } */}
                                              {(especialidad.activo_visor_tit === 1 || especialidad.activo_visor_tit === "1")
                                                ?<FaEye 
                                                    className="hover:cursor-pointer hover:text-[#83F272]" 
                                                    title="Componente Visible"
                                                    onClick={()=>submitDeshabilitarEspecialidad(especialidad)}
                                                />
                                                :<FaEyeSlash
                                                    className='hover:cursor-pointer hover:text-[#83F272]'
                                                    title='Componente Oculto'
                                                    onClick={()=>submitHabilitarEspecialidad(especialidad)}
                                                  />
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

        </div>
    </div>
  )
}

export default ConfigPage