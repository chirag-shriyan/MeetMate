// const APP_ID = '56f1795800374982b964098590db2433';
// const  CHANNEL = 'mynewchannel';
// const  TOKEN = '00656f1795800374982b964098590db2433IACou6iu+M/XqTzYGIYyWlEs8HcyojjBDVy3hFOFHaL2rGf+nQjf9RTKIgCcR/YDMwyAZQQAAQAzDIBlAgAzDIBlAwAzDIBlBAAzDIBl'
// let UID = 106;



// const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

// let localTracks = []
// let remoteUsers = {}

// let joinAndDisplayLocalStream = async () => {
//     client.on('user-published', handleUserJoined)
//     client.on('user-left', handleUserLeft)

//     await client.join(APP_ID, CHANNEL, TOKEN, UID);

//     localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

//     let player = `<div class="video-container" id="user-container-${UID}">
//                     <div class="username-wrapper"><span class="user-name">My name</span></div>
//                     <div class="video-player" id="user-${UID}"></div>
//                 </div>`

//     document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

//     localTracks[1].play(`user-${UID}`);
    
//     await client.publish([localTracks[0], localTracks[1]])
// }


// let handleUserJoined = async (user,mediaType) => {
//     remoteUsers[user.uid] = user
//     await client.subscribe(user, mediaType)

//     if(mediaType === 'video'){
//         let player = document.getElementById(`user-container-${user.uid}`)
//         if(player != null){
//             player.remove()
//         }
//         player = `<div class="video-container" id="user-container-${user.uid}">
//                     <div class="username-wrapper"><span class="user-name">My name</span></div>
//                     <div class="video-player" id="user-${user.uid}"></div>
//                 </div>`

//         document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);
//         user.videoTrack.play(`user-${user.uid}`)
//     }
//     if(mediaType === 'audio'){
//         user.audioTrack.play()  
//     }
// }

// let handleUserLeft = async (user) => {
//     delete remoteUsers[user.uid]
//     document.getElementById(`user-container-${user.uid}`).remove()

// }

// let leaveAndRemoveLocalStream = async() =>{
//     for(let i=0 ; localTracks.length > i; i++){
//         localTracks[i].stop()
//         localTracks[i].close()
//     }

//     await client.leave()
//     window.open('/','_self')
// }

// let toggleMic = async(e) => {

//     localTracks[0].setMuted(true)
//     if(localTracks[0].muted){
//         await localTracks[0].setMuted(false)
//         document.getElementById("mic-btn").style.backgroundColor = "#43484A";
//         document.getElementById("mic-btn").innerHTML = "mic";
//         // document.getElementById("mic-btn").src = "{% static 'images/mo.png' %}"
        
//     }
//     else{
//         await localTracks[0].setMuted(true)
//         document.getElementById("mic-btn").style.backgroundColor = "rgb(255, 80, 80, 1)";
//         document.getElementById("mic-btn").innerHTML = "mic_off";
//         // document.getElementById("mic-btn").src = "{% static 'images/mf.png' %}"
//     }
// }

// let toggleCamera = async(e) => {
//     if(localTracks[1].muted){
//         await localTracks[1].setMuted(false)
//         document.getElementById("camera-btn").style.backgroundColor = "#43484A";
//         document.getElementById("camera-btn").innerHTML = "videocam";
//         // document.getElementById("camera-btn").classList.remove("fa-video-slash")
//     }
//     else{
//         await localTracks[1].setMuted(true)
//         document.getElementById("camera-btn").style.backgroundColor = "rgb(255, 80, 80, 1)";
//         document.getElementById("camera-btn").innerHTML = "videocam_off";
//         // document.getElementById("camera-btn").classList.add("fa-video-slash")
//         // document.getElementById("camera-btn").classList.remove("fa-video")
//     }
// }

// joinAndDisplayLocalStream()