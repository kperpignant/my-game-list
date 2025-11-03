let thumbUp = document.getElementsByClassName("fa-thumbs-up");
let thumbDown = document.getElementsByClassName("fa-thumbs-down");
let trash = document.getElementsByClassName("fa-trash");


Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(thumbDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messagesDown', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

///---------USED CHATGPT FOR THE API CALL HERE--------------
//----------------------------------------------------------

// Load votes first
let votesCache = {};

fetch('/platforms')
  .then(res => res.json())
  .then(votes => {
    votes.forEach(v => {
      votesCache[v.slug] = v.thumbUp - v.thumbDown;
    });
  });

// Fetch and display RAWG platforms
fetch('/rawg')
  .then(res => res.json())
  .then(data => {
    const platformContainer = document.getElementById('platforms');
    platformContainer.innerHTML = '';

    data.sort((a, b) => b.games_count - a.games_count);

    data.forEach(platform => {
      const div = document.createElement('div');
      div.classList.add('platform');
      div.innerHTML = `
        <h4>${platform.name}</h4>
        <p>Games available: ${platform.games_count.toLocaleString()}</p>
        <p>Votes: <span class="votes" id="votes-${platform.slug}">0</span></p>
        <button class="thumb-up fa fa-thumbs-up"></button>
        <button class="thumb-down fa fa-thumbs-down"></button>
      `;

      // Add event listeners
      div.querySelector('.thumb-up').addEventListener('click', () => {
        fetch('/platforms/upvote', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: platform.name,
            slug: platform.slug,
            games_count: platform.games_count
          })
        })
          .then(res => res.json())
          .then(updated => {
            document.getElementById(`votes-${platform.slug}`).textContent = updated.thumbUp - updated.thumbDown;
          });
      });

      div.querySelector('.thumb-down').addEventListener('click', () => {
        fetch('/platforms/downvote', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: platform.name,
            slug: platform.slug,
            games_count: platform.games_count
          })
        })
          .then(res => res.json())
          .then(updated => {
            document.getElementById(`votes-${platform.slug}`).textContent = updated.thumbUp - updated.thumbDown;
          });
      });

      platformContainer.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Error fetching RAWG platforms:', err);
    document.getElementById('platforms').innerText = 'Failed to load platforms.';
  });

  