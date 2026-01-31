

const API_CONFIG = {
    
    YOUTUBE_API_KEY: '', 
    
    // API Settings
    YOUTUBE_SEARCH_QUERY: 'web development', // Search query for YouTube videos
    YOUTUBE_MAX_RESULTS: 5, // Number of videos to fetch
    
    // Use sample data if API key is not provided
    USE_SAMPLE_DATA: true // Will be set automatically based on API key presence
};

// Check if API keys are configured
if (API_CONFIG.YOUTUBE_API_KEY && API_CONFIG.YOUTUBE_API_KEY.trim() !== '') {
    console.log('✅ YouTube API key configured - will use real API');
    API_CONFIG.USE_SAMPLE_DATA = false;
} else {
    console.log('ℹ️ No YouTube API key - using sample data');
    API_CONFIG.USE_SAMPLE_DATA = true;
}
