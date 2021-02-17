
const welcome = document.querySelector('#welcome')
const profileForm = document.querySelector('#profile-form')
const profileContainer = document.querySelector('#profile-container')
const searchLocationForm = document.querySelector("#search-location")
const locationsContainer = document.querySelector("#locations-container")
const submitBtn = document.getElementById('submit')
const buttons = document.getElementById("button-container")
const nextBtn = document.getElementById("next")
const previousBtn = document.getElementById("previous")

nextBtn.setAttribute("hidden", true)
previousBtn.setAttribute("hidden", true)
let locations = "ll"
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
    image.className = "cards"
    image2.className = "cards"
    
    image.src = user.profile_photo
    image2.src = user.forground_photo
    profileContainer.append(image, image2)

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
    e.preventDefault()
     locations = e.target.location.value
    
    getLocationImages(locations)

}

function getLocationImages(location){
    nextBtn.removeAttribute("hidden", false)
    previousBtn.removeAttribute("hidden", false)
    fetch(`http://localhost:3000/locations/${location}/${number}`)
    .then(res => res.json())
    .then(data => renderLocationImage(data))
}

function renderLocationImage(results){
    locationsContainer.innerHTML = ""
    results.forEach(image => {
        let img = document.createElement('img')
        img.className = "card"
        img.src = image.urls.regular
        locationsContainer.append(img)
        
    });

}

searchLocationForm.addEventListener('submit', handleLocationForm)
profileForm.addEventListener('submit', handleProfileForm)
profileContainer.addEventListener('click', handleprofileClick)

buttons.addEventListener("click", e => {
    if(e.target.innerText === "next"){
        number += 1 
        fetch(`http://localhost:3000/locations/${locations}/${number}`)
        .then(res => res.json())
        .then(data => renderLocationImage(data))
    }
    else{
        number -= 1 
        fetch(`http://localhost:3000/locations/${locations}/${number}`)
        .then(res => res.json())
        .then(data => renderLocationImage(data))
    }
})
    


getUsername()

