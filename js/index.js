var templates = [];
var tweets = [];

$(document).ready(function(){
  inicializar();

  obtenerTemplates();
});

function inicializar() {
  console.log('iniciando');
  $('#date-picker-3').datepicker();

  $('#form-busqueda').submit(function(event){
    buscarTweets();
    event.preventDefault();
  });

  $('#lstResultados').empty();
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
  for(i in templates) {
    $('#cmbTemplates').append('<option value="' + templates[i].id + '">' + templates[i].nombre + '</option>');
  }
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
    aux = {id: i, heading: 'Text heading #' + i, text: 'Texto texto texto #' + i};

    tweets.push(aux);
  }

  console.log('cant tweets: ' + tweets.length);
  cargarTweets();
}

function cargarTweets() {
  console.log('cargarTweets');
  var listGroup = $('#lstResultados');

  console.log('list-group: ' + listGroup.length);
  listGroup.empty();
  console.log('list-group: ' + listGroup.length);

  for (let i in tweets) {
      let item = $('<a></a>');
      let heading = $('<h4></h4>');
      let text = $('<p></p>');

      item.attr({'href': '#', 'class': 'list-group-item'});
      heading.attr({'class': 'list-group-item-heading'});
      text.attr({'class': 'list-group-item-text'});

      text.text(tweets[i].text);
      heading.text(tweets[i].heading);
      item.append(heading, text);

      listGroup.append(item);
  }

}
