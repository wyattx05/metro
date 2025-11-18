// Music app tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.music-tab');
    const tabContents = document.querySelectorAll('.music-tab-content');
    const nowPlayingScreen = document.getElementById('now-playing-screen');
    const artistItems = document.querySelectorAll('.artist-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Open now playing screen when clicking a song
    artistItems.forEach(item => {
        item.addEventListener('click', function() {
            const songName = this.querySelector('.artist-name').textContent;
            openNowPlaying(songName);
        });
    });
});

function openNowPlaying(songName) {
    const nowPlayingScreen = document.getElementById('now-playing-screen');
    const trackTitleTop = document.querySelector('.track-info-top .track-title');
    const trackDetails = document.querySelector('.track-details div:first-child');
    
    trackTitleTop.textContent = songName;
    trackDetails.textContent = songName;
    nowPlayingScreen.classList.add('active');
}

function closeNowPlaying() {
    const nowPlayingScreen = document.getElementById('now-playing-screen');
    nowPlayingScreen.classList.remove('active');
}

// Play/pause toggle
document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    let isPlaying = false;

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            const icon = this.querySelector('span');
            
            if (isPlaying) {
                icon.className = 'mif-pause';
            } else {
                icon.className = 'mif-play';
            }
        });
    }
});
