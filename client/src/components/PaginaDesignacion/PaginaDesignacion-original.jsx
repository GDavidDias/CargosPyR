import logo from '../../assets/logo_designacion.png';
import { useEffect, useState } from 'react';

const PaginaDesignacion = ({datosInscripto, datosVacante,id_nivel}) =>{
console.log('que tiene id_nivel en PaginaDesignacion: ', id_nivel);

    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.toLocaleString('es-ES',{month:'long'});
    const año = fechaActual.getFullYear();

    const horaActual = new Date().toLocaleString('es-ES',{
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
    });

    function leyendaMovimiento(tipoMovimiento){
        let datamov='';
        if(tipoMovimiento===1){
            datamov='Disponibilidad';
        }else if(tipoMovimiento===2){
            datamov='Traslado';
        }else if(tipoMovimiento===3){
            datamov='Cambio de Funcion'
        }

        return datamov;
    };

    
    return(
        <div className='notranslate h-[96vh] border-2 border-zinc-300 p-4'>
            {/* ENCABEZADO */}
            <div className="w-full flex flex-row items-center justify-between">
                <div className="w-[25%] flex">
                    <img src={logo} className='w-[60%]'/>
                </div>
                <div className="w-[50%] flex flex-col items-center">
                    <p className='text-sm font-semibold'>MINISTERIO DE EDUCACION</p>
                    <p className='text-sm font-semibold'>Sala {id_nivel===1 ?'Inicial' :'Primaria'} de JPCD</p>
                </div>
                <div className="w-[25%] flex flex-col items-center ">
                    <p className='text-sm font-semibold'>Av. España N° 1630</p>
                    <p className='text-sm font-semibold'>San Salvador de Jujuy</p>
                </div>
                
            </div>
            {/* TITULO */}
            <div className='flex justify-center'>
                <label
                    className='font-bold text-lg my-2 underline '
                >CONSTANCIA DE DESIGNACION</label>
            </div>
            {/* CUERPO */}
            <div>
                <div className='flex flex-col items-start'>
                    {/* <p className='text-justify indent-8'>JPCD - Sala Primaria hace constar que el/la Prof.  DNI N°   con el cargo         de la    con un puntaje     , Acepta el        en el cargo de     Titular en     . correspondiente al turno      </p> */}
                    <div className='flex flex-row mb-[4px]'>
                        <p>RESOLUCION N°:</p>   
                        <p className='border-b-[1px] border-black w-[300px] text-center'>{datosVacante.resolucion}</p>
                    </div>
                    <div className='flex flex-row'>
                        <p>FECHA: {dia} de {mes} de {año}</p>
                        <p className='ml-4'>HORA: {horaActual}</p>
                    </div>
                    <p className='font-semibold mt-[4px]'>Datos del Docente</p>
                    <div className='flex flex-row'>
                        <p>LEGAJO N°: </p>
                        <p className='border-b-[1px] border-black w-[100px] text-center'>{datosInscripto.legajo}</p>
                        <p className='ml-8'>PUNTAJE:</p> 
                        <p className='border-b-[1px] border-black w-[100px] text-center'>{datosInscripto.total}</p>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p>APELLIDO:</p>
                        <p className='border-b-[1px] border-black w-[200px] text-center'>{datosInscripto.apellido}</p> 
                        <p>NOMBRES:</p> 
                        <p className='border-b-[1px] border-black w-[300px] text-center'>{datosInscripto.nombre} </p>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p>DNI N°:</p>
                        <p className='border-b-[1px] border-black w-[100px] text-center mr-4'>{datosInscripto.dni}</p>
                        <p>CARGO DE ORIGEN:</p>
                        <p className='border-b-[1px] border-black w-[100px] text-center'>{datosInscripto.cargo_actual} </p>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p>INSTITUCION DE ORIGEN:</p>
                        <p className='border-b-[1px] border-black w-[300px] text-center'>{datosInscripto.nro_escuela}</p>
                    </div>
                    <p className='font-semibold mt-[4px]'>Datos del Cargo</p>
                    <div className='flex flex-row'>
                        <p>NUMERO DE CARGO: </p>
                        <p className='border-b-[1px] border-black w-[100px] text-center'>{datosVacante.orden}</p>
                        <p>MOVIMIENTO:</p>
                        <p className='border-b-[1px] border-black w-[200px] text-center'>{leyendaMovimiento(datosInscripto.id_tipo_inscripto)}</p>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p>INSTITUCION DE DESTINO:</p>
                        <p className='border-b-[1px] border-black w-[400px] text-center'>{datosVacante.establecimiento}</p>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p>CARGO DE DESTINO:</p>
                        <p className='border-b-[1px] border-black w-[200px] text-center'>{datosVacante.cargo}</p>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p>TURNO:</p>
                        <p className='border-b-[1px] border-black w-[200px] text-center'>{datosVacante.turno}</p>
                        <p>CUPOF:</p>
                        <p className='border-b-[1px] border-black w-[100px] text-center'>{datosVacante.cupof}</p>

                    </div>
                </div>
            </div>
            {/* PIE IMPRESION */}
            <div className='flex flex-row h-[24vh] justify-start items-end'>
                <p className='text-[0.7rem] font-semibold border-[1px] border-b-gray-500'>Nota: </p>
                <p className='text-[0.7rem] border-[1px] border-b-gray-500'>La presente queda sujeta a la Resolucion de sumarios, recursos, impugnaciones u observaciones conformelo prevee la normativa vigente.</p>
            </div>
        </div>
    )
};

export default PaginaDesignacion;