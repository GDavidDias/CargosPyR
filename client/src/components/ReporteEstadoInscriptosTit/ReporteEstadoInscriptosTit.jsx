const ReporteEstadoInscriptosTit = ({listado})=>{
    console.log('que tiene Reporte Estado Inscriptos: ', listado);
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
                        <th className="border-x-[1px] border-gray-500">Dni</th>
                        <th className="border-x-[1px] border-gray-500">Total</th>
                        <th className="border-x-[1px] border-gray-500">Nombre</th>
                        <th className="border-x-[1px] border-gray-500">Especialidad</th>
                        <th className="border-x-[1px] border-gray-500">Estado Inscripto</th>
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
                                {/*<td className="border-x-[1px] border-gray-500">{formattedDateTime}</td>*/}
                                <td className="border-x-[1px] border-gray-500">{item.especialidad}</td>
                                <td className="border-x-[1px] border-gray-500">{item.descripcion_estado_inscripto}</td>

                            </tr>
                        )

                        })
                    }
                </tbody>
            </table>
        </div>
    )
};

export default ReporteEstadoInscriptosTit;