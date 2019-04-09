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

function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
}

function displaySongs(data) {
   // console.log(data.songs[index].id);
    for (index in data.songs) {
        $('section').append(
        `<p> ${data.songs[index].name} </p>`);
        $('section').append(
            `<p> ${data.songs[index].year} </p>`);
        $('section').append(
            `<p> ${data.songs[index].album} </p>`);
        for (i=0; i<data.songs[index].writers.length; i++){
            $('section').append(
                `<p> ${data.songs[index].writers[i]} </p>`);
        }

        $('section').append(
            `<button type="submit" value="${data.songs[index].id}" name="update">Update</button><button type="submit" value="${data.songs[index].id}" name="delete">Delete</button>`);

    }
}

function displaySong(data) {
    $('section').append(`
        <form>
            <label> Update Your Song <br>
                <!--  <legend>Contact info</legend>--> 
                <label>Song Title
                    <input value="${data.name}" type="text" name="song-name" id="song-name" />
                </label>
                <label>Album
                        <input value="${data.album}" type="text" name="album-name" id="album-name" />
                </label>
                <label> Year
                    <input value = "${data.year}"id="song-year" name="song-year" type="number"/><br>
                </label>
                <label>Writer(s) <br>
                    <input type="checkbox" name="writer" value="John Lennon"> John Lennon<br>
                    <input type="checkbox" name="writer" value="George Harrison"> George Harrison<br>
                    <input type="checkbox" name="writer" value="Paul McCartney"> Paul McCartney<br>
                    <input type="checkbox" name="writer" value="Ringo Starr"> Ringo Starr<br>
                </label>
                <button type="submit" name="submit">Submit</button>
            </label>
        </form>`)
 }

function handleAddSong(){
    $('.page').on('click','button[name="update"]', postSong);
}

function handleDeleteSong(){
    $('section').on('click','button[name="delete"]', function(){
        const id = $(this).prop("value");
        deleteSong(id);
        location.reload();
    });
}

function handleUpdateSong(id){
    getSongById(id);
    $('section').empty();
    $('section').on('click','button[name="submit"]', function(){
        updateSong(id);
    });
}

function handleUpdateButton(){
    $('section').on('click','button[name="update"]', function(){
        const id = $(this).prop("value");
        handleUpdateSong(id);

    });
     
}

$(function() {
    getSongs();
    handleAddSong();
    handleDeleteSong();
    handleUpdateButton();
   // postSong();
   // updateSong();
   // deleteSong();
})