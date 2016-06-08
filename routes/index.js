module.exports = function(app, io){

	app.get('/', function(request, response){
		response.render('index', { title: 'index' });
	});

}
