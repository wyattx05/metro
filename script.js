window.onload = function () {
    displayClock();
    displayDate();
    quoteLiveTile();
    
    // Check if we should open search page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openSearch') === 'true') {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            toggleSearch();
        }, 100);
    }
    
    // Handle internal navigation for iOS web app mode
    handleInternalLinks();
}

// Prevent links from opening in mini browser on iOS web app
function handleInternalLinks() {
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (!target) return;
        
        const href = target.getAttribute('href');
        if (!href) return;
        
        // Check if it's an internal HTML page
        if (href.endsWith('.html') || href === 'index.html') {
            e.preventDefault();
            window.location.href = href;
        }
    }, false);
}

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

const tiles = document.querySelectorAll('.tile');
const customMenu = document.getElementById('custom-menu');

tiles.forEach(tile => {
  tile.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const menuX = e.pageX + 'px';
    const menuY = e.pageY + 'px';

    customMenu.style.left = menuX;
    customMenu.style.top = menuY;
    customMenu.style.display = 'block';
  });

  document.addEventListener('click', () => {
    customMenu.style.display = 'none';
  });
});

// For touch devices (long-press detection)
tiles.forEach(tile => {
  let pressTimer;

  tile.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => {
      const menuX = e.touches[0].pageX + 'px';
      const menuY = e.touches[0].pageY + 'px';

      customMenu.style.left = menuX;
      customMenu.style.top = menuY;
      customMenu.style.display = 'block';
    }, 2000);
  });

  tile.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
  });
});

function displayClock(){
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  if(hours < 10) {
    hours = '0' + hours;
  }
  if(minutes < 10) {
    minutes = '0' + minutes;
  }
  var display = hours + ':' + minutes;
  var clock = document.getElementById('clock');
  clock.textContent = display;
  
  setTimeout(displayClock, 1000); 
}

function displayDate() {
    var now = new Date();
    var date = now.getDate();
    var calendar = document.getElementById('calendar');
    calendar.textContent = date;
}

function toggleAllApps() {
  const allApps = document.getElementById('app-center');
  const startScreen = document.getElementById('start-screen');
  startScreen.classList.toggle('hidden');
  allApps.classList.toggle('open');
}

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;
const swipeThreshold = 50;  // Minimum swipe distance in pixels

const startScreen = document.getElementById('start-screen');
const allApps = document.getElementById('app-center');
const searchPage = document.getElementById('search-page');

startScreen.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX;
  touchstartY = e.changedTouches[0].screenY;
});

startScreen.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX;
  touchendY = e.changedTouches[0].screenY;
  handleGesture(0);
});

// Global document listener to catch swipes when info page or search page is open
document.addEventListener('touchstart', (e) => {
  if (allApps.classList.contains('open') || searchPage.classList.contains('active')) {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
  }
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (allApps.classList.contains('open')) {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    const swipeDistanceX = touchendX - touchstartX;
    const swipeDistanceY = Math.abs(touchendY - touchstartY);
    
    // Left swipe and mostly horizontal (not vertical scroll)
    if (swipeDistanceX < -swipeThreshold && swipeDistanceY < swipeThreshold * 2) {
      toggleAllApps();
    }
  } else if (searchPage.classList.contains('active')) {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    const swipeDistanceX = touchendX - touchstartX;
    const swipeDistanceY = Math.abs(touchendY - touchstartY);
    
    // Right swipe and mostly horizontal (not vertical scroll)
    if (swipeDistanceX > swipeThreshold && swipeDistanceY < swipeThreshold * 2) {
      toggleSearch();
    }
  }
}, { passive: true });

function handleGesture(pointer) {
  const swipeDistance = touchendX - touchstartX;
  
  if (pointer === 0) {
    // Main screen - swipe right to open info page, swipe left to open search page
    if (swipeDistance > swipeThreshold) {
      // Swipe right - open info page
      toggleAllApps();
    } else if (swipeDistance < -swipeThreshold) {
      // Swipe left - open search page
      toggleSearch();
    }
  }
}

async function quoteLiveTile() {
  try {
    const response = await fetch('https://yurippe.vercel.app/api/quotes?show=violet%20evergarden&random=1');
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    const quote = await response.json();
    // console.log(quote);
    let liveTile = document.getElementById('live-tile');
    liveTile.textContent = quote[0].quote;
  } catch (error) {
    console.error(error.message);
  }
}

function flipTile() {
  const tile = document.getElementById('quote-tile');
  tile.classList.toggle('flipped');
  // Fetch new quote immediately so it's ready when tile flips back
  quoteLiveTile();
}

