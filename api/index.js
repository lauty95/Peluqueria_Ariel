//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const { Cliente, Mensaje, Precio, Usuario } = require('./src/db');
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { default: axios } = require('axios');
const PORT = process.env.PORT;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {

  // axios.get('https://peluqueria-ariel.herokuapp.com/allClients')
  //   .then(async item => {
  //     item.data.forEach(async d => {
  //       await Cliente.create({
  //         id: d.id,
  //         nombre: d.nombre,
  //         telefono: d.telefono,
  //         tienePromo: d.tienePromo,
  //         dia: d.dia,
  //         diaPromo: d.diaPromo,
  //         turno: d.turno,
  //         idCliente: d.idCliente,
  //       });
  //     })
  //   })

  // axios.get('https://peluqueria-ariel.herokuapp.com/allUsers')
  //   .then(async item => {
  //     item.data.forEach(async d => {
  //       await Usuario.create({
  //         id: d.id,
  //         nombre: d.nombre,
  //         telefono: d.telefono,
  //       });
  //     })
  //   })

  server.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
  });
});


