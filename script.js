

// Global variables
let allFeeds = []; // Store all normalized feeds
let currentFilter = 'all'; // Current platform filter

// ============================================
// STEP 1: LOAD DATA FROM APIS OR JSON FILES
// ============================================
async function loadFeedData() {
    try {
        showLoading(true);
        
        const promises = [];
        
        // Load YouTube data 
        if (typeof API_CONFIG !== 'undefined' && API_CONFIG.YOUTUBE_API_KEY && API_CONFIG.YOUTUBE_API_KEY.trim() !== '' && !API_CONFIG.USE_SAMPLE_DATA) {
            // Use real YouTube API
            promises.push(loadYouTubeAPI());
        } else {
            // No API key - show error
            promises.push(Promise.reject(new Error('YouTube API key not configured. Please add your API key to config.js')));
        }
        
        // Load Twitter data (always use sample JSON)
        promises.push(loadTwitterSample());
        
        // Wait for all data to load
        const results = await Promise.allSettled(promises);
        
        // Process results and normalize data
        const normalizedFeeds = [];
        
        // YouTube data (first result)
        if (results[0].status === 'fulfilled' && results[0].value) {
            normalizedFeeds.push(...normalizeYouTubeData(results[0].value));
        } else if (results[0].status === 'rejected') {
            // Show error message if YouTube API fails
            const errorMsg = results[0].reason?.message || 'Failed to load YouTube data';
            alert(`YouTube API Error: ${errorMsg}\n\nPlease check:\n1. API key is correct in config.js\n2. YouTube Data API v3 is enabled\n3. Internet connection is working`);
        }
        
        // Twitter data (second result)
        if (results[1].status === 'fulfilled' && results[1].value) {
            normalizedFeeds.push(...normalizeTwitterData(results[1].value));
        }

        // Sort by date (newest first)
        normalizedFeeds.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Store normalized feeds
        allFeeds = normalizedFeeds;

        // Render the feed
        renderFeed(allFeeds);
        showLoading(false);

    } catch (error) {
        console.error('Error loading feed data:', error);
        showLoading(false);
        alert('Error loading feeds. Check console for details.');
    }
}

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

// Load YouTube data from real API
async function loadYouTubeAPI() {
    try {
        const searchQuery = API_CONFIG.YOUTUBE_SEARCH_QUERY || 'web development';
        const maxResults = API_CONFIG.YOUTUBE_MAX_RESULTS || 5;
        const apiKey = API_CONFIG.YOUTUBE_API_KEY;
        
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`YouTube API error: ${data.error.message}`);
        }
        
        return data;
        
    } catch (error) {
        console.error('YouTube API failed:', error);
        throw error; 
    }
}

