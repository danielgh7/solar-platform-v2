import app from './app';import {env} from './env';
const server=app.listen(env.PORT,'127.0.0.1',()=>console.log(`solar-platform-v2 API listening on ${env.PORT}`));
const shutdown=()=>server.close(()=>process.exit(0));process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