function applyTileColor(tileColor) {
  const defaultTileColor = '#1BA1E2';
  if (tileColor === '#000000') {
    alert("Can't use pure black as accent colour");
    return false; // Indicate failure
  } else {
    const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(tileColor) || /^rgba?\(\s*(\d{1,3}\s*,\s*){2,3}\d{1,3}\s*(,\s*(0(\.\d+)?|1(\.0+)?))?\s*\)$/i.test(tileColor);
    if (isValidColor) {
      document.documentElement.style.setProperty('--accent', tileColor);
      localStorage.setItem('Windows-Phone-Accent-Colour', tileColor);
      return true;
    } else {
      alert('Invalid color value. Please enter a valid hex (#rrggbb format) or rgba color (rr,gg,bb,aa format)');
      return false;
    }
  }
}

function applyBackgroundImage(backgroundImageUrl) {
  const defaultBackground = '#000000';
  
  const canvas = document.getElementById('blur-canvas');
  const ctx = canvas.getContext('2d');

  if (backgroundImageUrl) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow cross-origin image loading if needed
    img.src = backgroundImageUrl;

    img.onload = function() {
      resizeCanvas();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'blur(12px)';
      for (let y = 0; y < canvas.height; y += img.height) {
        ctx.drawImage(img, 0, y, canvas.width, img.height);
      }

      localStorage.setItem('Windows-Phone-Background', backgroundImageUrl);
    };

    img.onerror = function() {
      alert('Failed to load image. Please check the URL and try again.');
      document.body.style.backgroundColor = defaultBackground;
    };
  } else {
    document.body.style.backgroundColor = defaultBackground;
  }
}


function applySettings() {
  const selectedColor = document.querySelector('input[name="tile-color"]:checked').value;
  const isTileColorValid = applyTileColor(selectedColor);

  if (isTileColorValid) {
    const backgroundImageUrlInput = document.getElementById('background-image-url').value;
    applyBackgroundImage(backgroundImageUrlInput);
  }
}

function loadSettings() {
  const savedTileColor = localStorage.getItem('Windows-Phone-Accent-Colour') || '#1BA1E2';
  const savedBackgroundImage = localStorage.getItem('Windows-Phone-Background') || '#000000';

  document.documentElement.style.setProperty('--accent', savedTileColor);
  if (savedBackgroundImage.startsWith('http')) {
    applyBackgroundImage(savedBackgroundImage);  // Use the applyBackgroundImage function to load the saved image
  } else {
    document.body.style.backgroundColor = savedBackgroundImage;
  }
}

document.getElementById('apply-settings-button').addEventListener('click', applySettings);

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  resizeCanvas();
});

document.getElementById('background-image-url').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    applySettings();
  }
});

function clearStorage() {
  localStorage.removeItem('Windows-Phone-Accent-Colour');
  localStorage.removeItem('Windows-Phone-Background');
  loadSettings();
}

function resizeCanvas() {
  const canvas = document.getElementById('blur-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight + window.innerHeight;
  }
}

window.addEventListener('resize', resizeCanvas);

setInterval(flipTile, 10000);

// Control Center Functionality
const controlCenter = document.getElementById('control-center');
const controlOverlay = document.getElementById('control-overlay');
const statusBar = document.getElementById('status-bar');
let startY = 0;
let currentY = 0;
let isDragging = false;

// Click/tap status bar to toggle control center
statusBar.addEventListener('click', (e) => {
  if (controlCenter.classList.contains('active')) {
    closeControlCenter();
  } else {
    openControlCenter();
  }
});

// Touch events for swipe down
statusBar.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
  isDragging = true;
}, { passive: true });

statusBar.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  
  currentY = e.touches[0].clientY;
  const deltaY = currentY - startY;
  
  // Only open when swiping down from status bar, clamp between 0 and the control center height
  if (deltaY > 0) {
    // Limit deltaY so it doesn't go past 0 (fully visible)
    const clampedDelta = Math.min(deltaY, 100);
    const translateValue = clampedDelta - 100;
    // Don't go past 0 (fully open position)
    if (translateValue <= 0) {
      controlCenter.style.transform = `translateY(${translateValue}%)`;
    }
  }
}, { passive: true });

statusBar.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  isDragging = false;
  
  const deltaY = currentY - startY;
  
  // Open control center if swiped down more than 50px
  if (deltaY > 50) {
    openControlCenter();
  } else {
    controlCenter.style.transform = '';
  }
});

// Close control center when tapping overlay
controlOverlay.addEventListener('click', closeControlCenter);

// Swipe up to close control center
controlCenter.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
}, { passive: true });

controlCenter.addEventListener('touchmove', (e) => {
  if (!controlCenter.classList.contains('active')) return;
  
  currentY = e.touches[0].clientY;
  const deltaY = currentY - startY;
  
  // Only close when swiping up
  if (deltaY < 0) {
    controlCenter.style.transform = `translateY(${deltaY}px)`;
  }
}, { passive: true });

