const ReporteVacantesDisponibles = ({listado})=>{
    return(
        <div>
            <table className="border-[1px] bg-slate-50 w-full page-break-after border">
                <thead>
                    <tr className="sticky top-0 text-sm border-b-[1px] border-gray-500 bg-zinc-200">
                        <th className="border-x-[1px] border-gray-500">Orden</th>
                        <th className="border-x-[1px] border-gray-500">Cargo</th>
                        <th className="border-x-[1px] border-gray-500">Cupof</th>
                        <th className="border-x-[1px] border-gray-500">N°Escuela</th>
                        <th className="border-x-[1px] border-gray-500">Nombre Escuela</th>
                        <th className="border-x-[1px] border-gray-500">Turno</th>
                        <th className="border-x-[1px] border-gray-500">Modalidad</th>
                        <th className="border-x-[1px] border-gray-500">Region</th>
                        <th className="border-x-[1px] border-gray-500">Departamento</th>
                        <th className="border-x-[1px] border-gray-500">Localidad</th>
                        <th className="border-x-[1px] border-gray-500">Zona</th>
                        <th className="border-x-[1px] border-gray-500">Resolucion</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listado?.map((item,index)=>(
                            <tr key={index} className="border-[1px] border-gray-500 bg-white text-sm text-center break-inside-avoid">
                                <td className="border-x-[1px] border-gray-500">{item.orden}</td>
                                <td className="border-x-[1px] border-gray-500">{item.cargo}</td>
                                <td className="border-x-[1px] border-gray-500">{item.cupof}</td>
                                <td className="border-x-[1px] border-gray-500">{item.establecimiento}</td>
                                <td className="border-x-[1px] border-gray-500">{item.obs_establecimiento}</td>
                                <td className="border-x-[1px] border-gray-500">{item.turno}</td>
                                <td className="border-x-[1px] border-gray-500">{item.modalidad}</td>
                                <td className="border-x-[1px] border-gray-500">{item.region}</td>
                                <td className="border-x-[1px] border-gray-500">{item.departamento}</td>
                                <td className="border-x-[1px] border-gray-500">{item.localidad}</td>
                                <td className="border-x-[1px] border-gray-500">{item.zona}</td>
                                <td className="border-x-[1px] border-gray-500">{item.resolucion}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
};

export default ReporteVacantesDisponibles;