// Load Twitter sample data from JSON
async function loadTwitterSample() {
    try {
        const cacheBuster = '?v=' + new Date().getTime();
        const response = await fetch('twitter.json' + cacheBuster, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load twitter.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading Twitter sample data:', error);
        return { data: [] };
    }
}

// ============================================
// STEP 2: DATA NORMALIZATION
// ============================================
// Convert YouTube API response to common format
function normalizeYouTubeData(youtubeData) {
    const normalized = [];
    
    // Check if data exists
    if (!youtubeData.items || youtubeData.items.length === 0) {
        return normalized;
    }
    
    // YouTube API structure: items[].snippet
    youtubeData.items.forEach(item => {
        const videoId = item.id?.videoId || item.id;
        // Get thumbnail URL with fallback
        let thumbnailUrl = '';
        if (item.snippet?.thumbnails?.medium?.url) {
            thumbnailUrl = item.snippet.thumbnails.medium.url;
        } else if (item.snippet?.thumbnails?.default?.url) {
            thumbnailUrl = item.snippet.thumbnails.default.url;
        } else if (videoId) {
            // Fallback: Generate YouTube thumbnail URL from video ID
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
        
        normalized.push({
            platform: 'YouTube',
            title: item.snippet?.title || 'Untitled Video',
            image: thumbnailUrl,
            date: item.snippet?.publishedAt || new Date().toISOString(),
            link: `https://www.youtube.com/watch?v=${videoId}`,
            author: item.snippet?.channelTitle || 'Unknown Channel'
        });
    });

    return normalized;
}

// Convert Twitter API response to common format
function normalizeTwitterData(twitterData) {
    const normalized = [];
    
    // Check if data exists
    if (!twitterData.data || twitterData.data.length === 0) {
        return normalized;
    }
    
    // Twitter API structure: data[]
    twitterData.data.forEach(tweet => {
        normalized.push({
            platform: 'Twitter',
            title: tweet.text,
            image: tweet.author.profile_image_url,
            date: tweet.created_at,
            link: `https://twitter.com/${tweet.author.username}/status/${tweet.id}`,
            author: tweet.author.username
        });
    });

    return normalized;
}

// ============================================
// STEP 3: RENDER FEED IN UI
// ============================================
function renderFeed(feeds) {
    const feedContainer = document.getElementById('feedContainer');
    
    // Clear existing content
    feedContainer.innerHTML = '';

    if (feeds.length === 0) {
        feedContainer.innerHTML = `
            <div class="empty-state">
                <p>No feeds to display. Try loading the feed again.</p>
            </div>
        `;
        return;
    }

    // Create card for each feed item
    feeds.forEach(feed => {
        const card = createFeedCard(feed);
        feedContainer.appendChild(card);
    });
}

// Create individual feed card element
function createFeedCard(feed) {
    const card = document.createElement('div');
    card.className = `feed-card ${currentFilter !== 'all' && currentFilter !== feed.platform ? 'hidden' : ''}`;
    
    // Format date for display
    const formattedDate = formatDate(feed.date);
    
    // Determine platform badge class
    const badgeClass = feed.platform.toLowerCase();
    
    // For Twitter, use profile image as avatar, not main image
    const isTwitter = feed.platform === 'Twitter';
    const mainImage = isTwitter ? null : feed.image;
    const avatarImage = isTwitter ? feed.image : null;
    
    // Create card structure
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.innerHTML = `
        <span class="platform-badge ${badgeClass}">${feed.platform}</span>
        <span class="card-date">${formattedDate}</span>
    `;
    card.appendChild(cardHeader);
    
    // Add main image (for YouTube)
    if (mainImage && mainImage !== 'undefined' && mainImage.trim() !== '') {
        const img = document.createElement('img');
        img.src = mainImage;
        img.alt = feed.title;
        img.className = 'card-image';
        img.loading = 'lazy';
        img.onerror = function() {
            handleImageError(this, mainImage);
        };
        card.appendChild(img);
    } else if (!isTwitter) {
        // Show placeholder for non-Twitter if no image
        const placeholder = document.createElement('div');
        placeholder.className = 'card-image';
        placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; color: var(--text-secondary);';
        placeholder.textContent = '📷 No Image Available';
        card.appendChild(placeholder);
    }
    
    // Add title
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = feed.title;
    card.appendChild(title);
    
    // Add author section
    if (feed.author) {
        const authorDiv = document.createElement('div');
        authorDiv.className = 'card-author';
        
        if (avatarImage && avatarImage !== 'undefined' && avatarImage.trim() !== '') {
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarImage;
            avatarImg.alt = feed.author;
            avatarImg.className = 'author-avatar';
            avatarImg.onerror = function() {
                this.style.display = 'none';
            };
            authorDiv.appendChild(avatarImg);
        }
        
        const authorName = document.createElement('span');
        authorName.className = 'author-name';
        authorName.textContent = `@${feed.author}`;
        authorDiv.appendChild(authorName);
        
        card.appendChild(authorDiv);
    }
    
    // Add link
    const link = document.createElement('a');
    link.href = feed.link;
    link.target = '_blank';
    link.className = 'card-link';
    link.textContent = `View on ${feed.platform} →`;
    card.appendChild(link);

    return card;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Handle image loading errors
function handleImageError(img, originalSrc) {
    // Prevent infinite loop
    img.onerror = null;
    // Use SVG fallback
    img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'320\' height=\'180\'%3E%3Crect fill=\'%23FF0000\' width=\'320\' height=\'180\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23FFFFFF\' font-family=\'Arial\' font-size=\'16\' font-weight=\'bold\'%3EYouTube%3C/text%3E%3C/svg%3E';
    img.style.background = 'var(--border-color)';
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Show/hide loading indicator
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Filter feeds by platform
function filterFeeds(platform) {
    currentFilter = platform;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.platform === platform) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show/hide cards based on filter
    document.querySelectorAll('.feed-card').forEach(card => {
        const cardPlatform = card.querySelector('.platform-badge').textContent;
        if (platform === 'all' || cardPlatform === platform) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Clear feed
function clearFeed() {
    allFeeds = [];
    document.getElementById('feedContainer').innerHTML = `
        <div class="empty-state">
            <p>👆 Click "Load Feed" to see aggregated content from YouTube and Twitter</p>
        </div>
    `;
}

// ============================================
// EVENT LISTENERS
// ============================================

// Load feed button
document.getElementById('loadFeed').addEventListener('click', loadFeedData);

// Clear feed button
document.getElementById('clearFeed').addEventListener('click', clearFeed);

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filterFeeds(btn.dataset.platform);
    });
});

// ============================================
// INITIALIZATION
// ============================================
// Application ready - user can click "Load Feed" button
