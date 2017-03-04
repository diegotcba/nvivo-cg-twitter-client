var templates = [];
var searchTweets = [];
var playlistTweets = [];
var playlist = [];

var mockWS = false;
var wsRootUrl = "";
var cgServerAddress = "";

$(document).ready(function(){
  inicializar();
});

function inicializar() {
  console.log('iniciando');
  $('#txtPlaylistDate').datepicker();

  $('#form-busqueda').submit(function(event) {
    buscarTweets();
    event.preventDefault();
  })

  $('#newPlaylist').on('click', function(event) {
    nuevoPlaylist();
    event.preventDefault();
  })
  
  $('#savePlaylist').on('click', function(event) {
    guardarPlaylist();

  })

  $('#btnSearchPlaylist').on('click', function(event) {
    buscarPlaylists();
    event.preventDefault();
  })

  $('#form-settings').submit(function(event) {
    guardarSettings();
    event.preventDefault();
  })

  $('#btnStart').on('click', function(event) {
    templateStart();
  })

  $('#btnStop').on('click', function(event) {
    templateStop();
  })
  
  inicializarTweetSearch();
  nuevoPlaylist();
  inicializarPlaylists();
  inicializarPlaylistSeleccionado();
  obtenerSettings();
  obtenerTemplates();
}

function inicializarTweetSearch() {
  $('#hashtag').val('');

  $('#lstResultados').empty();
}

function inicializarPlaylists() {
  

  $('#lstPlaylists').empty();
}

function inicializarPlaylistSeleccionado() {
  $('#playlistId').text('');
  $('#playlistTitle').text('');
  $('#playlistDate').text('');
  $('#playlistDescription').text('');

  $('#lstPlaylistDetail').empty();  
}

function obtenerSettings() {
  mockWS = $('#chkMockWS').is(':checked');
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
  $('#cmbPlaylistTemplate').append(templateItems);
}

function buscarTweets() {
  console.log('buscarTweets');
  obtenerTweets();
}

function obtenerTweets() {
  if(mockWS) {
    mockTweets();
  } else {
    queryTweets();
  }
}

function queryTweets() {
  var hashtagValue = $('#hashtag').val();
  var userValue = '';
  

  var query = {
    "hashtag": hashtagValue,
    "user": userValue,
    "startDateTime": '',
    "endDateTime": '',
    "location": ''
  }
  
  getTweets(query).done(function(data){
    console.log(data);
    searchTweets = data.tweets;
    cargarTweets();
  }).fail(function(){
    console.log('error en ws');
  });
}

function mockTweets() {
  let aux;
  let maxTweets = 5 * Math.random();
  let mockHashtag = $('#hashtag').val();
  searchTweets = [];
  
  for(let i=1;i < maxTweets; i++) {
    aux = {id: i, hashtag: '#' + mockHashtag + i, fullName: 'fullname' + i, userName: 'username'+i, message: 'Texto texto texto #' + i, dateTime: 'dd/mm/yyyy hh:mm:ss'};

    searchTweets.push(aux);
  }

  console.log('cant tweets: ' + searchTweets.length);
  cargarTweets();
}

