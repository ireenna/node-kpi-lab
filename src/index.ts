import { fastify } from 'fastify'
import db from './config/db'
import AutoLoad from '@fastify/autoload'
import { join } from 'path'
const pino = require('pino')
const Port = 3000
const uri = 'mongodb://localhost:27017/blogs'
/*import winston from 'winston';*/

const server = fastify({
  logger: pino({ level: 'info' })
})

server.register(db, { uri })

server.register(AutoLoad, {
  dir: join(__dirname, 'plugins')
})

server.register(AutoLoad, {
  dir: join(__dirname, 'routes')
})

const start = async () => {
  try {
    await server.listen(Port)
    console.log('Server started successfully')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()


//var init = (appname: string) => {

//    //// Here we use winston.containers IoC
//    winston.loggers.add('default', {
//        level: 'info',
//        format: winston.format.combine(winston.format.splat(), winston.format.json()),
//        transports: [
//            new winston.transports.Console({
//                level: 'debug',
//            }),
//            new winston.transports.File({
//                filename: 'api.log',
//                dirname: 'logs/info',
//                format: winston.format.json(),
//            }),
//            new winston.transports.File({
//                level: 'error',
//                filename: 'errors.log',
//                dirname: 'logs/error',
//                format: winston.format.json(),
//            }),
//        ],
//    });

//    //// Here we use winston.containers IoC get accessor
//    var logger = winston.loggers.get("default");

//    logger.add(new winston.transports.Console({
//         format: winston.format.simple(),
//         handleExceptions: true
//    }));


//    process.on('uncaughtException', function (err) {
//        console.log("UncaughtException processing: %s", err);
//    });

//    //// PINO like, we link winston.containers to use only one instance of logger
//    logger.child = function () { return winston.loggers.get("default") };

//    return logger
//}

//const server = require('fastify')({
//    logger: init("mytestapp")
//})

//// register plugin below:
//server.register(db, { uri })

//server.register(AutoLoad, {
//  dir: join(__dirname, 'plugins')
//})

//server.register(AutoLoad, {
//  dir: join(__dirname, 'routes')
//})
//const start = async () => {
//    try {
//        await server.listen(Port)
//        console.log('Server started successfully')
//    } catch (err) {
//        server.log.error(err)
//        process.exit(1)
//    }
//}
//start();

