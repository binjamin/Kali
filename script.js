// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSlideshow();
    initAudio();
    initEnterButton();
    initThemeToggle();
    initCalendar();
    initGuestWishes();
    initPhotoGallery();
    initDirections();
    initScrollAnimations();
});

// Slideshow functionality
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Audio functionality
function initAudio() {
    const muteBtn = document.getElementById('mute-btn');
    const bgMusic = document.getElementById('bg-music');
    const youtubePlayer = document.getElementById('youtube-player');
    let isMuted = false; // Start unmuted since autoplay is set
    
    // Set initial volume
    bgMusic.volume = 0.3;
    
    // Try to play immediately
    setTimeout(() => {
        bgMusic.play().catch(e => console.log('Initial audio play failed:', e));
    }, 500);
    
    muteBtn.addEventListener('click', function() {
        if (isMuted) {
            // Unmute and play
            bgMusic.muted = false;
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
            muteBtn.textContent = '🔇';
            isMuted = false;
        } else {
            // Mute
            bgMusic.muted = true;
            muteBtn.textContent = '🔊';
            isMuted = true;
        }
    });
    
    // Try to play on any user interaction
    document.addEventListener('click', function playAudio() {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
        }
    }, { once: false });
    
    // Also try on scroll
    let hasPlayed = false;
    window.addEventListener('scroll', function() {
        if (!hasPlayed && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Scroll audio play failed:', e));
            hasPlayed = true;
        }
    }, { once: true });
}

// Enter button functionality
function initEnterButton() {
    const enterBtn = document.getElementById('enter-btn');
    const cinematicIntro = document.getElementById('cinematic-intro');
    const mainInvitation = document.getElementById('main-invitation');
    
    enterBtn.addEventListener('click', function() {
        cinematicIntro.style.opacity = '0';
        cinematicIntro.style.transition = 'opacity 1s ease-out';
        
        setTimeout(() => {
            cinematicIntro.classList.add('hidden');
            mainInvitation.classList.remove('hidden');
            mainInvitation.style.opacity = '0';
            mainInvitation.style.transition = 'opacity 1s ease-in';
            
            setTimeout(() => {
                mainInvitation.style.opacity = '1';
            }, 100);
        }, 1000);
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('wedding-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeSwitch.checked = true;
    }
    
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('wedding-theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('wedding-theme', 'light');
        }
    });
}

// Calendar functionality
function initCalendar() {
    const calendarDays = document.querySelector('.calendar-days');
    const weddingDate = 24; // May 24
    
    // Generate calendar days for May 2018
    const firstDay = new Date(2018, 4, 1).getDay(); // May 2018, month 4 (0-indexed)
    const daysInMonth = 31;
    
    let html = '';
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isWeddingDay = day === weddingDate;
        const className = isWeddingDay ? 'calendar-day wedding-day' : 'calendar-day';
        html += `<div class="${className}">${day}</div>`;
    }
    
    calendarDays.innerHTML = html;
    
    // Add click animation to wedding day
    const weddingDayElement = document.querySelector('.wedding-day');
    if (weddingDayElement) {
        weddingDayElement.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    }
}

// Guest wishes functionality
function initGuestWishes() {
    const submitBtn = document.getElementById('submit-wish');
    const nameInput = document.getElementById('guest-name');
    const messageInput = document.getElementById('guest-message');
    const wishesDisplay = document.getElementById('wishes-display');
    
    // Load existing wishes
    loadWishes();
    
    submitBtn.addEventListener('click', function() {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (name && message) {
            const wish = {
                name: name,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            saveWish(wish);
            displayWish(wish);
            
            // Clear form
            nameInput.value = '';
            messageInput.value = '';
            
            // Show success animation
            submitBtn.textContent = '✓ ተልኳል!';
            submitBtn.style.background = '#28a745';
            
            setTimeout(() => {
                submitBtn.textContent = 'ላክ';
                submitBtn.style.background = '';
            }, 2000);
        }
    });
}

function saveWish(wish) {
    let wishes = JSON.parse(localStorage.getItem('wedding-wishes') || '[]');
    wishes.unshift(wish); // Add to beginning
    wishes = wishes.slice(0, 50); // Keep only last 50 wishes
    localStorage.setItem('wedding-wishes', JSON.stringify(wishes));
}

function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem('wedding-wishes') || '[]');
    const wishesDisplay = document.getElementById('wishes-display');
    
    wishes.forEach(wish => {
        displayWish(wish, false);
    });
}

