const clientID = 'aec2ecae4514485db63205cfd62415cc';
let player, token;
var accountUrl = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&redirect_uri=http:%2F%2Fwww.touchcatdigital.ca&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20streaming%20user-read-birthdate%20user-read-currently-playing&response_type=token&state=123';
window.onSpotifyWebPlaybackSDKReady = () => {
    window.addEventListener("message", receiveMessage, false);
    var authWindow = window.open(accountUrl, '_blank');
    if (authWindow) {
        authWindow.focus();
    }

    function receiveMessage(event) {
        console.log(event);
        var msg = event.data;
        if (typeof msg === 'string') {
            var parseArray = msg.split('&');
            token = parseArray[0].split('=')[1];
            authWindow.close();
            player = new Spotify.Player({
                name: 'Max Tunage',
                getOAuthToken: cb => { cb(token); }
            });


            // Error handling
            player.addListener('initialization_error', ({ message }) => { console.error(message); });
            player.addListener('authentication_error', ({ message }) => { console.error(message); });
            player.addListener('account_error', ({ message }) => { console.error(message); });
            player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
            player.addListener('player_state_changed', state => { console.log(state); });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                var req = $.ajax({
                    url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
                    method: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify({
                        "uris": ["spotify:track:0GNI8K3VATWBABQFAzBAYe", "spotify:track:5yVIlYEHZxQVLyInCdldoS", "spotify:track:6xM8oBy40nK1rOd8WmoOPx", "spotify:track:4z1O25cq9g2kuJemmUxc21", "spotify:track:2EiGECydkS2M8OCcRHQZhT", "spotify:track:3unsLiH5FXmaDWtT5Imolu"]
                    }),
                    headers: {
                        "Authorization": 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });
                req.done(function (msg) {
                    let playerState;
                    player.setVolume(0.9);

                    console.log('PLAYING');
                    $('#playTrack').on('click', function () {
                        if (playerState === false) {
                            player.pause();
                            playerState = true;
                            $(".iPlay").text("play_circle_outline")
                        }
                        else {
                            player.resume();
                            playerState = false;
                            $(".iPlay").text("pause_circle_outline")
                        }
                    });

                    $('#previousTrack').on('click', function () {
                        player.previousTrack();
                    });
                    $('#nextTrack').on('click', function () {
                        player.nextTrack();
                    });

                });
                req.fail(function (jqXHR, textStatus) {
                    switch (jqXHR.status) {
                        case 403:
                            console.log('NEED PREMIUM ACCOUNT');
                            break;
                        case 404:
                            console.log('NO DEVICE');
                            break;
                        default:
                            break;
                    }
                });
                console.log('Ready with Device ID', device_id);

            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect();
        }
    };
};     