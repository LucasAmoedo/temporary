process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
  .add('role:user, cmd:create', function create( msg, respond ) {

    var user = this.make('users')

    user.name = msg.name
    user.registration = msg.registration
    user.sector = msg.sector
    user.hospital = msg.hospital
    user.password = msg.password
    user.manager = msg.manager

    user.save$(function(err,user){
      console.log(user)
      respond( null, user)
    })
  })

  .add('role:user, cmd:listById', function listById (msg, respond){

    var userId = msg.id;
    var user = this.make('users')
    user.load$(userId, function(error, user) {
      respond(null, user);
    });
  })

  .add('role:user, cmd:listUser', function listUser(msg, respond){

    var user = this.make('users');
    user.list$( { all$: true } , function(error, user){
      respond(null, user);
    });


  })

  .add('role:user, cmd:editUser', function(msg, respond){

    var userId = msg.id;
    var user = this.make('users')

    user.load$(userId, function(error, user) {

      user.name = msg.name
      user.registration = msg.registration
      user.sector = msg.sector
      user.hospital = msg.hospital
      user.password = msg.password
      user.manager = msg.manager

      user.save$(function(err,user){
        console.log(user)
        respond( null, user)
      });
    });
  })
