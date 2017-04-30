var StaticServer = require('static-server');
var server = new StaticServer({
  rootPath: './dist',            // required, the root of the server file tree
  name: 'act-http-server',   // optional, will set "X-Powered-by" HTTP header
  port: 8000,               // optional, defaults to a random port
  host: '127.0.0.1',       // optional, defaults to any interface
  cors: '*',                 // optional, defaults to undefined,
  followSymlink: true,      // optional, defaults to a 404 error
  templates: {
    index: 'index.html',      // optional, defaults to 'index.html'
    notFound: '404.html'    // optional, defaults to undefined
  }
});

server.start(function () {
  console.log('Server listening to', server.port);
});

server.on('response', function (req, res, err, file, stat) {
  console.log('responsed!')
  res.writeHead(200, {
    "Cache-Control":"max-age=36000"
  });
});
