//get songs from database
function getSongs() {
    fetch('/songs')
        .then(handleErrors)
        .then(response => response.json())
        .then(responseJson => displaySongs(responseJson))
        .catch(error => alert(error))
}

//get song by id from database
function getSongById(id) {
    fetch(`/songs/${id}`)
        .then(handleErrors)
        .then(response => response.json())
        .then(responseJson => displaySongById(responseJson))
        .catch(error => alert(error))
}

//get song by name from dataase
function getSongByName(name) {
    fetch(`/songs/name/${name}`)
        .then(handleErrors)
        .then(response => response.json())
        .then(responseJson => displaySongs(responseJson))
        .catch(error => alert(error))
}

//post song to database
function postSong(){
    const songName = $(`input[name='song-name']`).val();
    const albumName = $(`input[name='album-name']`).val();
    const songYear = $(`input[name='song-year']`).val();
    const songWriters = [];
    $('input:checkbox[name="writer"]:checked').each(function(){
        songWriters.push($(this).val());
    });
    fetch('/songs' ,{
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: songName,
            album: albumName,
            year: songYear,
            writers: songWriters
        })
    })
        .then(handleErrors)
        .catch(error => alert(error))
}

//update song in database
function updateSong(updateId){
    const songName = $(`input[name='song-name']`).val();
    const albumName = $(`input[name='album-name']`).val();
    const songYear = $(`input[name='song-year']`).val();
    const songWriters = [];
    $('input:checkbox[name="writer"]:checked').each(function(){
        songWriters.push($(this).val());
    });
    fetch(`/songs/${updateId}`,{
        method: 'put',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: updateId,
            name: songName,
            album: albumName,
            year: songYear,
            writers: songWriters
        })
    })
        .then(handleErrors)
        .catch(error => alert(error))
}

//delete song in  database
function deleteSong(id){
    fetch(`/songs/${id}`,{
        method: 'delete',
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(handleErrors)
        .catch(error => alert(error))
}

//get lyrics of a certain song  ..  api takes a bit to load
function getLyrics(name) {
    fetch(`https://api.lyrics.ovh/v1/the beatles/${name}`)
      .then(response => response.json())
      .then(responseJson => 
        displaySongLyrics(responseJson, name))
      .catch(error => alert("Can't find lyrics to this song"));
  }

//function to help format the lyrics
function format(str) {
    return str
        .replace(/[\\]/g, '\\\\')
        .replace(/[\"]/g, '\\\"')
        .replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '\\b')
        .replace(/[\f]/g, '\\f')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r')
        .replace(/[\t]/g, '\\t');
};

function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.message);
    }
    return response;
}

//display all the songs in the database  or if user searches a song
function displaySongs(data) {
    $('.songs-page').empty();
    $('.songs-page').append(`<div class="col-12"><div class="song-number">Songs</div>
        <div class="number"><h3>${data.songs.length}</h3></div></div>`);
    for (index in data.songs) {
        $('.songs-page').append(
        `<div class="col-6">
            <div class="box">
                <h4> ${data.songs[index].name} </h4>
                <p> ${data.songs[index].year} </p>
                <p> ${data.songs[index].album} </p>
                <p> ${data.songs[index].writers} </p>
                <div class="buttons"><button type="submit" value="${data.songs[index].name}" name="view">View Lyrics</button><button type="submit" value="${data.songs[index].id}" name="update">Update</button><button type="submit" value="${data.songs[index].id}" name="delete">Delete</button></div>
            </div>
        </div>`);
    }
}

//display one song by id for update song
function displaySongById(data) {
    $('.update-page').append(`
        <div class="form-style">
            <form>
                <h2> Update Your Song </h2>
                    <label>Song Title
                        <input value="${data.name}" type="text" name="song-name" id="song-name" required/>
                    </label>
                    <label>Album
                            <input value="${data.album}" type="text" name="album-name" id="album-name" required/>
                    </label>
                    <label> Year
                        <input value = "${data.year}"id="song-year" name="song-year" type="number" required/><br>
                    </label>
                    <label>Writer(s) <br>
                        <label><input type="checkbox" name="writer" value="John Lennon"> John Lennon</label><br>
                        <label><input type="checkbox" name="writer" value="George Harrison"> George Harrison</label><br>
                        <label><input type="checkbox" name="writer" value="Paul McCartney"> Paul McCartney</label><br>
                        <label><input type="checkbox" name="writer" value="Ringo Starr"> Ringo Starr</label><br>
                    </label>
                    <button type="submit" name="submit">Submit</button>
            </form>
        </div>`)
 }

 //display lyrics of one song
 function displaySongLyrics(data, name) {
    const lyrics = format(data.lyrics);
    let replaced = lyrics.replace(/\\n/g, '<br />');
    $('.songs-page').empty();
    $('.songs-page').append(
        `<div class="col-12">
            <div class="box">
                <h3> Lyrics to ${name} </h3>
                <p> ${replaced} </p>
            </div>
        </div>`);
 }

 //handles delete songb utton and deletes the song from the database. reloads homepage
function handleDeleteSong(){
    $('.songs-page').on('click','button[name="delete"]', function(){
        const id = $(this).prop("value");
        deleteSong(id);
        location.reload();
    });
}

//handles the update song button and updates the songin the database
function handleUpdateSong(id){
    getSongById(id);
    $('.songs-page').empty();
    $('.update-page').on('click','button[name="submit"]', function(){
        updateSong(id);
    });
}

//displays the add song form and then posts the song to database
function handleAddSong(){
    $('.songs-page').empty();
    $('.add-page').append(`
        <div class="form-style">
            <form>
                <h2> Add Your Song </h2>
                    <label>Song Title
                        <input placeholder="Hey Jude" type="text" name="song-name" id="song-name" required/>
                    </label>
                    <label>Album
                        <input placeholder="Yellow Submarine" type="text" name="album-name" id="album-name" required/>
                    </label>
                    <label> Year
                        <input id="song-year" name="song-year" type="number" placeholder="1969" required/><br>
                    </label>
                    <label>Writer(s) <br>
                        <label><input type="checkbox" name="writer" value="John Lennon"> John Lennon</label><br>
                        <label><input type="checkbox" name="writer" value="George Harrison"> George Harrison</label><br>
                        <label><input type="checkbox" name="writer" value="Paul McCartney"> Paul McCartney</label><br>
                        <label><input type="checkbox" name="writer" value="Ringo Starr"> Ringo Starr</label><br>
                    </label>
                    <button type="submit" name="submit">Submit</button>
            </form>
        </div>`)
    $('.add-page form').on('submit', postSong);
}

//handles the add song button in the nav
function handleAddButton(){
    $('.navigation').on('click','a[name="add-song"]', function(){
        $('.row').empty();
        handleAddSong();
    }); 
}

//handles view button so you can see the lyrics for the song
function handleViewButton(){
    $('.songs-page').on('click','button[name="view"]', function(){
        const name = $(this).prop("value");
        getLyrics(name, format);
    });   
}

//handles the update button, sends you to the update form and then updates the song
function handleUpdateButton(){
    $('.songs-page').on('click','button[name="update"]', function(){
        const id = $(this).prop("value");
        handleUpdateSong(id);

    });   
}

//watches the search song input and gets the songs you are searching for
function watchSearch() {
    $('#search').submit(event => {
      let name = $('#song-search').val();
      event.preventDefault();
      getSongByName(name);
       $('#song-search, textarea').val('');
    });
  }

$(function() {
    getSongs();
    handleDeleteSong();
    handleUpdateButton();
    handleAddButton();
    handleViewButton();
    watchSearch();
})