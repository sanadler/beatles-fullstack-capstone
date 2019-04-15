function getSongs() {
    fetch('/songs')
        .then(handleErrors)
        .then(response => response.json())
        .then(responseJson => displaySongs(responseJson))
        .catch(error => alert(error))
}

function getSongById(id) {
    fetch(`/songs/${id}`)
        .then(handleErrors)
        .then(response => response.json())
        .then(responseJson => displaySong(responseJson))
        .catch(error => alert(error))
}

function postSong(){
    const songName = $(`input[name='song-name']`).val();
    const albumName = $(`input[name='album-name']`).val();
    const songYear = $(`input[name='song-year']`).val();
    const songWriters = [];
    $("input:checkbox[name='writer']:checked").each(function(){
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
    //    .then(response => response.json())
   //     .then(responseJson => displaySongs(responseJson))
        .catch(error => alert(error))
}

function updateSong(updateId){
    const songName = $(`input[name='song-name']`).val();
    console.log(songName);
    const albumName = $(`input[name='album-name']`).val();
    const songYear = $(`input[name='song-year']`).val();
    const songWriters = [];
    $("input:checkbox[name='writer']:checked").each(function(){
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

function getLyrics(name) {
    fetch(`https://api.lyrics.ovh/v1/the beatles/${name}`)
      .then(response => response.json())
      .then(responseJson => 
        displaySongLyrics(responseJson, name))
      .catch(error => alert(error));
  }

function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
}

function displaySongs(data) {
   // console.log(data.songs[index].id);
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

function displaySong(data) {
    $('.update-page').append(`
        <form>
            <label> Update Your Song <br>
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
            </label>
        </form>`)
 }

 function displaySongLyrics(data, name) {
    $('.songs-page').empty();
    console.log(data.lyrics)
    $('.songs-page').append(
        `<div class="col-12">
            <div class="box">
                <h3> Lyrics to ${name} </h3>
                <p> ${data.lyrics} </p>
            </div>
        </div>`);
 }

function handleDeleteSong(){
    $('.songs-page').on('click','button[name="delete"]', function(){
        const id = $(this).prop("value");
        deleteSong(id);
        location.reload();
    });
}

function handleUpdateSong(id){
    getSongById(id);
    $('.songs-page').empty();
    $('.update-page').on('click','button[name="submit"]', function(){
        updateSong(id);
    });
}

function handleAddSong(){
    $('.song-page').empty();
    $('.add-page').append(`<form>
    <label> Enter Your Song <br>
        <label>Song Title
            <input placeholder="Hey Jude" type="text" name="song-name" id="song-name" required/>
        </label>
        <label>Album
                <input placeholder="Yellow Submarine" type="text" name="album-name" id="album-name" required/>
        </label>
        <label> Year
            <input id="song-year" name="song-year" type="number" required/><br>
        </label>
        <label>Writer(s) <br>
            <label><input type="checkbox" name="writer" value="John Lennon"> John Lennon</label><br>
            <label><input type="checkbox" name="writer" value="George Harrison"> George Harrison</label><br>
            <label><input type="checkbox" name="writer" value="Paul McCartney"> Paul McCartney</label><br>
            <label><input type="checkbox" name="writer" value="Ringo Starr"> Ringo Starr</label><br>
        </label>
        <button name="submit" type="submit">Submit</button>
    </label>
</form>`)
    $('.add-page').on('click','button[name="submit"]', postSong);
}


function handleAddButton(){
    $('.container').on('click','button[name="add-song"]', function(){
        $('.row').empty();
        handleAddSong();
    });   
}

function handleViewButton(){
    $('.songs-page').on('click','button[name="view"]', function(){
        const name = $(this).prop("value");
        getLyrics(name);
    });   
}

function handleUpdateButton(){
    $('.songs-page').on('click','button[name="update"]', function(){
        const id = $(this).prop("value");
        handleUpdateSong(id);

    });   
}

$(function() {
    getSongs();
    handleDeleteSong();
    handleUpdateButton();
    handleAddButton();
    handleViewButton();
})