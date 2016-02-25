var fs  = require('fs');

var html = fs.readFileSync(__dirname + '/templates/page.html')
            .toString('utf8');

module.exports = function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(html + '\n');
}
