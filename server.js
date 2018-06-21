var express = require('express');
var app     = express();
var fs      = require('fs');

app.disable('view cache');
// compiler
app.set('view engine', 'pug');
// path to template
app.set('views', './');
// path to static file
app.use('/assets', express.static('./public/assets/**/*'));
// routing to static pages
app.get('/static/*.*', function(req, res) {
  // regular for result templater
  var fileName = req.url.replace(/static\/|\..*$/g, '') || 'index';
  res.render('src/templates/' + fileName, {}); (1)
});
// redirect
app.get('/static', function(req, res) {
  res.redirect('/static/index.html');
});
var listener    = app.listen();
var port        = listener.address().port;
var browserSync = require('browser-sync').create();
// proxy
browserSync.init({
  proxy: 'http://localhost:'   + port,
  startPath: '/static/',
  notify: false,
  tunnel: false,
  host: 'localhost',
  port: port,
  logPrefix: 'Proxy to localhost:' + port,
});
// обновляем страницу, если обновились assets файлы
browserSync.watch('./public/assets/**/*').on('change', browserSync.reload);
// обновляем страницу, если был изменен исходник шаблона
browserSync.watch('./src/templates/**/*').on('change', browserSync.reload);