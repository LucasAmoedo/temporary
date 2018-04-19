process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express');
var bodyParser = require('body-parser');
var SenecaWeb = require('seneca-web')
var Router = express.Router
var context = new Router()

var app = express()
      .use( require('body-parser').json() )
      .use( context )
      .listen(process.env.PORT)

var senecaWebConfig = {
      context: context,
      adapter: require('seneca-web-adapter-express'),
      options: { parseBody: false }
}

var seneca = require('seneca')()
      .use(SenecaWeb, senecaWebConfig )
      .use('seneca-amqp-transport')
      .use('api')
      .listen({
        type:'amqp',
        pin:'role:user',
        url: 'amqps://gabriela:gaby2502@portal909-32.fancy-rabbitmq-63.gaby2502.composedb.com:28243/fancy-rabbitmq-63'
      })