controlCenter.addEventListener('touchend', (e) => {
  if (!controlCenter.classList.contains('active')) return;
  
  const deltaY = currentY - startY;
  
  // Close if swiped up more than 100px
  if (deltaY < -100) {
    closeControlCenter();
  } else {
    controlCenter.style.transform = '';
  }
});

function openControlCenter() {
  controlCenter.classList.add('active');
  controlOverlay.classList.add('active');
  controlCenter.style.transform = '';
  // Prevent scrolling on body/start screen when control center is open
  document.body.style.overflow = 'hidden';
  startScreen.style.overflow = 'hidden';
}

function closeControlCenter() {
  controlCenter.classList.remove('active');
  controlOverlay.classList.remove('active');
  controlCenter.style.transform = '';
  // Re-enable scrolling when control center is closed
  document.body.style.overflow = '';
  startScreen.style.overflow = '';
}

// Navigation button functions
function goHome() {
  // Check if we're on an app page (not index.html)
  const currentPage = window.location.pathname;
  const isAppPage = !currentPage.endsWith('index.html') && !currentPage.endsWith('/');
  
  if (isAppPage) {
    // Add fade-out animation
    document.body.style.transition = 'opacity 0.3s ease-out';
    document.body.style.opacity = '0';
    
    // Navigate to home after animation
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  } else {
    // If already on home page, toggle info panel
    toggleAllApps();
  }
}

function goBack() {
  // Check if we're on an app page
  const currentPage = window.location.pathname;
  const isAppPage = !currentPage.endsWith('index.html') && !currentPage.endsWith('/');
  
  if (isAppPage) {
    // Add slide-out animation
    document.body.style.transition = 'transform 0.3s ease-out';
    document.body.style.transform = 'translateX(100%)';
    
    // Navigate back after animation
    setTimeout(() => {
      window.history.back();
    }, 300);
  } else {
    // If on home page, toggle info panel
    toggleAllApps();
  }
}

function openSearch() {
  // Check if we're on an app page (not index.html)
  const currentPage = window.location.pathname;
  const isAppPage = !currentPage.endsWith('index.html') && !currentPage.endsWith('/');
  
  if (isAppPage) {
    // Navigate to home and open search
    window.location.href = 'index.html?openSearch=true';
  } else {
    // Already on home page, just toggle search
    toggleSearch();
  }
}

// Toggle quick actions
document.querySelectorAll('.quick-action').forEach(btn => {
  btn.addEventListener('click', function() {
    this.classList.toggle('active');
  });
});

// Search Page Functionality
const searchInput = document.getElementById('search-input');
const searchApps = document.getElementById('search-apps');
const searchResults = document.getElementById('search-results');

// Function to display apps in search results
function displaySearchResults(apps) {
  if (apps.length === 0) {
    searchApps.innerHTML = '<div class="search-no-results">no results found</div>';
  } else {
    searchApps.innerHTML = apps.map(tile => `
      <a href="${tile.href}" class="search-app-item">
        <div class="search-app-icon">${tile.icon}</div>
        <div class="search-app-name">${tile.name}</div>
      </a>
    `).join('');
  }
}

function toggleSearch() {
  const startScreen = document.getElementById('start-screen');
  searchPage.classList.toggle('active');
  
  if (searchPage.classList.contains('active')) {
    // Move apps to the left when search opens
    startScreen.classList.add('search-open');
    // Display all apps when opening
    displaySearchResults(allTiles);
    // Focus input when opening
    setTimeout(() => searchInput.focus(), 100);
  } else {
    // Move apps back when search closes
    startScreen.classList.remove('search-open');
    // Clear search when closing
    searchInput.value = '';
    searchApps.innerHTML = '';
  }
}

// Get all tiles from the main grid
const allTiles = Array.from(document.querySelectorAll('.tile')).map(tile => {
  const iconName = tile.querySelector('.icon-name')?.textContent || '';
  const href = tile.getAttribute('href') || '#';
  const icon = tile.querySelector('.mdi, svg')?.outerHTML || '';
  
  return {
    name: iconName,
    href: href,
    icon: icon
  };
});

// Search functionality
searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase().trim();
  
  if (query === '') {
    // Show all apps when search is empty
    displaySearchResults(allTiles);
    return;
  }
  
  // Filter tiles based on query
  const results = allTiles.filter(tile => 
    tile.name.toLowerCase().includes(query)
  );
  
  // Display filtered results
  displaySearchResults(results);
});

// Add swipe-to-close for search page
searchPage.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX;
});

searchPage.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX;
  const swipeDistance = touchendX - touchstartX;
  
  // Swipe right (positive distance) to close search page
  if (swipeDistance > swipeThreshold) {
    toggleSearch();
  }
});

// Action button click handlers
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    console.log('Action clicked:', this.querySelector('span:last-child').textContent);
  });
});

