function getSongs() {
    fetch('/songs')
        .then(handleErrors)
        .then(response => response.json())
        .then(responseJson => displaySongs(responseJson))
        .catch(error => alert(error))
}

function postSong(){
    fetch('/songs' ,{
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "this is a test",
            album: "test album",
            year: 12,
            writers: ["test writer2"]
        })
    })
        .then(handleErrors)
    //    .then(response => response.json())
   //     .then(responseJson => displaySongs(responseJson))
        .catch(error => alert(error))
}

function updateSong(){
    fetch(`/songs/5ca25f0ff8f7f00a9bb4719a`,{
        method: 'put',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: '5ca25f0ff8f7f00a9bb4719a',
            name: "new name"
        })
    })
        .then(handleErrors)
        .catch(error => alert(error))
}

function deleteSong(){
    fetch(`/songs/5ca62a27da8b94947aabea1f`,{
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
    for (index in data.songs) {
        $('section').append(
        '<p>' + data.songs[index].name + '</p>');
        $('section').append(
            '<p>' + data.songs[index].year + '</p>');
        $('section').append(
            '<p>' + data.songs[index].album + '</p>');
        for (i=0; i<data.songs[index].writers.length; i++){
            $('section').append(
                '<p>' + data.songs[index].writers[i] + '</p>');
        }

    }
}

$(function() {
   // postSong();
   // updateSong();
    deleteSong();
    getSongs();
})