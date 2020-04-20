const app = require('./app');
const http = require('http');
const port = process.env.PORT || 1347;
const server = http.createServer(app);

server.listen(port, function(){
    console.log('server opened at http://locallhost:' + port)
})