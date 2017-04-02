var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(__dirname + '/providers.txt').pipe(res);   
}).listen(9011, '127.0.0.1');

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(__dirname + '/demanders.txt').pipe(res);   
}).listen(9012, '127.0.0.1');