process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '123456789';
const expiresIn = '1h';

require('seneca')()
  .use("entity")
  .use('mongo-store',{
    uri:'mongodb://gabriela:gaby2502@aws-us-east-1-portal.32.dblayer.com:28242,aws-us-east-1-portal.33.dblayer.com:28242/compose?authSource=admin&ssl=true'
  })
  .use('seneca-amqp-transport')
  .listen(process.env.PORT)
  .listen({
    type:'amqp',
    pin:'role:user',
    url: 'amqps://gabriela:gaby2502@portal909-32.fancy-rabbitmq-63.gaby2502.composedb.com:28243/fancy-rabbitmq-63'
  })

  .add('role:login, cmd:authenticate', function(msg, respond) {

    var registration = msg.registration;
    var user = this.make('users')
    user.load$({registration},function(error, user) {
      if (!user) {
        respond( null,{
          success: false,
          message: ' Falha de autenticação. Usuário não encontrado.'
        });
      } else {
        if(msg.password == user.password ){
          var payload = {
            registration: msg.registration,
            password: msg.password
          }
          var token = jwt.sign(payload, SECRET_KEY, {expiresIn});
          respond(null,{
            success: true,
            message: 'Autenticação realizada com sucesso!',
            token: token,
            user: {
              id: user.id,
              name: user.name,
              sector: user.sector,
              hospital: user.hospital,
              manager: user.manager,
              registration: user.registration }

          });
        } else {
          respond(null,{
            success: false,
            message: 'Falha de autenticação. Senha incorreta! '
          })
        }
      }
    });
  });
