// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const inputs = form.querySelectorAll('input, textarea');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const subject = inputs[2].value;
    const message = inputs[3].value;
    
    // Create mailto link
    const mailtoLink = `mailto:jangirprince642@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Thanks for reaching out! Opening your email client...');
    form.reset();
}

// Play button animation
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// Lazy loading animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe music cards and album cards
document.querySelectorAll('.music-card, .album-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
});

// YouTube Videos Loader
async function loadYouTubeVideos() {
    const channelId = 'UCQJwPnR4yPCfNMcgfPYPnKw'; // haryanvivibes642 channel ID
    const container = document.getElementById('videos-container');
    const loading = document.getElementById('loading');
    
    try {
        // Using RSS feed instead of API (no key needed)
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        
        // Fetch RSS feed
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        
        if (data.status.http_code === 200) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'application/xml');
            const entries = xmlDoc.getElementsByTagName('entry');
            
            if (entries.length === 0) {
                loadingError();
                return;
            }
            
            loading.style.display = 'none';
            
            // Process videos
            for (let i = 0; i < Math.min(entries.length, 8); i++) {
                const entry = entries[i];
                const title = entry.getElementsByTagName('title')[0]?.textContent || 'Unknown Title';
                const videoId = entry.getElementsByTagName('yt:videoId')[0]?.textContent || '';
                const published = entry.getElementsByTagName('published')[0]?.textContent || '';
                const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                
                if (videoId) {
                    createAudioCard(title, videoId, thumbnail, published);
                }
            }
        } else {
            loadingError();
        }
    } catch (error) {
        console.log('RSS Feed Error, trying alternate method...');
        loadPlaceholderVideos();
    }
}

function createAudioCard(title, videoId, thumbnail, published) {
    const container = document.getElementById('videos-container');
    
    const card = document.createElement('div');
    card.className = 'audio-card';
    
    const date = new Date(published);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    card.innerHTML = `
        <div class="audio-thumbnail">
            <img src="${thumbnail}" alt="${title}" onerror="this.src='https://via.placeholder.com/300x300?text=🎵'">
            <div class="play-overlay">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="play-icon">
                    <i class="fas fa-play"></i>
                </a>
            </div>
        </div>
        <div class="audio-info">
            <h4>${title}</h4>
            <p class="audio-date">${formattedDate}</p>
            <div class="audio-controls">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="audio-btn">
                    <i class="fab fa-youtube"></i> Watch
                </a>
            </div>
        </div>
    `;
    
    container.appendChild(card);
    
    // Animate in
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 50);
}

function loadPlaceholderVideos() {
    const container = document.getElementById('videos-container');
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    
    const placeholders = [
        { title: 'Latest Release', id: 'dQw4w9WgXcQ' },
        { title: 'New Music', id: 'dQw4w9WgXcQ' },
        { title: 'Coming Soon', id: 'dQw4w9WgXcQ' },
        { title: 'Check YouTube Channel', id: 'dQw4w9WgXcQ' }
    ];
    
    placeholders.forEach((item, index) => {
        setTimeout(() => {
            createAudioCard(item.title, item.id, 'https://via.placeholder.com/300x300?text=🎵', new Date().toISOString());
        }, index * 100);
    });
}

function loadingError() {
    const container = document.getElementById('videos-container');
    const loading = document.getElementById('loading');
    loading.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: #1DB954; margin-bottom: 1rem;"></i>
            <p>Unable to load videos. Visit the YouTube channel directly:</p>
            <a href="https://youtube.com/@haryanvivibes642" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">
                <i class="fab fa-youtube"></i> Visit YouTube
            </a>
        </div>
    `;
}

// Load YouTube videos when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('videos-container')) {
        loadYouTubeVideos();
    }
});

// Mobile menu toggle
const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Add animation on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

console.log('🎵 Suniiyo Music Website Loaded Successfully!');