const inquirer = require('inquirer');
require('colors');

const preguntas=[
    {
        type:'list',
        name:'opcion',
        message:'¿Que desea hacer?',
        choices:[
            {
                value: 1,
                name: `${'1.'.blue} Buscar`
            },
            {
                value: 2,
                name:`${'2.'.blue} Historial`
            },
            {
                value: 3,
                name: `${'3.'.blue} Salir`
            },
        ]
    }
];


const inquirerMenu = async() =>{
        console.clear(); 
        console.log('====================='.blue);
        console.log('Seleccione una opcion'.white);
        console.log('====================='.blue);

    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;
}

//Pausa la pantalla para visualizar los datos
const pausa=async()=>{
    const question =[
        {
            type:'input',
            name:`enter`,
            message: `presione ${'ENTER' .blue} para continuar`
        }
    ]
    console.log('\n');
    await inquirer.prompt(question);
}

//verifica que se ingrese un valor al crear una tarea 
const leerInput = async(mensaje)=>{
    const question=[
        {
            type:'input',
            name: 'ciudad',
            mensaje,
            validate(value){
                if(value.length === 0){
                    return 'Ingresa un valor'
                }
                return true;
            }
        }
    ];

    const{ciudad} = await inquirer.prompt(question);
    return ciudad;
}

const listarLugares= async( lugares=[])=>{
    const choices = lugares.map((lugar, i)=>{
        const idx = ` ${i+1}.`.blue;

        return{
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: ' 0.'.blue + ' Cancelar'
    })
    const preguntas =[
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const {id}=await inquirer.prompt(preguntas);
    return(id);
}

const mostrarCheckList = async( tareas=[])=>{
    const choices = tareas.map((tarea, i)=>{
        const idx = ` ${i+1}.`.blue;

        return{
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn)?true:false
        }
    });

    const pregunta =[
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const {ids}=await inquirer.prompt(pregunta);
    return(ids);
}

const  confirmar = async (message)=>{
    const question=[
        {
        type:'confirm',
        name: 'ok',
        message
        }
    ];
    const {ok}= await inquirer.prompt(question);
    return ok;
}

module.exports={
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarCheckList
}