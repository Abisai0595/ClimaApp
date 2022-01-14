require('dotenv').config();


const {leerInput, inquirerMenu, pausa, listarLugares}=require('./helpers/inquirer');
const Busquedas = require('./models/busqueda')


const main = async() => {
let opcion = '';
const busquedas = new Busquedas();
const ciudadBD = busquedas.leerDB();

do{
    opcion = await inquirerMenu();
    switch(opcion)
    {
        case 1:
            //Mostrar mensaje
            console.clear();
            console.clear();
            const termino = await leerInput('Ciudad: ');
            const lugares = await busquedas.ciudad(termino);
            const id = await listarLugares(lugares);

            //si es igual a 0 regresa al menu principal
            if(id === '0') continue;


            const lugarSel=lugares.find(l => l.id === id); 
            
            //guardar en db
            busquedas.agregarHistorial(lugarSel.nombre);

        
            //clima
            const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);
        
        
            //Mostrar resultados
            console.clear();
            console.clear();

            console.log('\nInformacion de la ciudad\n'.blue);
            console.log('Ciudad: ', lugarSel.nombre.green );
            console.log('Lat: ', lugarSel.lat);
            console.log('Lng: ',lugarSel.lng);
            console.log('Temperatura: ',clima.temp );
            console.log('Minima: ',clima.min );
            console.log('Maxima: ',clima.max );
            console.log('Descripcion: ',clima.desc.green);





            break;

        case 2:
            busquedas.historialCap.forEach((lugar,i)=>{
                const idx = `${i+1}.`.blue;
                console.log(`${idx} ${lugar}`);
            })
            break;
    }
    if(opcion!== 0)  await pausa();
}while(opcion !== '0');


}

main();