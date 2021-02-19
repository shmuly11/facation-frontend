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
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-form")
const signupBtn = document.getElementById("sign-up-button")
const mainePage = document.querySelector('#main-page')
const body = document.querySelector("body")
const profilePhoto = document.getElementById("profile-photo")
const showProfile = document.getElementById("show-profile-photo")
const showVacation = document.getElementById("show-albums")
const userLocations = document.getElementById('user-locations')
const userLocationsDiv = document.getElementById('user-location-div')
const createNewVacation = document.getElementById('create-new-vacation')
let usersProfilePic = ""
let locations = "ll"
let  number = 1
let users = "lle"
let addForm = false;
const companionsList = document.querySelector('#companions-container')

// signupForm.setAttribute("hidden", true)  
nextBtn.setAttribute("hidden", true)
previousBtn.setAttribute("hidden", true)
mainePage.setAttribute("hidden", true)
createFacation.setAttribute("hidden", true)
searchLocationForm.setAttribute("hidden", true)
profileForm.setAttribute("hidden", true)




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

    return fetch(`http://localhost:3000/users/${users}`)
    .then(res => res.json())
    

}

function renderName(user){
    let name = user.name
    welcome.textContent = `Hello ${users}! Welcome to Facation!`
    
}

function handleProfileForm(e){
    e.preventDefault()
    profileContainer.innerHTML=''
    let imageUrl = e.target.url.value
    let profileObj = {profile_photo: imageUrl}
    updateProfile(profileObj)
    .then(data =>{
        renderProfilePhoto(data)
    })
    profileForm.setAttribute("hidden",true)
}

function getProfileFromData(e){
   
    profileContainer.innerHTML = ''
    fetch(`http://localhost:3000/users/${users}`)
    .then(res => res.json())
    .then(data => {
        if(data.profile_photo!== null){
        let image = document.createElement('img')
        image.className = "cards"
        image.src = data.profile_photo
        profileContainer.append(image)
        }else{
            let image = document.createElement('img')
            image.className = "cards"
            image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrVvZ-cRUFVpe2SAQFf8lo_Pd9zCALVOwc4A&usqp=CAU'
            profileContainer.append(image)
        }
    })
    profileForm.setAttribute("hidden",true)
}

function renderProfilePhoto(user){
    profileContainer.innerHTML = ''
    let image = document.createElement('img')
    let image2 = document.createElement('img')
    image.className = "cards"
    image2.className = "cards"
    
    image.src = user.profile_photo
    image2.src = user.forground_photo
    profileContainer.append(image, image2)
}

function updateProfile(object){
    return fetch(`http://localhost:3000/users/${users}`,{
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

    fetch(`http://localhost:3000/locations/${location}/${number}`)
    .then(res => res.json())
    .then(data => {
        renderLocationImage(data)
        nextBtn.removeAttribute("hidden", false)
        previousBtn.removeAttribute("hidden", false)
        createFacation.removeAttribute("hidden", false)
    })
   searchLocationForm.reset()
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
    
        let image = e.target.src
        let newImage = document.createElement('img')
        newImage.src = image
        let button = document.createElement('button')
        button.innerHTML = 'remove image'
        selectedImages.append(newImage, button)

    
    

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
    setTimeout(resetCI, 4000)
    
}

function resetCI(){
    compositedImages.innerHTML =''
    selectedImages.innerHTML= ''
}

function createFacationBackend(data){
    fetch(`http://localhost:3000/vacations/${users}`,{
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


function findUser(e){
    getCompanions()
    e.preventDefault()
    users = e.target.username.value
    console.log(e.target.username.value.length)
    if(e.target.username.value.length !== 0){
    getUsername()
    .then(data => {
        renderName(data)
        
        users = data.name
        if(users === data.name ){
            
            loginForm.setAttribute("hidden", true)
            signupForm.setAttribute("hidden", true)
            mainePage.removeAttribute("hidden", false)
            if(data.profile_photo !== null){
                profileForm.setAttribute("hidden",true)
                
            }
           }   
    })
  }else{
    let message = document.createElement("h2")
    message.className = "errors"
    message.innerText = `Sorry But field cant be blank  `
    body.append(message)
  }
}


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

function renderSignUpForm(){
    addForm = !addForm;
    if (!addForm) {
      signupForm.setAttribute("hidden", true) 
    } else {
      signupForm.removeAttribute("hidden", true)
    }
  }

function createNewUser(e){
    e.preventDefault()
    getCompanions()
    let name = e.target.username.value
    if(e.target.username.value.length !== 0){
    const newUser = {name: name }
    fetch(`http://localhost:3000/users`,{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      })
      .then(response => response.json())
      .then(data => console.log(data))


    loginForm.setAttribute("hidden", true)
    signupForm.setAttribute("hidden", true)
    mainePage.removeAttribute("hidden", false)
    users = e.target.username.value
    welcome.textContent = `Hello ${users}! Welcome to Facation!`
    }else{
        let message = document.createElement("h2")
        message.className = "errors"
        message.innerText = `Sorry But field cant be blank  `
        body.append(message)
    }
}

function renderProfileForm(e){
    profileForm.removeAttribute("hidden",false)
}


function getAllVacations(e){
    profileContainer.innerHTML =''
    fetch(`http://localhost:3000//vacations/${users}`)
    .then(res => res.json())
    .then(data => {
        if(data.length > 0 ){data.forEach(locations => renderUsersLocations(locations))} 
        else{
            alert("seems like you dont have any vacations lets create one ")
           
    } 
    })
   
    
}


function renderUsersLocations(vacation){
  let h2 = document.createElement("h2")
  let div = document.createElement('div')
  h2.innerText = vacation.location
  h2.dataset.id = vacation.id
  h2.className ="small-cards"

  userLocations.append(h2)

}


function getImagesFromAlbum(e){
    
    if(e.target.tagName === "H2"){
    userLocationsDiv.innerHTML =''
    console.log
    fetch(`http://localhost:3000//locations/${e.target.dataset.id}`)
    .then(res => res.json())
    .then(data => {
        
        data.forEach(img => showAlbum(img))

    })
    }
}


function showAlbum(user){
    
    let img = document.createElement('img')
    img.src = user.url
    img.className = "cards"
    userLocationsDiv.append(img)
}

function renderCreateOption(e){
    userLocationsDiv.innerHTML=''
    profileContainer.innerHTML =''
  searchLocationForm.removeAttribute("hidden",false)
}

loginForm.addEventListener("submit", findUser)
createFacation.addEventListener('click', handleCreateFacation)
selectedImages.addEventListener('click', handleSelectedImageClick)
locationsContainer.addEventListener('click', handleLocationsClick)
searchLocationForm.addEventListener('submit', handleLocationForm)
profileForm.addEventListener('submit', handleProfileForm)
profileContainer.addEventListener('click', handleprofileClick)
signupForm.addEventListener("submit",createNewUser) 
signupBtn.addEventListener("click", renderSignUpForm)
profilePhoto.addEventListener("click",renderProfileForm)
showProfile.addEventListener("click",getProfileFromData)
showVacation.addEventListener("click",getAllVacations)
userLocations.addEventListener("click",getImagesFromAlbum)
createNewVacation.addEventListener("click", renderCreateOption )



