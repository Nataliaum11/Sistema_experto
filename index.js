const express = require('express');
const { prendasFemeninas, prendasMasculinas } = require('./data');
const app = express();
const PORT = process.env.PORT || 3001;

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
    const { sexo, tipoPrenda } = req.body;
    if (!sexo || !tipoPrenda) {
        return res.status(400).json({ error: "Sexo y tipo de prenda son obligatorios" });
    }

    let prendasSeleccionadas;
    if (sexo === 'femenino') {
        prendasSeleccionadas = prendasFemeninas;
    } else if (sexo === 'masculino') {
        prendasSeleccionadas = prendasMasculinas;
    } else {
        return res.status(400).json({ error: "Sexo inválido" });
    }

    if(prendasSeleccionadas[tipoPrenda]){
        const descripciones =Object.values(prendasSeleccionadas[tipoPrenda]).flat().map(prenda => ({
            descripciones: prenda.descripcion
    }));
    return res.json(descripciones);
    }
});

app.post('/filtrar', (req, res) => {
    const { sexo, estadoAnimo, estilo, clima, horario } = req.body;

    if (!sexo || !estadoAnimo || !estilo || !clima || !horario) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const prendasRecomendadas = filtrarPrendas(sexo, estadoAnimo, estilo, clima, horario);
    res.json(prendasRecomendadas);
});

function filtrarPrendas(sexo, estadoAnimo, estilo, clima, horario){
    let prendasSeleccionadas;

    if(sexo === 'femenino'){
        prendasSeleccionadas = prendasFemeninas;
    } else if(sexo === 'masculino'){
        prendasSeleccionadas = prendasMasculinas;
    }else{
        return
        [];
    }

    const resultado = {};

    resultado.prendasSuperiores = Object.keys(prendasSeleccionadas.prendasSuperiores || {}).flatMap(tipoPrenda => 
        (prendasSeleccionadas.prendasSuperiores[tipoPrenda] || []).filter(prenda =>
            prenda.estadoAnimo === estadoAnimo &&
            prenda.estilo === estilo &&
            prenda.clima === clima &&
            prenda.horario === horario
        )
        .map(prenda => ({ descripcion: prenda.descripcion }))
    );
    resultado.prendasInferiores = Object.keys(prendasSeleccionadas.prendasInferiores || {}).flatMap(tipoPrenda => 
        (prendasSeleccionadas.prendasInferiores[tipoPrenda] || []).filter(prenda =>
            prenda.estadoAnimo === estadoAnimo &&
            prenda.estilo === estilo &&
            prenda.clima === clima &&
            prenda.horario === horario
        )
        .map(prenda => ({ descripcion: prenda.descripcion }))
    );
    if(sexo === 'femenino') {
    resultado.vestidos = Object.keys(prendasSeleccionadas.vestidos || {}).flatMap(tipoPrenda => 
        (prendasSeleccionadas.vestidos[tipoPrenda] || []).filter(prenda =>
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
