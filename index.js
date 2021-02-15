
const welcome = document.querySelector('#welcome')
const profileForm = document.querySelector('#profile-form')
const profileContainer = document.querySelector('#profile-container')

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
    updateProfile(imageUrl)
    .then(renderProfilePhoto)
}

function renderProfilePhoto(user){
    let image = document.createElement('img')
    image.src = user.profile_photo
    profileContainer.append(image)

}

function updateProfile(image){
    return fetch('http://localhost:3000/users/1',{
        method: "PATCH",
        headers: {
            "Content-Type": 'application/json'
        },
        body:JSON.stringify({profile_photo: image})
    })
    .then(res => res.json())
    
}



profileForm.addEventListener('submit', handleProfileForm)




getUsername()

