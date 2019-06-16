const superagent = require('superagent');
const babar = require('babar');

const URL = 'https://elecciones.santafe.gob.ar/provincia/gobernador';

const getElection = () => superagent
  .get(URL)
  .set('X-Requested-With', 'XMLHttpRequest')
  .set('User-Agent', `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36`)
  .set('Accept', 'application/json, text/javascript, */*; q=0.01')

const getPercentage = (votes, total) => (votes * 100) / total;
const clear = 


setInterval( async  () => {
  try {
    const { body: values } = await getElection();

    const {
      detalle,
      cabecera 
    } = values;

    console.log(cabecera);

    const [ fpcysRaw, juntosRaw, cambiemosRaw ] = detalle;

    const fpcys = {
      cantidadVotos: parseInt(fpcysRaw.cantidad),
      nombre: fpcysRaw.candidato
    }

    const juntos = {
      cantidadVotos: parseInt(juntosRaw.cantidad),
      nombre: juntosRaw.candidato
    }

    const cambiemos = {
      cantidadVotos: parseInt(cambiemosRaw.cantidad),
      nombre: cambiemosRaw.candidato
    }

    const totalVotes = fpcys.cantidadVotos + juntos.cantidadVotos + cambiemos.cantidadVotos;

    fpcys.percentage = getPercentage(fpcys.cantidadVotos, totalVotes) || 0;
    juntos.percentage = getPercentage(juntos.cantidadVotos, totalVotes) || 0;
    cambiemos.percentage = getPercentage(cambiemos.cantidadVotos, totalVotes) || 0;

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

    console.log('\n');
    console.log(`0 - ${fpcys.nombre}, ${fpcys.percentage.toFixed(2)}%`);
    console.log(`1 - ${juntos.nombre}, ${juntos.percentage.toFixed(2)}%`);
    console.log(`2 - ${cambiemos.nombre}, ${cambiemos.percentage.toFixed(2)}%`);

    console.log(`\n\Mesas: (${cabecera[0].mesasIngresadas}/${cabecera[0].totalMesas})`);
    console.log(`Escrutadas ${cabecera[0].porcentajeMesas}`);
    console.log(cabecera[0].fechaHoraInformacion);

  } catch (error) {
    console.log(error);
  }


}, 5000);

