var templates = [];
var tweets = [];

$(document).ready(function(){
  inicializar();
});

function inicializar() {
  console.log('iniciando');
  $('#date-picker-3').datepicker();

  $('#form-busqueda').submit(function(event){
    buscarTweets();
    event.preventDefault();
  });

  $('#lstResultados').empty();
  
  obtenerTemplates();
}

function obtenerTemplates() {
  var aux;
  for(let i=0; i < 5; i++) {
    aux = {id: i, nombre: 'template #' + i};

    templates.push(aux);
  }

  console.log('cant tmp: ' + templates.length);

  cargarTemplates();
}

function cargarTemplates() {
  var templateItems = "";
  for(i in templates) {
    templateItems += '<option value="' + templates[i].id + '">' + templates[i].nombre + '</option>';
  }
  $('#cmbTemplates').append(templateItems);
}

function buscarTweets() {
  console.log('buscarTweets');
  obtenerTweets();
}

function obtenerTweets() {
  let aux;
  let maxTweets = 5 * Math.random();
  tweets = [];
  for(let i=1;i < maxTweets; i++) {
    aux = {id: i, fullname: 'fullname' + i, username: 'username'+i, text: 'Texto texto texto #' + i, fechaHora: 'dd/mm/yyyy hh:mm:ss'};

    tweets.push(aux);
  }

  console.log('cant tweets: ' + tweets.length);
  cargarTweets();
}

function cargarTweets() {
  console.log('cargarTweets');
  var listGroup = $('#lstResultados');

  listGroup.empty();

  var tweetsItems = [];
  for (let i in tweets) {
      let item = $('<div></div>');
      let heading = $('<div></div>');
      let hashtag = $('<span></span>');
      let fullname = $('<span></span>');
      let username = $('<span></span>');
      let icono = $('<span></span>');
      let imgs = $('<span></span>');
      
      let body = $('<div></div>');
      let text = $('<p></p>');
      
      let footer = $('<div></div>');
      let dateTime = $('<span></span>');
      let detalle = $('<button type="button" class="btn btn-primary btn-sm align-right" data-toggle="modal" data-target="#myModal">Detalle</button>');

      item.attr({'class': 'panel panel-default'});
      heading.attr({'class': 'panel-heading'});
      body.attr({'class':'panel-body'});
      footer.attr({'class':'panel-footer'});
      
      dateTime.text(tweets[i].fechaHora);
      footer.append(dateTime, detalle);
      
      text.text(tweets[i].text);
      body.append(text);

      hashtag.attr({'class':'badge'});
      hashtag.text(tweets[i].id);
      
      fullname.attr({'class':'label label-default'});
      fullname.text(tweets[i].fullname);
      
      username.attr({'class':'label label-primary'});
      username.text(tweets[i].username);
      
      icono.attr({'class':'glyphicon glyphicon-picture align-right'});
      
      imgs.attr({'class':'badge'});
      imgs.text('2');

      heading.append(hashtag, fullname, username, icono, imgs);

      item.append(heading, body, footer);

      listGroup.append(item);
  }

}
