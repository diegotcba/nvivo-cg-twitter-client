var templates = [];
var searchTweets = [];
var playlistTweets = [];

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

  $('#newPlaylist').on('click', function(event) {
    nuevoPlaylist();
    event.preventDefault();
  })
  
  $('#savePlaylist').on('click', function(){
    guardarPlaylist();
  })

  
  $('#lstResultados').empty();
  $('#playlistDetail').empty();
  
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
  mockTweets();
  cargarTweets();
}

function queryTweets() {
  var hashtagValue = $('#hashtag').val();

  var query = {
    hashtag: hashtagValue
  }
  
  getTweets(query).done(function(data){
    searchTweets = data;
    cargarTweets();
  })
}

function mockTweets() {
  let aux;
  let maxTweets = 5 * Math.random();
  searchTweets = [];
  
  for(let i=1;i < maxTweets; i++) {
    aux = {id: i, fullname: 'fullname' + i, username: 'username'+i, text: 'Texto texto texto #' + i, fechaHora: 'dd/mm/yyyy hh:mm:ss'};

    searchTweets.push(aux);
  }

  console.log('cant tweets: ' + searchTweets.length);  
}

function getTweets(query) {
  return $.ajax({
    url: 'http://' + $('wsSearch').val(),
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(query),
    cache: false,
    contentType: 'application/json',
    processData: false
  });
}

function cargarTweets() {
  console.log('cargarTweets');
  var listGroup = $('#lstResultados');

  listGroup.empty();

  var tweetsItems = [];
  for (let i in searchTweets) {

      listGroup.append(generarListItem(searchTweets[i]));
  }
}
  
  function generarListItem(tweet) {
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
      let dropdown;

      item.attr({'class': 'panel panel-default disabled', 'id': 'tweet' + tweet.id});
      heading.attr({'class': 'panel-heading'});
      body.attr({'class':'panel-body'});
      footer.attr({'class':'panel-footer'});
      
      dateTime.text(tweet.fechaHora);
      dropdown = generarListItemDropdown(tweet);
      footer.append(dateTime, dropdown);
      
      text.text(tweet.text);
      body.append(text);

      hashtag.attr({'class':'badge'});
      hashtag.text('#hashtag' + tweet.id);
      
      fullname.attr({'class':'label label-default'});
      fullname.text(tweet.fullname);
      
      username.attr({'class':'label label-primary'});
      username.text(tweet.username);
      
      icono.attr({'class':'glyphicon glyphicon-picture align-right'});
      
      imgs.attr({'class':'badge'});
      imgs.text('2');

      heading.append(hashtag, fullname, username, icono, imgs);

      item.append(heading, body, footer);
 
      return item;
  }
  
  function generarListItemDropdown(tweet) {
    let dropdown = $('<div class="btn-group"></div>');
    let dropdownButton = $('<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span class="caret"></span></button>');
    let dropdownMenu = $('<ul  class="dropdown-menu" aria-labelledby="dropdownMenu1"></ul>');
    
    let menuAgregar = $('<li><a href="#">Agregar</a></li>');
    menuAgregar.attr({'id': tweet.id });
    menuAgregar.on('click', function() {
       agregarItemAPlaylist(tweet.id)
    });
    let separador = $('<li role="separator" class="divider"></li>');
    let menuDetalle = $('<li><a href="#" data-toggle="modal" data-target="#myModal">Detalle</a></li>');
    let menuImgenes = $('<li><a href="#">Imagenes</a></li>');
    menuImgenes.on('click', verImagenes);
    
    dropdownMenu.append(menuAgregar, separador, menuDetalle, menuImgenes)
    
    dropdown.append(dropdownButton, dropdownMenu);
    
    return dropdown;
  }

function agregarItemAPlaylist(id) {
  console.log('agregar tweet #');
 
  playlistTweets.push(getTweetById(id));
  disableListItem(id);
  cargarPlaylistTweets();
}

