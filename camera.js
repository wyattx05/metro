// Camera App JavaScript
let stream = null;
let facingMode = 'user'; // 'user' for front camera, 'environment' for back camera
let flashOn = false;
let gridOn = false;

// Initialize camera when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCamera();
    setupEventListeners();
});

// Initialize camera
async function initCamera() {
    const video = document.getElementById('camera-feed');
    const errorDiv = document.getElementById('camera-error');
    
    try {
        const constraints = {
            video: {
                facingMode: facingMode,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        };
        
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        errorDiv.style.display = 'none';
    } catch (error) {
        console.error('Error accessing camera:', error);
        errorDiv.style.display = 'block';
    }
}

// Setup event listeners
function setupEventListeners() {
    const shutterBtn = document.getElementById('shutter-btn');
    const flashBtn = document.getElementById('flash-btn');
    const gridBtn = document.getElementById('grid-btn');
    const switchBtn = document.getElementById('switch-camera-btn');
    const galleryBtn = document.getElementById('gallery-btn');
    
    shutterBtn.addEventListener('click', takePhoto);
    flashBtn.addEventListener('click', toggleFlash);
    gridBtn.addEventListener('click', toggleGrid);
    switchBtn.addEventListener('click', switchCamera);
    galleryBtn.addEventListener('click', openGallery);
}

// Take photo
function takePhoto() {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('camera-canvas');
    const flashEffect = document.getElementById('flash-effect');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Show flash effect
    flashEffect.classList.add('active');
    setTimeout(() => {
        flashEffect.classList.remove('active');
    }, 300);
    
    // Play shutter sound (optional - can be added)
    // const shutterSound = new Audio('shutter.mp3');
    // shutterSound.play();
    
    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `WP_${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
}

// Toggle flash
function toggleFlash() {
    flashOn = !flashOn;
    const flashBtn = document.getElementById('flash-btn');
    
    if (flashOn) {
        flashBtn.classList.add('flash-on');
        flashBtn.querySelector('.mdi').classList.remove('mdi-flash-off');
        flashBtn.querySelector('.mdi').classList.add('mdi-flash');
    } else {
        flashBtn.classList.remove('flash-on');
        flashBtn.querySelector('.mdi').classList.remove('mdi-flash');
        flashBtn.querySelector('.mdi').classList.add('mdi-flash-off');
    }
    
    // Note: Flash control requires browser support and may not work on all devices
    if (stream) {
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        
        if (capabilities.torch) {
            track.applyConstraints({
                advanced: [{ torch: flashOn }]
            }).catch(err => console.log('Flash not supported:', err));
        }
    }
}

// Toggle grid
function toggleGrid() {
    gridOn = !gridOn;
    const container = document.querySelector('.camera-container');
    const gridBtn = document.getElementById('grid-btn');
    
    if (gridOn) {
        container.classList.add('grid-active');
        gridBtn.style.background = 'rgba(27, 161, 226, 0.7)';
    } else {
        container.classList.remove('grid-active');
        gridBtn.style.background = 'rgba(0, 0, 0, 0.5)';
    }
}

// Switch camera
async function switchCamera() {
    // Stop current stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    // Toggle facing mode
    facingMode = facingMode === 'user' ? 'environment' : 'user';
    
    // Reinitialize camera with new facing mode
    await initCamera();
}

// Open gallery (placeholder - opens photos app on iOS)
function openGallery() {
    // Try to open native photos app
    window.location.href = 'photos-redirect://';
    
    // Fallback - show message
    setTimeout(() => {
        alert('Gallery feature: Photos would open here');
    }, 500);
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});
