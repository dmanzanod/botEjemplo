const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const axios = require('axios')

var nombre = "";
var usuarioNombre ="";

const DatosPersonales = [];
const DatosInicioSesion = [];

let GLOBAL_STATE = {};

const guardarDatos = async () => {

    var data = JSON.stringify({
      'username': DatosPersonales[4],
      'email': DatosPersonales[4],
      'provider': 'local',
      'password': DatosPersonales[5],
      'confirmed': '1',
      'blocked': '0',
      'role': '1',
      'phone': DatosPersonales[1],
      'name' : DatosPersonales[0],
      'lastname': DatosPersonales[2],
      'motherlastname': DatosPersonales[3]
    });

    var config = {
      method: 'post',
      url: 'https://strapi-mysql-mrp-production.up.railway.app/api/Users',
      headers: { 
        'Authorization': 'Bearer f847dc8631775725c2e3ffb73b0c53373e4415f35d411b5fea9264370be1c05b8bac1af03452994d47b0dc33a43a3fdd676f67babf01e92f9b803ca7209b12babca79c97aab129102059afc7ca67d37d79030fb423db0103bd296e42a9875e580a9a62b100b8f61c6c30805e127a628d3c4b122c54fa2063054d4cf212cedae0',
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

    const flowsolicitaAyuda = addKeyword('c').addAnswer('Ok. Te estamos derivando...')

    const flow = addKeyword(['a'])
        .addAnswer('PREUNTA DE EDAD DE EJEMPLO', { capture: true, delay: 2000}, async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body !== '18') {
                return fallBack('Ups creo que no eres mayor de edad')
            }
            return flowDynamic('Bien tu edad es correcta!')
        })
        .addAnswer('Puedes pasar', {delay: 2000}, null, [flowsolicitaAyuda])

    
    const flowMiPerfil2 = addKeyword('a').addAnswer('Esta es la iformación de tu perfil:', {delay: 2000}, async (ctx, {gotoFlow, flowDynamic}) => {
                                    var data = JSON.stringify({
                                    "username": "dmanzano1@usm.cl"
                                    });
                                    
                                    var config = {
                                    method: 'get',
                                    url: 'https://strapi-mysql-mrp-production.up.railway.app/api/users?filters[username][$eq]=dmanzano1@usm.cl',
                                    headers: { 
                                        'Authorization': 'Bearer f847dc8631775725c2e3ffb73b0c53373e4415f35d411b5fea9264370be1c05b8bac1af03452994d47b0dc33a43a3fdd676f67babf01e92f9b803ca7209b12babca79c97aab129102059afc7ca67d37d79030fb423db0103bd296e42a9875e580a9a62b100b8f61c6c30805e127a628d3c4b122c54fa2063054d4cf212cedae0', 
                                        'Content-Type': 'application/json'
                                    },
                                    data : data
                                    };
                                        
                                        const respuesta = await axios(config);
                                        const datosPerfilUsuario = JSON.parse(JSON.stringify(respuesta.data));
                                        flowDynamic(["*Nombre:* " + datosPerfilUsuario[0].name + "\n*Apellido Paterno:* " + datosPerfilUsuario[0].lastname + "\n*Apellido Materno:* " + datosPerfilUsuario[0].motherlastname + "\n*Correo:* " + datosPerfilUsuario[0].email + "\n*Teléfono:* " + datosPerfilUsuario[0].phone]);
                                    })
                                    .addAnswer(['*a)* Actualizar Datos', '*b)* Volver al Menú', '*c)* Solicitar Ayuda'], {delay: 2000}, null, [flow, flowsolicitaAyuda])                                        
    
    
    const flowMiPerfil = addKeyword('####_SDASD_####').addAnswer('*' + DatosInicioSesion[2] + '* selecciona alguna de las siguientes alternativas', {delay:2000}, null)
                                    .addAnswer(
                                    [
                                            '*a)* Mi Perfil',
                                            '*b)* Calendario de Citas',
                                            '*c)* Alarmas Programadas',
                                            '*d)* Folletos Informativos',
                                            '*e)* Registros Fotograficos',
                                            '*f)* Registros de Fármacos',
                                            '*g)* Informativo Fármacos',
                                            '*h)* Registro CSV',
                                            '*i)* Registro EVA',
                                            '*j)* Preguntas Frecuentes',
                                            '*k)* Contacto'
                                    ],
                                    {delay:2000},
                                    null,
                                    [flowMiPerfil2]
                                )
                                
    const flowInicioSession = addKeyword(['a', 'A']).addAnswer('A continuación te pediré algunos datos para validarte:')
                                                    .addAnswer('¿Cual es tu correo?',{capture:true},(ctx, {fallBack}) => {
                                                        if(!ctx.body.includes('@')){
                                                            return fallBack()
                                                        }else{
                                                            DatosInicioSesion.push(ctx.body);
                                                        }})
                                                    .addAnswer('¿Cual es tu contraseña?',{capture:true},(ctx, {fallBack}) => {
                                                        if(ctx.body == ""){
                                                            return fallBack()
                                                        }else{
                                                            DatosInicioSesion.push(ctx.body);
                                                        }})
                                                    .addAnswer('validando datos...', null, async (ctx, {gotoFlow}) => {
                                                                var jsonParsed;
                                                                var data = JSON.stringify({
                                                                "identifier": DatosInicioSesion[0],
                                                                "password": DatosInicioSesion[1]
                                                                });
                                                                
                                                                var config = {
                                                                method: 'post',
                                                                url: 'https://strapi-mysql-mrp-production.up.railway.app/api/auth/local',
                                                                headers: { 
                                                                    'Authorization': 'Bearer f847dc8631775725c2e3ffb73b0c53373e4415f35d411b5fea9264370be1c05b8bac1af03452994d47b0dc33a43a3fdd676f67babf01e92f9b803ca7209b12babca79c97aab129102059afc7ca67d37d79030fb423db0103bd296e42a9875e580a9a62b100b8f61c6c30805e127a628d3c4b122c54fa2063054d4cf212cedae0', 
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                data : data
                                                                };
                                                                
                                                                const respuesta = await axios(config);
    
                                                                var jsonParsed = JSON.parse(JSON.stringify(respuesta.data));
                                                                DatosInicioSesion.push(jsonParsed.user.username);
                                                                //const nombreUsuarioSesion = jsonParsed.user.username;
                                                                GLOBAL_STATE[ctx.from].username = DatosInicioSesion[2];
                                                                gotoFlow(flowMiPerfil);
                                                        })
    
    const flowRegistro = addKeyword(['b', 'B']).addAnswer('A continuación te pediré algunos datos para completar tu registro:')
                                                .addAnswer('¿Cual es tu nombre? (1/5)',{capture:true},(ctx, {fallBack}) => {
                                                    if(ctx.body == ""){
                                                        return fallBack()
                                                    }else{
                                                        DatosPersonales.push(ctx.body);
                                                        DatosPersonales.push(ctx.from);
                                                    }})
    
                                                .addAnswer('¿Cual es tu apellido paterno? (2/5)',{capture:true},(ctx, {fallBack}) => {
                                                    if(ctx.body == ""){
                                                        return fallBack()
                                                    }else{
                                                        DatosPersonales.push(ctx.body);
                                                    }})
    
                                                .addAnswer('¿Cual es tu apellido paterno? (3/5)',{capture:true},(ctx, {fallBack}) => {
                                                    if(ctx.body == ""){
                                                        return fallBack()
                                                    }else{
                                                        DatosPersonales.push(ctx.body);
                                                    }})
    
                                                .addAnswer('¿Cual es tu correo? (4/5)',{capture:true},(ctx, {fallBack}) => {
                                                    if(!ctx.body.includes('@')){
                                                        return fallBack()
                                                    }else{
                                                        DatosPersonales.push(ctx.body);
                                                    }})
    
                                                .addAnswer('Ahora, crea una contraseña (5/5)',{capture:true},(ctx, {fallBack}) => {
                                                    if(ctx.body == ""){
                                                        return fallBack()
                                                    }else{
                                                        DatosPersonales.push(ctx.body);
                                                        GLOBAL_STATE[ctx.from].password = ctx.body;
                                                    }})
                                                .addAnswer('Muchas gracias!', null, async (ctx, {gotoFlow}) => {   
                                                    await guardarDatos();
    
                                                    gotoFlow(flowMiPerfil);
                                                },[flowMiPerfil]);
                                                    
    
    const flowPrincipal = addKeyword(['Hola', 'hola', 'ole', 'alo', 'buenas', 'buenas tardes', 'buenas noches', 'buenos días', 'hi', 'Hello', 'HI'])
        .addAnswer(" ", { media:"https://reqlut2.s3.amazonaws.com/uploads/logos/b75ffc9887a79530bd32d0274bdcce837d93a465-5242880.png",})
        .addAnswer(['Bienvenido, soy el Asistente Virtual *CRS* 🤖\n', 'Para comenzar por favor elige una de las siguientes opciones:'])
        .addAnswer(
            [
                '*a)* Iniciar Sesión',
                '*b)* Registrarme',
            ],
            null,
            async (ctx) => {
                GLOBAL_STATE[ctx.from] = {
                    "username": "",
                    "email": "",
                    "provider":"",
                    "password": "",
                    "confirmed":"true",
                    "blocked":"false",
                    "role":"1",
                    "name": "",
                    "phone":ctx.from
                }
            },
            [flowInicioSession, flowRegistro]
        )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
