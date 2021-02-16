
const welcome = document.querySelector('#welcome')
const profileForm = document.querySelector('#profile-form')
const profileContainer = document.querySelector('#profile-container')
const searchLocationForm = document.querySelector("#search-location")
const locationsContainer = document.querySelector("#locations-container")
let  number = 1


function getUsername(){

fetch('http://localhost:3000/users/1')
.then(res => res.json())
.then(renderName)
}

function renderName(user){
    let name = user.name
    welcome.textContent = `Hello ${name}! Welcome to Facation!`

}

function handleProfileForm(e){
    e.preventDefault()
    let imageUrl = e.target.url.value
    let profileObj = {profile_photo: imageUrl}
    updateProfile(profileObj)
    .then(renderProfilePhoto)
}

function renderProfilePhoto(user){
    let image = document.createElement('img')
    let image2 = document.createElement('img')
    let removeBtn = document.createElement('button')
    removeBtn.textContent = 'Remove Background'
    image.src = user.profile_photo
    image2.src = user.forground_photo
    profileContainer.append(image, removeBtn, image2)

}

function updateProfile(object){
    return fetch('http://localhost:3000/users/1',{
        method: "PATCH",
        headers: {
            "Content-Type": 'application/json'
        },
        body:JSON.stringify(object)
    })
    .then(res => res.json())
    
}

function handleprofileClick(e){
    
    if(e.target.tagName === "BUTTON"){
        let image = e.target.parentElement.querySelector('img').src
        removeBackground(image)
    }
}



function renderForgroundPhoto(user){
    let image = document.createElement('img')
    image.src = user.forground_photo
    profileContainer.append(image)
}

function handleLocationForm(e){
    // if(e.target.innerText === "more"){number += 1}
    // else if(e.target.innerText === "back") {number -=1 }
    e.preventDefault()
    let location = e.target.location.value
    getLocationImages(location)
}

function getLocationImages(location){
    
    fetch(`http://localhost:3000/locations/${location}/${number}`)
    .then(res => res.json())
    .then(data => renderLocationImage(data))
}

function renderLocationImage(results){
    locationsContainer.innerHTML = ""
    results.forEach(image => {
        let img = document.createElement('img')
        img.src = image.urls.regular
        locationsContainer.append(img)
        
    });
    const forwardBtn = document.createElement("button")
    const backBtn = document.createElement("button")
    forwardBtn.innerText = "more"
    backBtn.innerText = "back"
    locationsContainer.append(forwardBtn, backBtn)
}

searchLocationForm.addEventListener('submit', handleLocationForm)
profileForm.addEventListener('submit', handleProfileForm)
profileContainer.addEventListener('click', handleprofileClick)
// locationsContainer.addEventListener('click', getLocationImages )


getUsername()

