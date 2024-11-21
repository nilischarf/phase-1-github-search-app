document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const mainContainer = document.getElementById('github-container');
  
    let searchType = 'user';
  
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Switch to Repo Search';
    mainContainer.insertBefore(toggleButton, mainContainer.firstChild);
  
    toggleButton.addEventListener('click', () => {
      searchType = searchType === 'user' ? 'repo' : 'user';
      toggleButton.textContent = `Switch to ${searchType === 'user' ? 'Repo' : 'User'} Search`;
      searchInput.placeholder = `Search GitHub ${searchType === 'user' ? 'Users' : 'Repositories'}`;
    });
  
    const searchUsers = async (query) => {
      const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (!response.ok) {
        console.error('Failed to fetch users.');
        return;
      }
      const data = await response.json();
      displayUsers(data.items);
    };
  
    const displayUsers = (users) => {
      userList.innerHTML = ''; 
      reposList.innerHTML = ''; 
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50" />
          <p><strong>${user.login}</strong></p>
          <a href="${user.html_url}" target="_blank" rel="noopener noreferrer">View Profile</a>
          <button data-username="${user.login}">View Repos</button>
        `;
        userList.appendChild(li);
      });
    };
  
    const fetchUserRepos = async (username) => {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (!response.ok) {
        console.error('Failed to fetch repositories.');
        return;
      }
      const data = await response.json();
      displayRepos(data);
    };
  
    const searchRepos = async (query) => {
      const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (!response.ok) {
        console.error('Failed to fetch repositories.');
        return;
      }
      const data = await response.json();
      displayRepos(data.items);
    };
  
    const displayRepos = (repos) => {
      reposList.innerHTML = ''; 
      repos.forEach(repo => {
        const li = document.createElement('li');
        li.innerHTML = `
          <p><strong>${repo.name}</strong></p>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository</a>
        `;
        reposList.appendChild(li);
      });
    };
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        if (searchType === 'user') {
          searchUsers(query);
        } else {
          searchRepos(query);
        }
      }
    });
  
    userList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const username = e.target.getAttribute('data-username');
        fetchUserRepos(username);
      }
    });
  });