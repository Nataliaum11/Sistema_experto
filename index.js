const express = require('express');
const cors = require('cors');
const { prendasFemeninas, prendasMasculinas } = require('./data');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/tipos-prendas', (req, res) => {
    const { sexo } = req.body;
    if (!sexo) {
        return res.status(400).json({ error: "Sexo es obligatorio" });
    }
    let prendasSeleccionadas;
    if (sexo === 'femenino') {
        prendasSeleccionadas = prendasFemeninas;
    } else if (sexo === 'masculino') {
        prendasSeleccionadas = prendasMasculinas;
    } else {
        return res.status(400).json({ error: "Sexo inválido" });
    }

    const tiposPrendas = {};
    Object.keys(prendasSeleccionadas).forEach(categoria =>{
        tiposPrendas[categoria] = Object.keys(prendasSeleccionadas[categoria]);
    });
    res.json(tiposPrendas);
});

app.post('/descripciones-prendas', (req, res) => {
    try {
        const { sexo, tipoPrenda } = req.body;

        console.log('Datos recibidos en /descripciones-prendas:', req.body);

        if (!sexo || !tipoPrenda) {
            throw new Error("Sexo y tipo de prenda son obligatorios");
        }

        let prendasSeleccionadas;
        if (sexo === 'femenino') {
            prendasSeleccionadas = prendasFemeninas;
        } else if (sexo === 'masculino') {
            prendasSeleccionadas = prendasMasculinas;
        } else {
            throw new Error("Sexo inválido");
        }

        console.log('Prendas seleccionadas:', prendasSeleccionadas);

        const descripciones = [];

        tipoPrenda.forEach(tipo => {
            console.log('Buscando tipo de prenda:', tipo);
            let tipoEncontrado = false;

            Object.keys(prendasSeleccionadas).forEach(categoria => {
                console.log('Revisando categoría:', categoria);

                if (prendasSeleccionadas[categoria][tipo]) {
                    tipoEncontrado = true;
                    descripciones.push(...prendasSeleccionadas[categoria][tipo].map(prenda => prenda.descripcion));
                }
            });

            if (!tipoEncontrado) {
                console.log(`Tipo de prenda ${tipo} no encontrado en ninguna categoría.`);
            }
        });

        if (descripciones.length > 0) {
            res.json(descripciones);
        } else {
            throw new Error("No se encontraron descripciones para las prendas seleccionadas.");
        }

    } catch (error) {
        console.error('Error en /descripciones-prendas:', error.message);
        res.status(500).json({ error: error.message });
    }
});


app.post('/filtrar', (req, res) => {
    const { sexo, descripcion, estadoAnimo, estilo, clima, horario } = req.body;

    if (!sexo || !descripcion || !estadoAnimo || !estilo || !clima || !horario) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const prendasRecomendadas = filtrarPrendas(sexo, descripcion, estadoAnimo, estilo, clima, horario);
    res.json(prendasRecomendadas);
});

function filtrarPrendas(sexo, descripcion, estadoAnimo, estilo, clima, horario) {
    let prendasSeleccionadas;

    if (sexo === 'femenino') {
        prendasSeleccionadas = prendasFemeninas;
    } else if (sexo === 'masculino') {
        prendasSeleccionadas = prendasMasculinas;
    } else {
        return [];
    }

    const resultado = {};

    resultado.prendasSuperiores = Object.keys(prendasSeleccionadas.prendasSuperiores || {}).flatMap(tipoPrenda => 
        (prendasSeleccionadas.prendasSuperiores[tipoPrenda] || []).filter(prenda =>
            prenda.descripcion.includes(descripcion) &&
            prenda.estadoAnimo === estadoAnimo &&
            prenda.estilo === estilo &&
            prenda.clima === clima &&
            prenda.horario === horario
        )
        .map(prenda => ({ descripcion: prenda.descripcion }))
    );
    
    resultado.prendasInferiores = Object.keys(prendasSeleccionadas.prendasInferiores || {}).flatMap(tipoPrenda => 
        (prendasSeleccionadas.prendasInferiores[tipoPrenda] || []).filter(prenda =>
            prenda.descripcion.includes(descripcion) &&
            prenda.estadoAnimo === estadoAnimo &&
            prenda.estilo === estilo &&
            prenda.clima === clima &&
            prenda.horario === horario
        )
        .map(prenda => ({ descripcion: prenda.descripcion }))
    );
    
    if (sexo === 'femenino') {
        resultado.vestidos = Object.keys(prendasSeleccionadas.vestidos || {}).flatMap(tipoPrenda => 
            (prendasSeleccionadas.vestidos[tipoPrenda] || []).filter(prenda =>
                prenda.descripcion.includes(descripcion) &&
                prenda.estadoAnimo === estadoAnimo &&
                prenda.estilo === estilo &&
                prenda.clima === clima &&
                prenda.horario === horario
            )
            .map(prenda => ({ descripcion: prenda.descripcion }))
        );
    }

    resultado.zapatos = Object.keys(prendasSeleccionadas.zapatos || {}).flatMap(tipoPrenda => 
        (prendasSeleccionadas.zapatos[tipoPrenda] || []).filter(prenda =>
            prenda.descripcion.includes(descripcion) &&
            prenda.estadoAnimo === estadoAnimo &&
            prenda.estilo === estilo &&
            prenda.clima === clima &&
            prenda.horario === horario
        )
        .map(prenda => ({ descripcion: prenda.descripcion }))
    );

    return resultado;
}


app.listen (PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});