let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});

let displayFrame = document.getElementById('stream__box')
let videoFrames = document.getElementsByClassName('video__container')
let userIdInDisplayFrame = null;

let expandVideoFrame = (e) => {
  let child = displayFrame.children[0]
  if(child){
    document.getElementById('streams__container').appendChild(child)
  }

  displayFrame.style.display = 'block'
  displayFrame.appendChild(e.currentTarget)
  userIdInDisplayFrame = e.currentTarget.id
  for(let i=0; i < videoFrames.length; i++){
    if(videoFrames[i].id != userIdInDisplayFrame){
      videoFrames[i].style.height = '50px'
      videoFrames[i].style.width = '70px'
    }
      
  }
}

for(let i=0; i < videoFrames.length; i++){
  videoFrames[i].addEventListener('click',expandVideoFrame)
}



////////////////////////////////////////////////////////////



const APP_ID = '22073edf6bd840249f75d89f8427fb12'

let uid = sessionStorage.getItem('uid')
if (!uid) {
    uid = String(Math.floor(Math.random() * 10000))
    sessionStorage.setItem('uid', uid)
}

let token = null;
let client;

let rtmClient;
let channel;


const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

let roomId = sessionStorage.getItem('roomId')

if (!roomId) {
    roomId = 'main2'
}

let displayName = sessionStorage.getItem("display_name")
if (!displayName) {
    window.location = 'lobby.html'
}

let localTracks = []
let remoteUsers = {}

let localScreenTracks;
let sharingScreen = false;

let joinRoomInit = async () => {
    rtmClient = await AgoraRTM.createInstance(APP_ID)
    await rtmClient.login({ uid, token })

    await rtmClient.addOrUpdateLocalUserAttributes({ 'name': displayName })

    channel = await rtmClient.createChannel(roomId)
    await channel.join()

    channel.on('MemberJoined', handleMemberJoined)
    channel.on('MemberLeft', handleMemberLeft)
    channel.on('ChannelMessage', handleChannelMessage)

    getMembers()
    addBotMessageToDom(`Welcome to MeetMate ${displayName}!👋`)

    client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    await client.join(APP_ID, roomId, token, uid)

    client.on("user-published", handleUSerPublished)
    client.on("user-left", handleUserLeft)

    // joinStream()
}

let joinStream = async () => {
    document.getElementById('join-btn').style.display = 'none'
    document.getElementsByClassName('stream__actions')[0].style.display = 'flex'

    // console.debug(`${window.location.origin}/room-record`);
    const res = await fetch(`${window.location.origin}/room-record/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            username: displayName,
            room: roomId,
            uid: uid
        })
    });
    console.log(await res.json());


    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {
        encoderConfig: {
            width: { min: 720, ideal: 1920, max: 1920 },
            height: { min: 720, ideal: 1080, max: 1080 }
        }
    })

    let player = `<div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>    
                </div>`

    document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)

    document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)

    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[0], localTracks[1]])
}

let handleUSerPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user

    await client.subscribe(user, mediaType)

    let player = document.getElementById(`user-container-${user.uid}`)
    if (player === null) {
        player = `<div class="video__container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}"></div>    
                </div>`
        document.getElementById('streams__container').insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${user.uid}`).addEventListener('click', expandVideoFrame)
    }

    if (displayFrame.style.display) {
        let videoFrame = document.getElementsByClassName(`user-container-${user.uid}`)
        if (videoFrame) {
            videoFrame.style.height = "70px"
            videoFrame.style.width = "60px"     
        }
    }

    if (mediaType === 'video') {
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio') {
        user.audioTrack.play()
    }
}

let hideDisplayFrame = () => {
    userIdInDisplayFrame = null
    displayFrame.style.display = null

    let child = displayFrame.children[0]
    document.getElementById('streams__container').appendChild(child)

    for (let i = 0; videoFrames.length > i; i++) {
        videoFrames[i].style.height = '150px'
        videoFrames[i].style.width = '200px'
    }

}

let switchToCamera = async () => {
    let player = `<div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                 </div>`
    displayFrame.insertAdjacentHTML('beforeend', player)

    await localTracks[0].setMuted(true)
    await localTracks[1].setMuted(true) 

    document.getElementById('mic-btn').classList.remove('active')
    document.getElementById('screen-btn').classList.remove('active')

    localTracks[1].play(`user-${uid}`)
    await client.publish([localTracks[1]])
}


