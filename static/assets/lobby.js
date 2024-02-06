let form = document.getElementById('lobby__form')

let displayName = sessionStorage.getItem("display_name")
if (displayName) {
    form.name.value = displayName
}

form.addEventListener('submit', (e) => {
    e.preventDefault()


    sessionStorage.setItem("display_name", e.target.name.value)

    let invitecode = e.target.room.value
    sessionStorage.setItem("roomId", invitecode)

    if (invitecode) {
        invitecode = String(Math.floor(Math.random() * 10000))
    }
    window.location.href = '/room2/' + invitecode
    // window.location =`room2.html?room=${invitecode}`
    // window.location.href = `room2/invitecode=${invitecode}`

})