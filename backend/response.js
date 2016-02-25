module.exports = function(result, res) {
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(result) + '\n');
}
