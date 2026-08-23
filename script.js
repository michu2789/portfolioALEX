// 1. Grab all the DOM elements
const hamburger = document.getElementById('hamburger');
const langSwitch = document.getElementById('lang-switch');
const mainTitle = document.getElementById('main-title');
const subtitle = document.getElementById('subtitle');
const portfolioTitle = document.getElementById('portfolio-title');
const portfolioDesc = document.getElementById('portfolio-desc');
const text1 = document.getElementById('text-1');
const text2 = document.getElementById('text-2');
const barrier = document.getElementById('tape-barrier');
const heroSection = document.getElementById('hero-section');
const photowallContainer = document.getElementById('photowall-container');
const jokeContainer = document.getElementById('joke-container');
const backToTopBtn = document.getElementById('back-to-top');
const jokeResponse = document.getElementById('joke-response');

// 2. Translation Dictionary (Updated with Joke Strings)
const translations = {
    en: {
        title: "hi alex",
        subtitle: "get well soon!",
        portfolioTitle: "Your Portfolio",
        portfolioDesc: "Keep scrolling down to move the tapes!",
        tape: "UNDER CONSTRUCTION &nbsp;&nbsp;&nbsp; UNDER CONSTRUCTION &nbsp;&nbsp;&nbsp; UNDER CONSTRUCTION &nbsp;&nbsp;&nbsp; UNDER CONSTRUCTION &nbsp;&nbsp;&nbsp; UNDER CONSTRUCTION &nbsp;&nbsp;&nbsp; UNDER CONSTRUCTION &nbsp;&nbsp;&nbsp; UNDER CONSTRUCTION",
        btnText: "Top or Bottom?",
        jokeText: "You're a Bottom."
    },
    de: {
        title: "hallo alex",
        subtitle: "gute besserung!",
        portfolioTitle: "Dein Portfolio",
        portfolioDesc: "Scrolle weiter nach unten, um die Bänder zu bewegen!",
        tape: "BAUSTELLE &nbsp;&nbsp;&nbsp; BAUSTELLE &nbsp;&nbsp;&nbsp; BAUSTELLE &nbsp;&nbsp;&nbsp; BAUSTELLE &nbsp;&nbsp;&nbsp; BAUSTELLE &nbsp;&nbsp;&nbsp; BAUSTELLE &nbsp;&nbsp;&nbsp; BAUSTELLE &nbsp;&nbsp;&nbsp; BAUSTELLE",
        btnText: "Top oder Bottom?",
        jokeText: "Du bist ein Bottom."
    }
};

// 3. Hamburger Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
});

// 4. Language Toggle
langSwitch.addEventListener('change', (e) => {
    const currentLang = e.target.checked ? 'de' : 'en';
    
    mainTitle.textContent = translations[currentLang].title;
    subtitle.textContent = translations[currentLang].subtitle;
    portfolioTitle.textContent = translations[currentLang].portfolioTitle;
    portfolioDesc.textContent = translations[currentLang].portfolioDesc;
    
    text1.innerHTML = translations[currentLang].tape;
    text2.innerHTML = translations[currentLang].tape;
    
    // Switch the prank button text too!
    backToTopBtn.textContent = translations[currentLang].btnText;
    jokeResponse.textContent = translations[currentLang].jokeText;
});

// 5. Endless Photowall Build Function
function buildEndlessPhotowall() {
    let photos = Array.from(photowallContainer.querySelectorAll('.photo-container'));
    
    // Shuffle the 12 photos
    for (let i = photos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [photos[i], photos[j]] = [photos[j], photos[i]];
    }
    
    // Clear container
    photowallContainer.innerHTML = '';
    
    function createTrack(trackId, photoSubset) {
        const row = document.createElement('div');
        row.className = 'marquee-row';
        
        const track = document.createElement('div');
        track.className = 'marquee-track';
        track.id = trackId;
        
        const setDiv = document.createElement('div');
        setDiv.className = 'photo-set';
        photoSubset.forEach(photo => {
            setDiv.appendChild(photo.cloneNode(true));
        });
        
        // Clone the block of 4 photos 4 times for endless loop
        track.appendChild(setDiv.cloneNode(true));
        track.appendChild(setDiv.cloneNode(true));
        track.appendChild(setDiv.cloneNode(true));
        track.appendChild(setDiv.cloneNode(true));
        
        row.appendChild(track);
        photowallContainer.appendChild(row);
    }

    // Split into 3 tracks
    createTrack('track-1', photos.slice(0, 4));
    createTrack('track-2', photos.slice(4, 8));
    createTrack('track-3', photos.slice(8, 12));
}

// Build the photowall on page load
buildEndlessPhotowall();

// 6. Master Scroll Event (Tapes, Marquee, Button Reveal)
window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;
    let documentHeight = document.body.scrollHeight;
    
    // Grab the first content block so we know exactly where it is
    const firstContentBlock = document.querySelector('.content-block');

    // --- UPDATED: Tape Fade Trigger ---
    // Start fading in after the user scrolls 200px past the top of the first content block
    const tapeStartPoint = firstContentBlock.offsetTop + 50;
    // Fade out before the very bottom (adjust the 200 if you want it to disappear sooner/later)
    const tapeEndPoint = documentHeight - windowHeight - 200;

    // Only show the banners if the user is between the start and end points
    if (scrollPosition > tapeStartPoint && scrollPosition < tapeEndPoint) {
        barrier.classList.remove('hidden');
    } else {
        barrier.classList.add('hidden');
    }

    // --- Tape Movement ---
    text1.style.transform = `translateX(${scrollPosition * -0.5}px)`;
    text2.style.transform = `translateX(${-800 + (scrollPosition * 0.7)}px)`;

    // --- Endless Horizontal Marquee Movement ---
    const track1 = document.getElementById('track-1');
    const track2 = document.getElementById('track-2');
    const track3 = document.getElementById('track-3');
    
    if (track1 && track2 && track3) {
        const setWidth = track1.querySelector('.photo-set').offsetWidth;
        const speed = 0.5; 
        const movement = scrollPosition * speed;
        
        // Track 1 moves Right
        let offset1 = (movement % setWidth) - setWidth;
        track1.style.transform = `translateX(${offset1}px)`;
        
        // Track 2 moves Left
        let offset2 = -(movement % setWidth);
        track2.style.transform = `translateX(${offset2}px)`;
        
        // Track 3 moves Right
        let offset3 = (movement % setWidth) - setWidth;
        track3.style.transform = `translateX(${offset3}px)`;
    }

    // --- UPDATED: Prank Button Reveal ---
    // Only show the button when the scroll position hits the absolute bottom of the page
    // (We subtract 50 pixels just to give a tiny bit of forgiveness if the browser cuts it off)
    if (scrollPosition + windowHeight >= documentHeight - 50) {
        jokeContainer.classList.remove('hidden');
    } else {
        jokeContainer.classList.add('hidden');
    }
});

// 7. Prank Button Logic
let clickCount = 0;
let targetClicks = Math.floor(Math.random() * 6) + 2; 
let jokeTimeout; 

backToTopBtn.addEventListener('click', () => {
    clickCount++;
    
    if (clickCount >= targetClicks) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        clickCount = 0;
        targetClicks = Math.floor(Math.random() * 6) + 2;
        jokeResponse.classList.remove('visible');
    } else {
        jokeResponse.classList.add('visible');
        clearTimeout(jokeTimeout);
        
        jokeTimeout = setTimeout(() => {
            jokeResponse.classList.remove('visible');
        }, 1500);
    }
});