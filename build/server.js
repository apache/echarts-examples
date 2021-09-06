const nStatic = require('node-static');
const open = require('open');

const fileServer = new nStatic.Server(__dirname + '/../public');
require('http')
  .createServer(function (request, response) {
    request
      .addListener('end', function () {
        fileServer.serve(request, response);
      })
      .resume();
  })
  .listen(3002);

// Wait bundling to be finished
setTimeout(() => {
  open('http://127.0.0.1:3002/en/index.html');
}, 3000);

process.on('SIGINT', function () {
  console.log('Closing');
  // Close through ctrl + c;
  process.exit();
});
