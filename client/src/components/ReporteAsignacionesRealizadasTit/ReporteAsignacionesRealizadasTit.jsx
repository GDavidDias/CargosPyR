const ReporteAsignacionesRealizadasTit = ({listado})=>{
    console.log('que tieen listado: ', listado);
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const year = date.getFullYear();
      
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
      }
 
    return(
        <div>
            <table className="border-[1px] bg-slate-50 w-full page-break-after border">
                <thead>
                    <tr className="sticky top-0 text-sm border-b-[1px] border-gray-500 bg-zinc-200">
                        {/**<th className="border-x-[1px] border-gray-500">Legajo</th>*/}
                        <th className="border-x-[1px] border-gray-500">Dni</th>
                        <th className="border-x-[1px] border-gray-500">Total</th>
                        <th className="border-x-[1px] border-gray-500">Nombre</th>
                        {/**<th className="border-x-[1px] border-gray-500">Nombre</th>*/}
                        <th className="border-x-[1px] border-gray-500">Fecha y Hora Designacion</th>
                        <th className="border-x-[1px] border-gray-500">Cargo que Toma</th>
                        <th className="border-x-[1px] border-gray-500">Turno que Toma</th>
                        <th className="border-x-[1px] border-gray-500">Modalidad</th>
                        <th className="border-x-[1px] border-gray-500">Cupof</th>
                        <th className="border-x-[1px] border-gray-500">N° Escuela que Toma</th>
                        <th className="border-x-[1px] border-gray-500">Region</th>
                        <th className="border-x-[1px] border-gray-500">Departamento</th>
                        <th className="border-x-[1px] border-gray-500">Localidad</th>
                        <th className="border-x-[1px] border-gray-500">Zona</th>
                        <th className="border-x-[1px] border-gray-500">Resolucion</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listado?.map((item,index)=>{
                            const formattedDateTime = formatDateTime(item.datetime_asignacion);
                            //console.log(formattedDateTime); // Salida: "12/09/2024 - 11:03:42"
                            return(
                            <tr key={index} className="border-[1px] border-gray-500 bg-white text-sm text-center break-inside-avoid">
                                <td className="border-x-[1px] border-gray-500">{item.dni}</td>
                                <td className="border-x-[1px] border-gray-500">{item.total}</td>
                                <td className="border-x-[1px] border-gray-500">{item.apellido}</td>
                                <td className="border-x-[1px] border-gray-500">{formattedDateTime}</td>
                                <td className="border-x-[1px] border-gray-500">{item.cargo_toma}</td>
                                <td className="border-x-[1px] border-gray-500">{item.turno}</td>
                                <td className="border-x-[1px] border-gray-500">{item.modalidad}</td>
                                <td className="border-x-[1px] border-gray-500">{item.cupof}</td>
                                <td className="border-x-[1px] border-gray-500">{item.nro_escuela_toma} {item.nombre_establecimiento}</td>
                                <td className="border-x-[1px] border-gray-500">{item.region}</td>
                                <td className="border-x-[1px] border-gray-500">{item.departamento}</td>
                                <td className="border-x-[1px] border-gray-500">{item.localidad}</td>
                                <td className="border-x-[1px] border-gray-500">{item.zona}</td>
                                <td className="border-x-[1px] border-gray-500">{item.resolucion}</td>
                            </tr>
                        )

                        })
                    }
                </tbody>
            </table>
        </div>
    )
};

export default ReporteAsignacionesRealizadasTit;