///---------USED CHATGPT FOR THE API CALL HERE--------------
//----------------------------------------------------------
// let thumbUp = document.getElementsByClassName("fa-thumbs-up");
// let thumbDown = document.getElementsByClassName("fa-thumbs-down");
// let trash = document.getElementsByClassName("fa-trash");


// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// Array.from(thumbDown).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messagesDown', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });

///---------USED CHATGPT FOR THE API CALL HERE--------------
//----------------------------------------------------------

// Load votes first
// let votesCache = {};

// fetch('/platforms')
//   .then(res => res.json())
//   .then(votes => {
//     votes.forEach(v => {
//       votesCache[v.slug] = v.thumbUp - v.thumbDown;
//     });
//   });

// // Fetch and display RAWG platforms
// fetch('/rawg')
//   .then(res => res.json())
//   .then(data => {
//     const platformContainer = document.getElementById('platforms');
//     platformContainer.innerHTML = '';

//     data.sort((a, b) => b.games_count - a.games_count);

//     data.forEach(platform => {
//       const div = document.createElement('div');
//       div.classList.add('platform');
//       div.innerHTML = `
//         <h4>${platform.name}</h4>
//         <p>Games available: ${platform.games_count.toLocaleString()}</p>
//         <p>Votes: <span class="votes" id="votes-${platform.slug}">0</span></p>
//         <button class="thumb-up fa fa-thumbs-up"></button>
//         <button class="thumb-down fa fa-thumbs-down"></button>
//       `;

//       // Add event listeners
//       div.querySelector('.thumb-up').addEventListener('click', () => {
//         fetch('/platforms/upvote', {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name: platform.name,
//             slug: platform.slug,
//             games_count: platform.games_count
//           })
//         })
//           .then(res => res.json())
//           .then(updated => {
//             document.getElementById(`votes-${platform.slug}`).textContent = updated.thumbUp - updated.thumbDown;
//           });
//       });

//       div.querySelector('.thumb-down').addEventListener('click', () => {
//         fetch('/platforms/downvote', {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name: platform.name,
//             slug: platform.slug,
//             games_count: platform.games_count
//           })
//         })
//           .then(res => res.json())
//           .then(updated => {
//             document.getElementById(`votes-${platform.slug}`).textContent = updated.thumbUp - updated.thumbDown;
//           });
//       });

//       platformContainer.appendChild(div);
//     });
//   })
//   .catch(err => {
//     console.error('Error fetching RAWG platforms:', err);
//     document.getElementById('platforms').innerText = 'Failed to load platforms.';
//   });

// document.addEventListener('DOMContentLoaded', async () => {
//   const platformList = document.getElementById('platformList');
//   const gameList = document.getElementById('gameList');

//   try {
//     // Fetch platforms from your backend
//     const res = await fetch('/platforms');
//     const platforms = await res.json();

//     if (!Array.isArray(platforms) || platforms.length === 0) {
//       platformList.innerHTML = '<li>No platforms found</li>';
//       return;
//     }

//     // Render the platform names
//     platformList.innerHTML = platforms.map(p => `
//       <li class="platform" data-slug="${p.slug}" data-id="${p.id}">
//         <strong>${p.name}</strong>
//       </li>
//     `).join('');

//     // Add click listeners
//     document.querySelectorAll('.platform').forEach(item => {
//       item.addEventListener('click', async () => {
//         const slug = item.dataset.slug;
//         console.log(`Loading games for: ${slug}`);
//         const res = await fetch(`/games/${slug}`);
//         const games = await res.json();

//         if (!Array.isArray(games) || games.length === 0) {
//           gameList.innerHTML = `<p>No games found for ${slug}</p>`;
//           return;
//         }

//         gameList.innerHTML = games.map(g => `
//           <div style="margin-bottom: 10px; border-bottom: 1px solid #ccc;">
//             <img src="${g.background_image || ''}" alt="${g.name}" style="width: 200px; border-radius: 6px;"><br>
//             <strong>${g.name}</strong><br>
//             Rating: ${g.rating} | Released: ${g.released || 'N/A'}
//           </div>
//         `).join('');
//       });
//     });

//   } catch (err) {
//     console.error('Error fetching RAWG platforms:', err);
//     platformList.innerHTML = '<li>Error loading platforms</li>';
//   }
// });
  
// document.querySelectorAll('.platform-item').forEach(item => {
//   item.addEventListener('click', async () => {
//     const platformSlug = item.dataset.slug;
//     console.log(`Loading games for: ${platformSlug}`);

//     const gamesList = document.getElementById('games-list');
//     gamesList.innerHTML = '<p>Loading top 10 games...</p>';

//     try {
//       const response = await fetch(`/games/${platformSlug}`);
//       if (!response.ok) throw new Error('Failed to load games');
//       const games = await response.json();

//       // Take top 10
//       const topTen = games.slice(0, 10);

//       // Build HTML
//       gamesList.innerHTML = topTen.map(game => `
//         <div class="game-card">
//           <img src="${game.background_image || '/img/placeholder.png'}" alt="${game.name}">
//           <div>
//             <h4>${game.name}</h4>
//             <p>Rating: ${game.rating} ⭐</p>
//             <p>Released: ${game.released || 'N/A'}</p>
//           </div>
//         </div>
//       `).join('');
//     } catch (err) {
//       console.error('Error loading games:', err);
//       gamesList.innerHTML = '<p>Failed to load games.</p>';
//     }
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  const platformList = document.getElementById('platformList');
  const gamesList = document.getElementById('games-list');

  if (!platformList) return;

  // Attach event listener to all platform items
  platformList.addEventListener('click', async (event) => {
    const item = event.target.closest('.platform-item');
    if (!item) return;

    const slug = item.dataset.slug;
    console.log(`Loading games for: ${slug}`);

    try {
      const response = await fetch(`/games/${slug}`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const games = await response.json();
      console.log(`Received ${games.length} games for ${slug}`);

      // Sort by rating descending and keep top 10
      const topGames = games
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

      // Render top 10 games
      gamesList.innerHTML = topGames
        .map(
          (game) => `
          <div class="game-item" style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
            <img src="${game.background_image || ''}" 
                 alt="${game.name}" 
                 style="width: 200px; border-radius: 6px; margin-bottom: 5px;"><br>
            <strong>${game.name}</strong><br>
            Rating: ${game.rating || 'N/A'}<br>
            Released: ${game.released || 'N/A'}
          </div>
        `
        )
        .join('');

      if (topGames.length === 0) {
        gamesList.innerHTML = `<p>No games found for ${slug}</p>`;
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      gamesList.innerHTML = `<p style="color:red;">Error loading games for ${slug}</p>`;
    }
  });
});
