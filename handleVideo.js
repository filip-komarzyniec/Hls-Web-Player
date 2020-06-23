var video = document.getElementById("video");
video.disablePictureInPicture = true;
//var videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

let availableQualityLevels = [];


document.body.onload = () => {
    loadHlsPlaylist("bunny");
    //const player = new Plyr(video, plyrSettings);
    
    const player = new Plyr(video, {
        ratio: "4:3",
        control: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
    });
}

let playlists = {"bunny": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
                "lab": "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
                "yt": "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8" 
}

window.hls = new Hls();
window.hls.on(Hls.Events.LEVEL_SWITCHED, presentVideoInfo);

function changePlaylist(src) {
    if(Hls.isSupported()) {
        //var hls = new Hls();
        loadHlsPlaylist(src);
        Plyr.setup(video);
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playlists[src];
        video.addEventListener('loadedmetadata', () => video.play());
    }
}


function loadHlsPlaylist(src) {
    console.log('changing playlist');
    window.hls.loadSource(playlists[src]);
    window.hls.attachMedia(video);
    window.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        availableQualityLevels = setQualityLevels();
    });
}

function presentVideoInfo() {
    console.log('level updated');
    let presentingColumn = document.getElementById('video-info');
    let list = null;
    if(presentingColumn.children.length <= 1) {
        list = createInfoList();
    }
    else { 
        for(i=1; i < presentingColumn.children.length; i++) {
            presentingColumn.children[i].remove();
        }
        list = createInfoList();
    }
    presentingColumn.appendChild(list);

}

function createInfoList() {
    let list = document.createElement('ul');
    console.log('presenting');
    for (let [descriptor, value] of Object.entries(window.hls.levels[window.hls.currentLevel])) {
        if(value !== null && typeof value === 'object') continue;
        let listItem = document.createElement('li');
        listItem.id = descriptor;
        let textNode = document.createTextNode(`${descriptor}: ${value}`);
        listItem.appendChild(textNode);

        list.appendChild(listItem);
    }
    
    return list;
}

function setQualityLevels() {
    console.log('seting quality levels');
    let i = 0;
    let dropdownSubmenuChildren = document.getElementById("submenu").children;
    for(let li of dropdownSubmenuChildren) {
        li.innerHTML = `${window.hls.levels[i].width}x${window.hls.levels[i].height}p`;
        li.id = i+1;
        i++;
    }
}

/*function setQualityLevels() {
    console.log('seting quality levels');
    let i = 0;
    let qualities = [];
    for(let level of window.hls.levels) {
        qualities.add[level.height];
    }
    return qualities;
} */


function changeQuality(level) {
    if(hls.currentLevel !== level-1) {
        console.log('level '+ level-1);
        window.hls.currentLevel = level-1;
    }
}