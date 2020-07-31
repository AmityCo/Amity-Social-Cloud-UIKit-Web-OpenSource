const path = require('path');
const static = require('node-static');
const open = require('open');

const PORT = '8888';

const staticPath = path.join(__dirname, './storybook-static');
const file = new static.Server(staticPath);

require('http')
  .createServer(function(request, response) {
    request
      .addListener('end', function() {
        file.serve(request, response);
      })
      .resume();
  })
  .listen(PORT);

console.log(`storybook start on port ${PORT}`);

open(`http://localhost:${PORT}`);