function getTweets(query) {
  var wsAddress = wsRootUrl;
  var jsonQuery = JSON.stringify(query);
  var wsServicePath = '/nvivo-cg-twitter-service/tweets/';
  var wsSearchPath = 'http://' + wsAddress + wsServicePath;
  
  console.log(wsSearchPath);
  console.log(jsonQuery);
  
  return $.ajax({
    url: wsSearchPath,
    type: 'POST',
    dataType: 'json',
    data: jsonQuery,
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
      
      dateTime.text(tweet.dateTime);
      dropdown = generarListItemDropdown(tweet);
      footer.append(dateTime, dropdown);
      
      text.text(tweet.message);
      body.append(text);

      hashtag.attr({'class':'badge'});
      hashtag.text(tweet.hashtag);
      
      fullname.attr({'class':'label label-default'});
      fullname.text(tweet.fullName);
      
      username.attr({'class':'label label-primary'});
      username.text(tweet.userName);
      
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
  $(listItemId).append('<div class="disabledDiv" style="position: absolute;top:0;left:0;width: 99%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
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

  $('#txtPlaylistTitle').val('');
  $('#txtPlaylistDate').val('');
  $('#txtPlaylistDescription').val('');
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
    
    dateTime.text(tweet.dateTime);
    dropdown = generarPlaylistItemDropdown(tweet);
    footer.append(dateTime, dropdown);
    
    text.text(tweet.message);
    body.append(text);

    hashtag.attr({'class':'badge'});
    hashtag.text(tweet.hashtag);
    
    fullname.attr({'class':'label label-default'});
    fullname.text(tweet.fullName);
    
    username.attr({'class':'label label-primary'});
    username.text(tweet.userName);
    
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
  
  let menuDetalle = $('<li><a href="#" data-toggle="modal" data-target="#myModal">Detalle</a></li>');
  let menuImgenes = $('<li><a href="#">Imagenes</a></li>');
  menuImgenes.on('click', verImagenes);
  
  dropdownMenu.append(menuDetalle, menuImgenes)
  
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
  var titulo = $('#txtPlaylistTitle').val();
  var fecha = $('#txtPlaylistDate').val();
  var descripcion = $('#txtPlaylistDescription').val();
  
  var playlistSave = {
    id: 0,
    title: titulo,
    dateTime: fecha,
    description: descripcion,
    tweets: playlistTweets
  } 
  
  if(mockWS) {
    playlistSave.id = playlist.length + 1;
    playlist.push(playlistSave);
    nuevoPlaylist();
    inicializarTweetSearch();
    alert('Playlist mockeada guardada con exito');
  } else {
    postPlaylist(playlistSave)
    .done(function() {
      playlist.push(playlistSave);
      nuevoPlaylist();
      inicializarTweetSearch();
      alert('Playlist guardada con exito');
    })
    .fail(function() {
      
    });      
  }
}

function postPlaylist(playlist) {
  var wsAddress = $('#wsPlaylist').val();
  var jsonQuery = JSON.stringify(query);
  var wsServicePath = '/nvivo-cg-twitter-service/tweets/';
  var wsPlaylistPath = 'http://' + wsAddress + wsServicePath;
    
  return $.ajax({
    url: wsPlaylistPath,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(playlist),
    cache: false,
    contentType: 'application/json',
    processData: false
  });
}

function buscarPlaylists() {
  if(!mockWS) {
    queryPlaylists().done(function(data) {
      playlist = data.playlist;
    }).fail(function() {
      alert('Error al buscar playlists!');
    });
  }
  cargarPlaylist();
}

function queryPlaylists() {
  var wsAddress = $('#txtWSRootUrl').val();
  var jsonQuery = JSON.stringify(query);
  var wsServicePath = '/nvivo-cg-twitter-service/playlists/';
  var wsPlaylistPath = 'http://' + wsAddress + wsServicePath;
    
  return $.ajax({
    url: wsPlaylistPath,
    type: 'GET',
    dataType: 'json',
    //data: JSON.stringify(playlist),
    cache: false,
    contentType: 'application/json',
    processData: false
  });

}

function cargarPlaylist() {
  var listPlaylistSearch = $('#lstPlaylists');

  listPlaylistSearch.empty();

  for(i in playlist) {
    listPlaylistSearch.append(generarPlaylistSearchItem(playlist[i]));
  }
}

function generarPlaylistSearchItem(playlistItem) {
    let item = $('<div></div>');

    let heading = $('<div></div>');
    let title = $('<span></span>');
    let ids = $('<span></span>');
    
    let body = $('<div></div>');
    let text = $('<p></p>');
    
    let footer = $('<div></div>');
    let dateTime = $('<span></span>');
    let tweetsNumber = $('<span></span>');
    let hashtag = $('<span></span>');

    item.attr({'class': 'panel panel-default', 'id': 'playlist' + playlistItem.id});
    heading.attr({'class': 'panel-heading'});
    body.attr({'class':'panel-body'});
    footer.attr({'class':'panel-footer'});
    
    dateTime.text(playlistItem.dateTime);
    hashtag.attr({'class':'badge'});
    hashtag.text('#' + playlistItem.tweets.length);
    tweetsNumber.attr({'class':'badge'});
    tweetsNumber.text(playlistItem.tweets.length);
    footer.append(hashtag, dateTime, tweetsNumber);
    
    text.text(playlistItem.description);
    body.append(text);

    
    title.attr({'class':'label label-default'});
    title.text(playlistItem.title);        
    ids.attr({'class':'badge'});
    ids.text(playlistItem.id);
    let btnSeleccionar = $('<button type="button" class="btn btn-primary btn-sm">Seleccionar</button>');
    btnSeleccionar.attr({'id': playlistItem.id });
    btnSeleccionar.on('click', function() {
        mostrarPlaylistSeleccionada(playlistItem.id)
    });

    
    heading.append(ids, title,btnSeleccionar);

    item.append(heading, body, footer);

    return item;
}

function mostrarPlaylistSeleccionada(id) {
  let selPlaylist = getPlaylistById(id);

  //console.log(selPlaylist);

  inicializarPlaylistSeleccionado();

  $('#playlistId').text(selPlaylist.id);
  $('#playlistTitle').text(selPlaylist.title);
  $('#playlistDate').text(selPlaylist.dateTime);
  $('#playlistDescription').text(selPlaylist.description);

  cargarPlaylistDetail(selPlaylist);
}

function getPlaylistById(id) {
    for(i in playlist) {
      if(playlist[i].id === id) {
        return playlist[i];
      }
    }
}

function cargarPlaylistDetail(playlistItem) {
  console.log('cargar tweets');
  
  var listPlaylist = $('#lstPlaylistDetail');
  
  listPlaylist.empty();
  
  for(i in playlistItem.tweets) {
    listPlaylist.append(generarPlaylistItem(playlistItem.tweets[i]));
  }
  
}

function guardarSettings() {
  mockWS = $('#chkMockWS').is(':checked');
  wsRootUrl = $('#txtWSRootUrl').val();
  cgServerAddress = $('#txtCGServerUrl').val();
}

function templateStart() {
  console.log('CG Start');

}

function templateStop() {
  console.log('CG Stop');
}