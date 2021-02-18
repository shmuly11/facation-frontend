
const welcome = document.querySelector('#welcome')
const profileForm = document.querySelector('#profile-form')
const profileContainer = document.querySelector('#profile-container')
const searchLocationForm = document.querySelector("#search-location")
const locationsContainer = document.querySelector("#locations-container")
const submitBtn = document.getElementById('submit')
const buttons = document.getElementById("button-container")
const nextBtn = document.getElementById("next")
const previousBtn = document.getElementById("previous")
const selectedImages = document.querySelector("#selected-images")
const createFacation = document.querySelector("#create-facation")
const compositedImages = document.querySelector('#composited-images')
const companionsList = document.querySelector('#companions-container')

nextBtn.setAttribute("hidden", true)
previousBtn.setAttribute("hidden", true)
let locations = "ll"
let  number = 1


function getCompanions(){
    fetch('http://localhost:3000/companions')
    .then(res => res.json())
    .then(renderCompanion)
}

function renderCompanion(companions){
    // let li = document.createElement('li')
    // li.dataset.id = companion.id
    // li.innerHTML=`
    // <img src=${companion.image} alt=${companion.name}>
    // ${companion.name}
    // `
    // companionsList.append(li)
    // let timer = setInterval(movement, 500)

    function movement(){
          
    // for (let i = 0; i < companions.length; i++) {
        let companion = companions[Math.floor(Math.random() * companions.length)]
    companionsList.dataset.id = companion.id
    companionsList.innerHTML = `
    <img src=${companion.image} alt=${companion.name}>
    ${companion.name}
    `  
    //   }
      
    }
    for (let i = 0; i < companions.length; i++) {
        setTimeout(movement, 200 * i)
      }
    
}

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
    selectedImages.dataset.id = locations
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

function handleLocationsClick(e){
    if(e.target.tagName === "IMG"){
        let image = e.target.src
        let newImage = document.createElement('img')
        newImage.src = image
        let button = document.createElement('button')
        button.innerHTML = 'remove image'
        selectedImages.append(newImage, button)

    }
    

}

function handleSelectedImageClick(e){
    
    if(e.target.tagName === "BUTTON"){
        let image = e.target.previousElementSibling
        image.remove()
        e.target.remove()

    }
}

function handleCreateFacation(e){
    
    let images = []
    let location = e.target.previousElementSibling.dataset.id
    console.log(location)
    let newImages = e.target.previousElementSibling.querySelectorAll('img')
    newImages.forEach(image => images.push(image.src))
    let companion = companionsList.dataset.id

    let fetchObj = {location, companion, images}
    
    createFacationBackend(fetchObj)
}

function createFacationBackend(data){
    fetch('http://localhost:3000/vacations',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => data.images.forEach( image => RenderCompositedImage(image.url)))
}

function RenderCompositedImage(image){
    let img = document.createElement('img')
    img.src = image
    compositedImages.append(img)

}

createFacation.addEventListener('click', handleCreateFacation)
selectedImages.addEventListener('click', handleSelectedImageClick)
locationsContainer.addEventListener('click', handleLocationsClick)
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
    

getCompanions()
getUsername()

