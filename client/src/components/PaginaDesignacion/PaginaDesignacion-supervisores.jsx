import logo from '../../assets/logo_designacion.png';
import { useEffect, useState } from 'react';

const PaginaDesignacion = ({datosInscripto, datosVacante,id_nivel}) =>{
//console.log('que tiene id_nivel en PaginaDesignacion: ', id_nivel);

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
        <div className='notranslate h-[49vh] border-2 border-gray-300 p-4'>
            {/* ENCABEZADO */}
            <div className="w-full flex flex-row items-center justify-between">
                <div className="w-[25%] flex">
                    <img src={logo} className='w-[55%]'/>
                </div>
                <div className="w-[50%] flex flex-col items-center">
                    <p className='text-sm font-semibold'>MINISTERIO DE EDUCACION</p>
                    <p className='text-sm font-semibold'>Sala {id_nivel===1 ?'Inicial' :'Primaria'} de JPCD</p>
                </div>
                <div className="w-[25%] flex flex-col items-center ">
                    <p className='text-xs font-semibold'>Av. España N° 1630</p>
                    <p className='text-xs font-semibold'>San Salvador de Jujuy</p>
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
                        <p className='font-medium'>Resolucion N°:</p>   
                        <p className='border-b-[1px] border-black border-dotted w-[300px] text-center'>{(datosVacante.resolucion) ?datosVacante.resolucion :`---------------------------------------------`}</p>
                    </div>
                    <div className='flex flex-row'>
                        <p className='font-medium'>Fecha: {dia} de {mes} de {año}</p>
                        <p className='ml-4 font-medium'>Hora: {horaActual}</p>
                    </div>
                    <p className='font-semibold mt-[10px]'>DATOS DEL DOCENTE</p>
                    <div className='flex flex-row'>
                        <p className='ml-2 font-medium'>Legajo N°: </p>
                        <p className='border-b-[1px] border-black border-dotted w-[80px] text-center'>{datosInscripto.legajo}</p>
                        <p className='ml-2 font-medium'>Puntaje:</p> 
                        <p className='border-b-[1px] border-black border-dotted w-[80px] text-center'>{datosInscripto.total}</p>
                        <p className='ml-2 font-medium'>Cargo de Origen:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[100px] text-center'>{datosInscripto.cargo_actual} </p>
                        <p className='ml-2 font-medium'>DNI N°:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[110px] text-center mr-4'>{datosInscripto.dni}</p>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p className='ml-2 font-medium'>Apellido:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[200px] text-center'>{datosInscripto.apellido}</p> 
                        <p className='font-medium'>Nombres:</p> 
                        <p className='border-b-[1px] border-black border-dotted w-[300px] text-center'>{datosInscripto.nombre} </p>
                    </div>

                    <div className='flex flex-row mt-[2px]'>
                        <p className='ml-2 font-medium'>Institucion de Origen:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[300px] text-center'>{(datosInscripto.nro_escuela) ?datosInscripto.nro_escuela :`----------------------------`}</p>
                    </div>
                    <p className='font-semibold mt-[10px]'>DATOS DEL CARGO</p>
                    <div className='flex flex-row'>
                        {/* <p>NUMERO DE CARGO: </p>
                        <p className='border-b-[1px] border-black w-[100px] text-center'>{datosVacante.orden}</p> */}
                        <p className='ml-2 font-medium'>Movimiento:</p>
                        {/* <p className='border-b-[1px] border-black border-dotted w-[180px] text-center'>{leyendaMovimiento(datosInscripto.id_tipo_inscripto)}</p> */}
                        <p className='border-b-[1px] border-black border-dotted w-[120px] text-center'>ASCENSO</p>
                        {/* <p className='ml-2 font-medium'>Modalidad:</p> */}
                        <p className='ml-2 font-medium'>Caracter:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[110px] text-center'>{(datosVacante.modalidad) ?datosVacante.modalidad :`--------------`}</p>
                        <p className='ml-2 font-medium'>Cargo de Destino:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[180px] text-center'>{datosVacante.cargo}</p>

                    </div>
                    <div className='flex flex-row mt-[2px]'>
                    </div>
                    <div className='flex flex-row mt-[2px]'>
                        <p className='ml-2 font-medium'>Institucion de Destino:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[400px] text-center'>{datosVacante.establecimiento} - {datosVacante.obs_establecimiento}</p>
                    </div>
                    
                    <div className='flex flex-row mt-[2px]'>
                        <p className='ml-2 font-medium'>Turno:</p>
                        {(datosVacante.turno)
                            ?<p className='border-b-[1px] border-black border-dotted w-[200px] text-center'>{datosVacante.turno}</p>
                            :<p className='border-b-[1px] border-black border-dotted w-[200px] text-start'>-----------------------------</p>
                        }
                        {/* <p className='border-b-[1px] border-black border-dotted w-[200px] text-center'>{(datosVacante.turno) ?datosVacante.turno :`----`}</p> */}
                        <p className='font-medium'>Cupof:</p>
                        <p className='border-b-[1px] border-black border-dotted w-[100px] text-center'>{(datosVacante.cupof) ?datosVacante.cupof :`-------------`}</p>

                    </div>
                </div>
            </div>
            {/* PIE IMPRESION */}
            <div className='flex flex-row h-[18vh] justify-start items-end '>
                <p className='text-[0.7rem] font-semibold border-[1px] border-b-gray-500'>Nota: </p>
                <p className='text-[0.7rem] border-[1px] border-b-gray-500'>La presente queda sujeta a la Resolución de sumarios, recursos, impugnaciones u observaciones conforme lo prevee la normativa vigente.</p>
            </div>
        </div>
    )
};

export default PaginaDesignacion;