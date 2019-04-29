const superagent = require('superagent');
const babar = require('babar');

const URL = 'https://elecciones.santafe.gob.ar/provincia/gobernador';

const getElection = () => superagent.get(URL).set('X-Requested-With', 'XMLHttpRequest');
const getPercentage = (votes, total) => (votes * 100) / total;
const clear = 


setInterval( async  () => {
  try {
    const { body: values } = await getElection();

    const {
      detalle,
      cabecera 
    } = values;

    const fpcys = {
      cantidadVotos: parseInt(detalle[0].cantidadOrden),
      nombre: detalle[1].nombreCandidato
    };

    const juntos = {
      cantidadVotos: parseInt(detalle[4].cantidadOrden),
      nombre: detalle[4].nombre,
      sumar: {
        cantidadVotos: parseInt(detalle[5].cantidadOrden),
        nombre: detalle[5].nombreCandidato
      },
      epsf: {
        cantidadVotos: parseInt(detalle[6].cantidadOrden),
        nombre: detalle[6].nombreCandidato
      }
    };

    const cambiemos = {
      cantidadVotos: parseInt(detalle[9].cantidadOrden),
      nombre: detalle[10].nombreCandidato
    };

    const totalVotes = fpcys.cantidadVotos + juntos.cantidadVotos + cambiemos.cantidadVotos;

    fpcys.percentage = getPercentage(fpcys.cantidadVotos, totalVotes);
    juntos.percentage = getPercentage(juntos.cantidadVotos, totalVotes);
    cambiemos.percentage = getPercentage(cambiemos.cantidadVotos, totalVotes);

    process.stdout.write('\033c');
    
    const dataset = [
      [0, fpcys.percentage ],
      [1, juntos.percentage ],
      [2, cambiemos.percentage ]
    ];

    console.log(babar(dataset, {
      color: 'green',
      width: 40, 
      height: 25, 
      maxY: 100, 
      minY: 1,
    }));

    console.log(`${fpcys.nombre}, ${fpcys.percentage.toFixed(2)}%`);
    console.log(`${juntos.nombre}, ${juntos.percentage.toFixed(2)}%`);
    console.log(`${cambiemos.nombre}, ${cambiemos.percentage.toFixed(2)}%`);
    console.log(`\nEscrutadas ${cabecera[0].porcentajeMesas}`);
    console.log(cabecera[0].fechaHoraInformacion);

  } catch (error) {
    console.log(error);
  }


}, 5000);