let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    let item = document.getElementById(`user-container-${user.uid}`)
    if (item) {
        item.remove()
    }

    if (userIdInDisplayFrame === `user-container-${user.uid}`) {
        displayFrame.style.display = null
        let videoFrames = document.getElementsByClassName('video__container')

        for (let i = 0; videoFrames.length > i; i++) {
            videoFrames[i].style.height = '150px'
            videoFrames[i].style.width = '200px'
        }
    }

}
displayFrame.addEventListener('click', hideDisplayFrame)



let toggleCamera = async (e) => {
    let button = e.currentTarget
    // let element = document.getElementById('camera-btn')

    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false)
        button.classList.add('active')
        document.getElementById('vcb').innerHTML = "videocam";
        document.getElementById('camera-btn').style.backgroundColor = '#262625'
    } else {
        await localTracks[1].setMuted(true)
        button.classList.remove('active')
        document.getElementById('vcb').innerHTML = "videocam_off";
        document.getElementById('camera-btn').style.backgroundColor = '#FF5050'

    }
}

let toggleMic = async (e) => {
    let button = e.currentTarget
    let element = document.getElementById('mcb')


    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false)
        button.classList.add('active')
        element.innerHTML = "mic"
        document.getElementById('mic-btn').style.backgroundColor = '#262625'
        // document.getElementById(`user-${user.uid}`).style.backgroundColor = '#fff'

    } else {
        await localTracks[0].setMuted(true)
        button.classList.remove('active')
        element.innerHTML = "mic_off"
        document.getElementById('mic-btn').style.backgroundColor = '#FF5050'
    }
}

let toggleScreen = async (e) => {
    let screenButton = e.currentTarget
    let cameraButton = document.getElementById('camera-btn')

    if (!sharingScreen) {
        sharingScreen = true

        screenButton.classList.add('active')
        cameraButton.classList.remove('active')
        cameraButton.style.display = 'none'

        localScreenTracks = await AgoraRTC.createScreenVideoTrack()

        document.getElementById(`user-container-${uid}`).remove()
        displayFrame.style.display = 'block'

        let player = `<div class="video__container" id="user-container-${uid}">
                <div class="video-player" id="user-${uid}"></div>
            </div>`

        displayFrame.insertAdjacentHTML('beforeend', player)
        document.getElementById(`user-container-${uid}`).addEventListener('click', expandVideoFrame)

        userIdInDisplayFrame = `user-container-${uid}`
        localScreenTracks.play(`user-${uid}`)

        await client.unpublish([localTracks[1]])
        await client.publish([localScreenTracks])

        let videoFrames = document.getElementsByClassName('video__container')
        for (let i = 0; videoFrames.length > i; i++) {
            if (videoFrames[i].id != userIdInDisplayFrame) {
                videoFrames[i].style.height = '100px'
                videoFrames[i].style.width = '100px'
            }
        }


    } else {
        sharingScreen = false
        cameraButton.style.display = 'block'
        document.getElementById(`user-container-${uid}`).remove()
        await client.unpublish([localScreenTracks])

        switchToCamera()
    }
}

let leaveStream = async (e) => {
    e.preventDefault()

    sessionStorage.removeItem('display_name')
    sessionStorage.removeItem('uid')
    sessionStorage.removeItem('roomId')

    document.getElementsByClassName('stream__actions')[0].style.display = 'none'

    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.unpublish([localTracks[0], localTracks[1]])

    if (localScreenTracks) {
        await client.unpublish([localScreenTracks])
    }

    document.getElementById(`user-container-${uid}`).remove()

    if (userIdInDisplayFrame === `user-container-${uid}`) {
        displayFrame.style.display = null

        for (let i = 0; videoFrames.length > i; i++) {
            videoFrames[i].style.height = '150px'
            videoFrames[i].style.width = '200px'
        }
    }

    channel.sendMessage({ text: JSON.stringify({ 'type': 'user_left', 'uid': uid }) })
    document.getElementById('join-btn').style.display = 'block'
    window.location = '/roomend'
}

document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('screen-btn').addEventListener('click', toggleScreen)
document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveStream)

joinRoomInit()