function displayWish(wish, animate = true) {
    const wishesDisplay = document.getElementById('wishes-display');
    const wishElement = document.createElement('div');
    wishElement.className = 'wish-item';
    
    const date = new Date(wish.timestamp);
    const timeString = date.toLocaleDateString('am-ET', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    wishElement.innerHTML = `
        <div class="wish-author">${wish.name}</div>
        <div class="wish-message">${wish.message}</div>
        <div class="wish-time">${timeString}</div>
    `;
    
    if (animate) {
        wishElement.style.animation = 'slideInUp 0.5s ease-out';
    }
    
    wishesDisplay.insertBefore(wishElement, wishesDisplay.firstChild);
}

// Photo gallery functionality
function initPhotoGallery() {
    const photoUpload = document.getElementById('photo-upload');
    const photoGrid = document.getElementById('photo-grid');
    
    // Load existing photos
    loadPhotos();
    
    photoUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const photo = {
                        name: file.name,
                        data: event.target.result,
                        timestamp: new Date().toISOString()
                    };
                    
                    savePhoto(photo);
                    displayPhoto(photo);
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        // Clear input
        e.target.value = '';
    });
}

function savePhoto(photo) {
    let photos = JSON.parse(localStorage.getItem('wedding-photos') || '[]');
    photos.unshift(photo);
    photos = photos.slice(0, 100); // Keep only last 100 photos
    localStorage.setItem('wedding-photos', JSON.stringify(photos));
}

function loadPhotos() {
    const photos = JSON.parse(localStorage.getItem('wedding-photos') || '[]');
    const photoGrid = document.getElementById('photo-grid');
    
    photos.forEach(photo => {
        displayPhoto(photo, false);
    });
}

function displayPhoto(photo, animate = true) {
    const photoGrid = document.getElementById('photo-grid');
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    
    const img = document.createElement('img');
    img.src = photo.data;
    img.alt = photo.name;
    img.title = photo.name;
    
    photoItem.appendChild(img);
    
    if (animate) {
        photoItem.style.animation = 'slideInUp 0.5s ease-out';
    }
    
    photoGrid.insertBefore(photoItem, photoGrid.firstChild);
    
    // Add click to view full size
    img.addEventListener('click', function() {
        viewFullImage(photo.data, photo.name);
    });
}

function viewFullImage(src, name) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close on Escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Directions functionality
function initDirections() {
    const directionsBtn = document.getElementById('directions-btn');
    
    directionsBtn.addEventListener('click', function() {
        // Open Google Maps with directions to Atlas Hotel
        const url = 'https://maps.app.goo.gl/Pt9nrFRy4xagZEmp7';
        window.open(url, '_blank');
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
    
    // Observe detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animationDelay = `${index * 0.15}s`;
        observer.observe(item);
    });
}

// Utility function to add smooth scroll behavior
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add parallax effect to header content
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        headerContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.animation = 'fadeIn 0.5s ease-out';
        });
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        const themeSwitch = document.getElementById('theme-switch');
        themeSwitch.checked = !themeSwitch.checked;
        themeSwitch.dispatchEvent(new Event('change'));
    }
    
    // Press 'M' to toggle music
    if (e.key === 'm' || e.key === 'M') {
        const muteBtn = document.getElementById('mute-btn');
        muteBtn.click();
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Swipe detected - could add navigation between sections
        console.log('Swipe detected');
    }
}

// Performance optimization - debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(function() {
    // Scroll-related optimizations
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Error:', e.error);
    // Could add user-friendly error messages here
});

// Add service worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}
