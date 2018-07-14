//options
const CLIENT_ID = '200247652521-g3oife10n52rd96nf6dh8pcl1kbvg2gu.apps.googleusercontent.com';
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
let SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';
let authorizeButton = document.getElementById('authorize-button');
let signoutButton = document.getElementById('sign-out-button');

const content = document.querySelector('#content'),
    channelForm = document.querySelector('#channel-form'),
    channelInput = document.querySelector('#channel-input'),
    videoContainer = document.querySelector('#video-container');

    //default channel 
    const channelDefault = 'jsconfeu';

//get new channel
channelForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputValue = channelInput.value;

    getChannel(inputValue);
});

function showChannelInformation(data){
    const channelData = document.querySelector('#ChannelData');

    channelData.innerHTML = data;
}

//get channel default 
function getChannel(channel){
    // console.log(channel);
    gapi.client.youtube.channels.list({
        'part':'snippet,contentDetails,statistics',
        'forUsername':channel
    })
    .then(response => {
        console.log(response);
        const channel = response.result.items[0];

        let output = `
            <ul class='collection'>
                <li class='collection-item'>Title: ${channel.snippet.title}</li>
                <li class='collection-item'>ID: ${channel.id}</li>
                <li class='collection-item'>Views: ${numberWithCommas(channel.statistics.viewCount)}</li>
                <li class='collection-item'>Videos: ${numberWithCommas(channel.statistics.videoCount)}</li>
                <li class='collection-item'>Subscribers: ${numberWithCommas(channel.statistics.subscriberCount)}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a class='btn grey darken-3' target='_blank' href='https://youtube.com/${channel.snippet.customUrl}'>Visit Channel...</a>
        `;

        showChannelInformation(output);

        //playlist id 
        const playListId = channel.contentDetails.relatedPlaylists.uploads;

        requestVideoPlayList(playListId);
    })
    .catch(err => alert('This channel doesn\'t exist.'));
}


//get videos play list 
function requestVideoPlayList(id){
    const requestOptions = {
        playlistId:id,
        part:'snippet',
        maxResults: 10
    };

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(resp => {
        console.log(resp);
        const playLIstItems = resp.result.items;

        if (playLIstItems) {
            let output = `<h3 class='center-align'> More recent videos</h3>`;

            playLIstItems.forEach(item => {
                const videoid = item.snippet.resourceId.videoId;
                output+=`
                <div class='col s3'>
                <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoid}"
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                </iframe>
                </div>
                `;
            });
            

            videoContainer.innerHTML = output;
        }else{
            videoContainer.innerHTML = 'No videos for this channel.'
        }
    });
}

//Load auth2 Library 
function handleClientLoad() {
    gapi.load('client:auth2',initclient);
}
//Init API client library and set up sign in listener 
function initclient(){
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        //listen for sign in state changes 
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        //Handle initial sign in state 
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;

        getChannel(channelDefault);
    });
}

//updateSigninStatus function 
function updateSigninStatus(isSignedIn){
    if (isSignedIn) {
        authorizeButton.style.display= 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display='block';
    }else{
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display='none';
    }
}

function handleAuthClick(e){
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(e){
    gapi.auth2.getAuthInstance().signOut();
}

//add commas to numbers 
function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
}