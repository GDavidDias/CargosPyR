const pool = require('../../database/connection.js');

module.exports = async (req, res) => {
    console.log('ingresa a getPageInscriptosMovPorDni');

    const {
        id_listado_inscriptos,
        limit,
        //idTipoInscripto,
        filtroAsignacion,
        //idListadoInscriptosCompara,
        idEspecialidadLuom,
        dniBuscado          // 👈 NUEVO campo: DNI exacto a buscar
    } = req.body;

    console.log('id_listado_inscriptos: ', id_listado_inscriptos);
    console.log('limit: ', limit);
    //console.log('idTipoInscripto: ', idTipoInscripto);
    console.log('filtroAsignacion: ', filtroAsignacion);
    //console.log('idListadoInscriptosCompara: ', idListadoInscriptosCompara);
    console.log('idEspecialidadLuom: ', idEspecialidadLuom);
    console.log('dniBuscado: ', dniBuscado);

    if (!dniBuscado) {
        return res.status(400).json({ ok: false, message: 'Falta dniBuscado' });
    }

    // ⚠️ Este baseQuery es casi igual a tu armaquery,
    // pero sin SELECT y sin LIMIT/OFFSET, porque lo vamos a reutilizar.
    let baseQuery = `
        FROM inscriptos_tit AS it
        LEFT JOIN especialidad AS e ON it.id_especialidad = e.id_especialidad 
        LEFT JOIN listado_inscriptos AS li ON it.id_listado_inscriptos = li.id_listado_inscriptos
        
        LEFT JOIN (
            SELECT at.id_inscripto_tit, at.id_vacante_tit 
            FROM asignacion_tit AS at 
            WHERE at.obs_desactiva IS NULL
        ) AS at2 ON it.id_inscriptos_tit = at2.id_inscripto_tit
    `;

    // Subconsulta que compara si el legajo ya tomo cargo en otro nivel
    {/**
        if (idListadoInscriptosCompara && idListadoInscriptosCompara != '') {
            baseQuery += `
            LEFT JOIN (
                SELECT DISTINCT im2.legajo
                FROM inscriptos_mov AS im2 
                JOIN (
                    SELECT am3.id_inscripto_mov 
                    FROM asignacion_mov AS am3 
                    WHERE am3.obs_desactiva IS NULL
                ) AS am4 ON im2.id_inscriptos_mov = am4.id_inscripto_mov
                WHERE im2.id_listado_inscriptos = ${idListadoInscriptosCompara}
            ) AS imCompara ON im.legajo = imCompara.legajo
            `;
        }
        
        */}

    // WHERE base (sin filtroBusqueda porque acá queremos TODO el listado)
    baseQuery += `
        WHERE it.id_listado_inscriptos = ${id_listado_inscriptos}
     
    `;
    {/*baseQuery += `
        WHERE it.id_listado_inscriptos = ${id_listado_inscriptos}
        AND it.id_tipo_inscripto IN (${idTipoInscripto})
    `;*/}

    if (filtroAsignacion === 'asignados') {
        baseQuery += ` AND at2.id_vacante_tit IS NOT NULL `;
    } else if (filtroAsignacion === 'sinasignar') {
        baseQuery += ` AND at2.id_vacante_tit IS NULL `;
    }

    // Filtro Luom Especialidad
    if (idEspecialidadLuom && idEspecialidadLuom != '') {
        baseQuery += ` AND it.id_especialidad = ${idEspecialidadLuom} `;
    }

    console.log('baseQuery construida: ', baseQuery);

    try {
        // 1️⃣ Buscar el id_inscriptos_mov del DNI buscado dentro de los mismos filtros
        const [targetRows] = await pool.query(
            `
            SELECT MIN(it.id_inscriptos_tit) AS target_id
            ${baseQuery}
            AND it.dni = ?
            `,
            [dniBuscado]
        );

        const targetId = targetRows[0]?.target_id;

        if (!targetId) {
            // No existe ese DNI bajo estos filtros
            return res.status(200).json({
                ok: true,
                found: false,
                message: 'No se encontró el DNI en el listado con los filtros actuales'
            });
        }

        // 2️⃣ Calcular la posición (cuántos registros hay hasta ese id_inscriptos_mov)
        const [posRows] = await pool.query(
            `
            SELECT COUNT(*) AS position
            ${baseQuery}
            AND it.id_inscriptos_tit <= ?
            `,
            [targetId]
        );

        const position = posRows[0]?.position || 0;

        if (position === 0) {
            return res.status(200).json({
                ok: true,
                found: false,
                message: 'No se pudo calcular la posición del DNI'
            });
        }

        // 3️⃣ Calcular la página donde cae esa posición
        //const pageNumber = Math.ceil(position / limit);
        const pageNumber = Math.ceil(position / limit);

        return res.status(200).json({
            ok: true,
            found: true,
            dni: dniBuscado,
            targetId,
            position,
            page: pageNumber,
        });

    } catch (error) {
        console.error('Error en getPageInscriptosMovPorDni:', error);
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};
