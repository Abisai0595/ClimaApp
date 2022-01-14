const fs = require('fs');

const axios = require('axios');

class Busquedas{
    historial =[];
    dbPath = './db/database.json';

    constructor(){
            this.leerDB();
    }

    get historialCap(){
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras=palabras.map(p=>p[0].toUpperCase()+p.substring(1));
            return palabras.join('');
        })
    }

    get paramsMapbox(){
        return{
            'language':'es',
            'access_token':'pk.eyJ1IjoiYWJpc2FpMDU5NSIsImEiOiJja3licWNhNDgwMHZzMnFveGgyN3VvbGRiIn0.H9mKNoiABRafIA6oYIwGWw',
            'limit':5
        }
    }


    get paramsWeathe(){
        return{
            appid:process.env.OPENWEATHER_KEYS,
            units:'metric',
            lang:'es'
        }
    }

    async ciudad(lugar=''){

        try{
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params:this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id:lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        }
        catch{
            return [];
        }

    }

    async climaLugar(lat, lon)
    {
        try{
            //instancias de axiois
            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{...this.paramsWeathe, lat, lon}}
            );

            //resp.data
            const resp = await instance.get();
            const {weather, main}=resp.data;

            return {
                
                    desc:weather[0].description,
                    min:main.temp_min,
                    max:main.temp_max,
                    temp:main.temp
                }
                
            
        }
        catch
        {
            return[];
        }
    }

    agregarHistorial(lugar = ''){
        //prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase()))
        {
            return;
        }

        //solo guarda las ultimas 5 ciudades buscadas
        this.historial=this.historial.splice(0,5);

        //agrega el lugar al inicio del arreglo historial
        this.historial.unshift(lugar.toLocaleLowerCase());

        //guardar en BD
        this.guardarDb();
    }

    guardarDb(){
        const payload={
            historial:this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }
    leerDB(){
        //Debe existir la BD
        if(!fs.existsSync(this.dbPath)){
            return null;
        }

        //Leer BD
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial= data.historial;


    }
}


module.exports= Busquedas;