module.exports = {
  HTML:function(title, list, body, controls){
    return `
      <!doctype html>
      <html>
      <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${controls}
      ${body}
      </body>
      </html>
    `;
  },
  list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<a href = "/?id=${filelist[i]}"><li>${filelist[i]}</li></a>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }
}
