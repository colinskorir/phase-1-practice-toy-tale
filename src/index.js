let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
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
// index.js

document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.getElementById('new-toy-form');
  const toyUrl = 'http://localhost:3000/toys';

  // Fetch and render toys when page loads
  fetchToys();

  // Handle form submission for new toy
  addToyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addToyForm);
      const newToy = {
          name: formData.get('name'),
          image: formData.get('image'),
          likes: 0
      };

      fetch(toyUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(toy => {
          renderToyCard(toy);
          addToyForm.reset();
      })
      .catch(error => console.error('Error adding toy:', error));
  });

  // Fetch all toys
  function fetchToys() {
      fetch(toyUrl)
          .then(response => response.json())
          .then(toys => {
              toys.forEach(toy => renderToyCard(toy));
          })
          .catch(error => console.error('Error fetching toys:', error));
  }

  // Render a single toy card
  function renderToyCard(toy) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" alt="${toy.name}" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;

      // Add like button event listener
      const likeBtn = card.querySelector('.like-btn');
      likeBtn.addEventListener('click', () => handleLike(toy));

      toyCollection.appendChild(card);
  }

  // Handle like button click
  function handleLike(toy) {
      const newLikes = toy.likes + 1;

      fetch(`${toyUrl}/${toy.id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
          },
          body: JSON.stringify({
              likes: newLikes
          })
      })
      .then(response => response.json())
      .then(updatedToy => {
          // Update the DOM
          const card = document.getElementById(updatedToy.id).closest('.card'); // Fix: Use closest to find the card
          const likesP = card.querySelector('p');
          likesP.textContent = `${updatedToy.likes} Likes`;
          toy.likes = updatedToy.likes; // Update local toy object
      })
      .catch(error => console.error('Error updating likes:', error));
  }

  // Provided code for toggling form visibility
  let addToy = false;
  document.getElementById('add-toy-btn').addEventListener('click', () => {
      addToy = !addToy;
      document.querySelector('.container').style.display = addToy ? 'block' : 'none';
  });
});