function disableListItem(id) {
  let listItemId = '#tweet' + id;
  $(listItemId).fadeTo('slow',.4);
  $(listItemId).append('<div class="disabledDiv" style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
  $(listItemId).children().attr('disabled',true);  
}

function enableListItem(id) {
  let listItemId = '#tweet' + id;
  $(listItemId).fadeTo('slow', 1);
  $(listItemId + ' .disabledDiv').remove();
  $(listItemId).children().attr('disabled', false);  
}

function getTweetById(id) {
    for(i in searchTweets) {
      if(searchTweets[i].id === id) {
        return searchTweets[i];
      }
    }
}

function verImagenes() {
  console.log('ver imagenes')
}

function nuevoPlaylist() {
  playlistTweets = [];
  cargarPlaylistTweets();
}

function cargarPlaylistTweets() {
  console.log('cargar playlist tweets');
  
  var listPlaylist = $('#playlistDetail');
  
  listPlaylist.empty();
  
  for(i in playlistTweets) {
    listPlaylist.append(generarPlaylistItem(playlistTweets[i]));
  }
  
}

function generarPlaylistItem(tweet) {
    let item = $('<div></div>');
    let heading = $('<div></div>');
    let hashtag = $('<span></span>');
    let fullname = $('<span></span>');
    let username = $('<span></span>');
    let icono = $('<span></span>');
    let imgs = $('<span></span>');
    let buttonClose = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    
    let body = $('<div></div>');
    let text = $('<p></p>');
    
    let footer = $('<div></div>');
    let dateTime = $('<span></span>');
    let detalle = $('<button type="button" class="btn btn-primary btn-sm align-right" data-toggle="modal" data-target="#myModal">Detalle</button>');
    let dropdown;

    item.attr({'class': 'panel panel-default disabled', 'id': 'tweet' + tweet.id});
    heading.attr({'class': 'panel-heading'});
    body.attr({'class':'panel-body'});
    footer.attr({'class':'panel-footer'});
    
    dateTime.text(tweet.fechaHora);
    dropdown = generarPlaylistItemDropdown(tweet);
    footer.append(dateTime, dropdown);
    
    text.text(tweet.text);
    body.append(text);

    hashtag.attr({'class':'badge'});
    hashtag.text('#hashtag' + tweet.id);
    
    fullname.attr({'class':'label label-default'});
    fullname.text(tweet.fullname);
    
    username.attr({'class':'label label-primary'});
    username.text(tweet.username);
    
    icono.attr({'class':'glyphicon glyphicon-picture align-right'});
    
    imgs.attr({'class':'badge'});
    imgs.text('2');
    
    buttonClose.on('click', function(){
      quitarIteamAPlaylist(tweet.id);
    });

    heading.append(hashtag, fullname, username, icono, imgs, buttonClose);

    item.append(heading, body, footer);

    return item;
}
  
function generarPlaylistItemDropdown(tweet) {
  let dropdown = $('<div class="btn-group"></div>');
  let dropdownButton = $('<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span class="caret"></span></button>');
  let dropdownMenu = $('<ul  class="dropdown-menu" aria-labelledby="dropdownMenu1"></ul>');
  
  let menuAgregar = $('<li><a href="#">Agregar</a></li>');
  menuAgregar.attr({'id': tweet.id });
  menuAgregar.on('click', function() {
      agregarItemAPlaylist(tweet.id)
  });
  let separador = $('<li role="separator" class="divider"></li>');
  let menuDetalle = $('<li><a href="#" data-toggle="modal" data-target="#myModal">Detalle</a></li>');
  let menuImgenes = $('<li><a href="#">Imagenes</a></li>');
  menuImgenes.on('click', verImagenes);
  
  dropdownMenu.append(menuAgregar, separador, menuDetalle, menuImgenes)
  
  dropdown.append(dropdownButton, dropdownMenu);
  
  return dropdown;
}

function quitarIteamAPlaylist(id) {
  var auxList = $.grep(playlistTweets, function(elem, index){
    elem.id != id;
  })
  playlistTweets = auxList;
  cargarPlaylistTweets();
  enableListItem(id);
}


function guardarPlaylist() {
  var titulo = $('#playlistTitle').val();
  var fecha = $('#playlistDate').val();
  var descripcion = $('#playlistDescription').val();
  
  var playlistSave = {
    id: 0,
    title: titulo,
    dateTime: fecha,
    description: descripcion,
    tweets: playlistTweets
  } 
  
  postPlaylist(playlistSave).done(function(){
    alert('Playlist guardada con exito');
  });
}

function postPlaylist(playlist) {
  return $.ajax({
    url: 'http://' + $('wsPlaylist') .val(),
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(playlist),
    cache: false,
    contentType: 'application/json',
    processData: false
  });
}
