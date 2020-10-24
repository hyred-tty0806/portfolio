var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');



var app = http.createServer(function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data', 'utf8', function(error, filelist){
        var title = 'welconme';
        var description = 'hello!';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `
          <a href="/create">create</a>`);
        //뭔가 출력하는 데..?
        response.writeHead(200);
        response.end(html);
      });
    }else{
      fs.readdir('./data', 'utf8', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(error, description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `
            <a href="/create">create</a> | <a href="/update?id=${title}">update</a> |
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>`);
          //뭔가 출력하는 데..?
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }else if(pathname === '/create'){
    fs.readdir('./data', 'utf8', function(error, filelist){
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p>
              <input type="text" name="title" placeholder="title">
            </p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit" value="create">
            </p>
          </form>
          `,`<a href="/create">create</a>
          `
        );
      response.writeHead(200);
      response.end(html);
      //뭔가 출력하는 데..?
    });
  } else if(pathname === '/create_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
  }else if(pathname === '/update'){
    fs.readdir('./data', 'utf8', function(error, filelist){
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(error, description){
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p>
                <input type="text" name="title" placeholder="title" value="${title}">
              </p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit" value="create">
              </p>
            </form>
          `,
          `
            <a href="/create">create</a> | <a href="/update?id=${title}">update</a> `);
        //뭔가 출력하는 데..?
        response.writeHead(200);
        response.end(html);
      });
    });
  }else if(pathname === '/update_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error1){
        fs.writeFile(`data/${title}`, description, function(error2){
          response.writeHead(302, {
            Location: `/?id=${title}`
          });
          response.end();
        });
      });
    });
  }else if(pathname === '/delete_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`,function(error){
        response.writeHead(302, {
          Location: `/`
        });
        response.end();
      });
    });
  }else {
    response.writeHead(404);
    response.end('not found');
  }
});
app.listen(3100);
