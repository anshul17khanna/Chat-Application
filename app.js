var app = require("express")();

app.set('port', process.env.PORT || 8888);

var port = app.listen(app.get('port'));

var io = require('socket.io').listen(port);

require('./config')(app, io);
require('./routes/index')(app, io);
require('./routes/chat')(app, io);

console.log('Server running on http://localhost:3000');
