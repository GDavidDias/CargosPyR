import logo from '../../assets/logo_designacion.png';

const PaginaAsistencia = ({datosInscripto,id_nivel})=>{

    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.toLocaleString('es-ES',{month:'long'});
    const año = fechaActual.getFullYear();

    return(
        <div className='notranslate h-[49vh] border-2 border-zinc-300 p-4'>
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
            <div className='flex justify-center my-4'>
                <label
                    className='font-semibold text-lg my-2 underline '
                >CONSTANCIA DE ASISTENCIA</label>
            </div>
            {/* CUERPO */}
            <div className=''>
                <div className='flex flex-row mb-2'>
                    <p className='ml-24 font-normal'>Junta Provincial de Calificacion Docente, Sala {id_nivel===1 ?'Inicial' :'Primaria'}, hace constar que el/la </p>
                </div>
                <div className='flex flex-row mb-2'>
                    <p className='ml-2 font-normal'>Prof. </p>
                    <p className='border-b-[1px] border-black border-dotted w-[340px] text-center font-medium'>{datosInscripto.apellido}, {datosInscripto.nombre}</p>
                    <p className='ml-2 '>D.N.I. N°</p>
                    <p className='border-b-[1px] border-black border-dotted w-[100px] text-center font-medium'>{datosInscripto.dni}</p>
                    <p className='ml-2 '>Asistió a la </p>
                    <p className='ml-2  italic'>"Entrega</p>
                </div>
                <div className='flex flex-row mb-2'>
                    <p className='ml-2  italic'>de Cargos de Movimiento de Traslado, Cambio de Función y/o Disponibilidad",</p>
                    <p className='ml-2  italic'>  el/los dias: </p>
                    <p className='border-b-[1px] border-black border-dotted w-[100px] text-center font-medium'></p>
                </div>
                <div className='flex flex-row mb-2 mt-10'>
                    <p className='border-b-[1px] border-black border-dotted w-[500px] text-center font-medium'></p>
                </div>
                <div className='flex flex-row mb-4 justify-center'>
                    <p className='ml-2  '>Se extiende la misma para ser presentada ante las autoridades que la requieran.</p>
                </div>
                <div className='flex flex-row mb-4 justify-end'>
                    <p className='ml-2  '>San Salvador de Jujuy {dia} de {mes} de {año}.-</p>
                </div>
            </div>
        </div>
    )
};

export default PaginaAsistencia;