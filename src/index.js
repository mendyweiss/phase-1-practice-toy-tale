let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  // added a fetch to get the content from server
  fetchFunc();

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// building the cards for the DOM W/ functionality 
function toyCardBuilder (element) {
  const addCard = document.createElement('div')
  addCard.setAttribute('class', 'card')
  addCard.setAttribute('id', element.name)
  const toyName = document.createElement('h2')
  toyName.textContent = element.name
  const toyPic = document.createElement('img')
  toyPic.setAttribute('src', element.image)
  toyPic.setAttribute('class', 'toy-avatar')
  const likeCount = document.createElement('p')
  likeCount.textContent = element.likes
  const likeButton = document.createElement('button')
  likeButton.setAttribute('class', 'like-btn')
  likeButton.setAttribute('id', element.id)
  likeButton.addEventListener('click', () => {patchFunc(element)})
  addCard.append(toyName, toyPic, likeCount, likeButton)
  document.querySelector('#toy-collection').append(addCard)
}



//get

function fetchFunc () {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(data => {
      data.forEach(element => {toyCardBuilder(element)})
    })
    .catch(err => {console.log(err.message)})
}

//post

function postFunc () {
  function userInput (){
    const nameInput = document.getElementsByName('name')[0]
    const imageInput = document.getElementsByName('image')[0]
    const bodyObj = {
      name: `${nameInput.value}`,
      image: `${imageInput.value}`,
      likes: 0 
    }
    return bodyObj
  };
  return fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(userInput())
  })
  .then(resp => resp.json())
  .then(element => toyCardBuilder(element))
}

//patch


function patchFunc (card) {
  let cardLikesAdder = (card.likes +=1)
  fetch(`http://localhost:3000/toys/${card.id}`, {
    method:"PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      likes: `${cardLikesAdder}`
    })
  })
  .then(resp => resp.json())
  .then(() => {
    document.getElementById(`${card.name}`).childNodes[2].textContent = cardLikesAdder
  })
}

document.querySelector('.submit').addEventListener('click', (e) => {
  e.preventDefault();
  postFunc();
  document.querySelector(".container").style.display = "none";
})