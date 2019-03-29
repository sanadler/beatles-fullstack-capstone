var MOCK_SONG_LIST = {
    "songs": [
        {
            "id": "111111",
            "name": "Help!",
            "year": "1965",
            "album": "HELP!",
            "writer(s)": ["John Lennon", "Paul McCartney"]
        },
        {
            "id": "222222",
            "name": "Here Comes the Sun",
            "year": "1969",
            "album": "Abbey Road",
            "writer(s)": ["George Harrison"]
        },
        {
            "id": "333333",
            "name": "Come Together",
            "year": "1969",
            "album": "Abbey Road",
            "writer(s)": ["John Lennon", "Paul McCartney"]
        },
        {
            "id": "444444",
            "name": "Ob-La-Di, Ob-La-Da",
            "year": "1968",
            "album": "The Beatles",
            "writer(s)": ["John Lennon", "Paul McCartney"]
        }
    ]
};

function getSongs(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_SONG_LIST)}, 100);
}

function displaySongs(data) {
    for (index in data.songs) {
       $('body').append(
        '<p>' + data.songs[index].name + '</p>');
        console.log(data.songs[index].name);
    }
}

function getAndDisplaySongs() {
    getSongs(displaySongs);
}

$(function() {
    getAndDisplaySongs();
})