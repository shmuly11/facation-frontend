// require('dotenv').config()
//  import {dotenv} from 'dotenv'
// dotenv.config()
const welcome = document.querySelector('#welcome')
const profileForm = document.querySelector('#profile-form')
const profileContainer = document.querySelector('#profile-container')
const searchLocationForm = document.querySelector("#search-location")
const locationsContainer = document.querySelector("#locations-container")
// const result = dotenv.config()
// console.log(result)

function getUsername(){
    // console.log('process', process.env.API_KEY)
    // console.log('dot', dotenv)
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
    let removeBtn = document.createElement('button')
    removeBtn.textContent = 'Remove Background'
    image.src = user.profile_photo
    profileContainer.append(image, removeBtn)

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

function removeBackground(image){
    
    fetch("https://background-removal.p.rapidapi.com/remove", {
	method: "POST",
	headers: {    
		"content-type": "application/x-www-form-urlencoded",
		"x-rapidapi-key": "key used to be here",
		"x-rapidapi-host": "background-removal.p.rapidapi.com"
    },  
	"body": `image_url=${image}`
    })
    .then(res =>  res.json())
    .then(data => {
       let image = data.response.image_url
       let forgroundObj= {forground_photo: image} 
       updateProfile(forgroundObj)
       .then(renderForgroundPhoto)
    })
    .catch(err => {
        console.error(err);
    })

}

function renderForgroundPhoto(user){
    let image = document.createElement('img')
    image.src = user.forground_photo
    profileContainer.append(image)
}

function handleLocationForm(e){
    e.preventDefault()
    let location = e.target.location.value
    getLocationImages(location)
}

function getLocationImages(location){
    fetch(`https://api.unsplash.com/search/photos?client_id=key-used-to-be-here&query=${location}&page=1&per_page=3`)
    .then(res => res.json())
    .then(data => renderLocationImage(data.results))
}

function renderLocationImage(results){
    locationsContainer.innerHTML = ""
    results.forEach(image => {
        let img = document.createElement('img')
        img.src = image.urls.regular
        locationsContainer.append(img)
        
    });
}

searchLocationForm.addEventListener('submit', handleLocationForm)
profileForm.addEventListener('submit', handleProfileForm)
profileContainer.addEventListener('click', handleprofileClick)



getUsername()

