# 📱 Social Media Feed Aggregator

A web-based application that aggregates content from multiple social media platforms (YouTube and Twitter/X) and displays them in a unified feed interface.

---

## 🎯 Project Overview

This project demonstrates **social media feed aggregation** by:
- Collecting data from multiple platforms (YouTube and Twitter)
- Normalizing different data structures into a common format
- Displaying aggregated content in a single, unified interface

---

## ✅ Activity Requirements Completed

### Task 1: Select at Least Two Platforms ✅
- **YouTube** - Video content platform
- **Twitter/X** - Social media posts

### Task 2: Use Real APIs or Sample JSON Data ✅
- **YouTube**: Real API integration (YouTube Data API v3) - requires API key in `config.js`
- **Twitter**: Sample JSON data (`twitter.json`)

### Task 3: Extract Required Fields ✅
All required fields extracted:
- **Platform** - Source platform name
- **Title** - Post/video title or text
- **Image** - Thumbnail or preview image
- **Date** - Published date
- **Link** - Direct URL to content

### Task 4: Normalize Data into Common Format ✅
- Converts platform-specific formats to unified structure
- Functions: `normalizeYouTubeData()`, `normalizeTwitterData()`

### Task 5: Display Data in Card View ✅
- Modern card-based UI
- Responsive grid layout
- Platform filtering functionality

---

## 📁 Project Structure

```
FEED AGGREGATOR/
│
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── script.js           # Core logic (data loading, normalization, rendering)
├── config.js           # API configuration (add YouTube API key here)
│
├── twitter.json        # Sample Twitter data
├── thumbnail.jpg       # Custom thumbnail image for twitter profile image
│
├── README.md           # This file
└── START_SERVER.bat    # Windows server starter 
```

---

## 🚀 How to Run

### Method 1: Using Python (Recommended)

1. Open Command Prompt or PowerShell
2. Navigate to project folder:
   ```bash
   cd "d:\FEED AGGREGATOR"
   ```
3. Start the server:
   ```bash
   python -m http.server 8000
   ```
4. Open browser and go to: `http://localhost:8000`
5. Click **"Load Feed"** button

### Method 2: Using Node.js

1. Open Command Prompt or PowerShell
2. Navigate to project folder:
   ```bash
   cd "d:\FEED AGGREGATOR"
   ```
3. Start the server:
   ```bash
   npx http-server
   ```
4. Open browser and go to: `http://localhost:8080` (or port shown)
5. Click **"Load Feed"** button

### Method 3: Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**

---

## 🔑 API Configuration

To use the YouTube API functionality, you need to add your YouTube API key to `config.js`:

1. Open `config.js` in your editor
2. Locate the `YOUTUBE_API_KEY` field
3. Add your API key between the quotes:
   ```javascript
   YOUTUBE_API_KEY: 'your-api-key-here',
   ```

## 🔄 How It Works

### Data Flow

```
1. User clicks "Load Feed"
        ↓
2. Load Data
   - YouTube: Real API
   - Twitter: Sample JSON (twitter.json)
        ↓
3. Data Normalization
   - normalizeYouTubeData() → Common format
   - normalizeTwitterData() → Common format
        ↓
4. Data Combination & Sorting
   - Merge all platforms
   - Sort by date (newest first)
        ↓
5. UI Rendering
   - Create card for each feed item
   - Display: Platform, Title, Image, Date, Link
        ↓
6. User sees unified feed
```

### Data Normalization

**YouTube Format:**
```json
{
  "items": [{
    "snippet": {
      "title": "Video Title",
      "publishedAt": "2025-01-20T10:30:00Z",
      "thumbnails": { "medium": { "url": "..." } }
    },
    "id": { "videoId": "abc123" }
  }]
}
```

**Twitter Format:**
```json
{
  "data": [{
    "text": "Tweet content",
    "created_at": "2025-01-22T08:30:00Z",
    "author": { "profile_image_url": "..." }
  }]
}
```

**Normalized Format (Common Structure):**
```json
{
  "platform": "YouTube",
  "title": "Video Title",
  "image": "thumbnail.jpg",
  "date": "2025-01-20T10:30:00Z",
  "link": "https://youtube.com/watch?v=...",
  "author": "Channel Name"
}
```

---

## 🎨 Features

- ✅ **Multi-platform Support**: Aggregates content from YouTube and Twitter
- ✅ **Data Normalization**: Converts different formats to unified structure
- ✅ **Card-Based UI**: Modern, responsive design
- ✅ **Platform Filtering**: Filter feeds by platform (All, YouTube, Twitter)
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Loading States**: Visual feedback during data loading
- ✅ **Error Handling**: Graceful error messages

---

## 📊 Data Sources

### YouTube Data
- **Real API**: Uses YouTube Data API v3 


### Twitter Data
- **Sample JSON**: Always uses `twitter.json` (5 sample tweets)
- Includes: Tweet text, profile images, dates, usernames

---

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling (Modern, Dark Theme)
- **JavaScript (Vanilla)** - Logic and DOM manipulation
- **JSON** - Data format

**No frameworks or libraries required!**

---

## 📝 Code Explanation

### Key Functions

**1. `loadFeedData()`**
- Checks for YouTube API key in `config.js`
- Loads YouTube data: Real API (if key) OR sample JSON
- Loads Twitter data: Always from sample JSON
- Calls normalization functions
- Renders feed in UI

**2. `loadYouTubeAPI()`**
- Fetches real videos from YouTube Data API v3
- Uses search query from config
- Requires valid API key in `config.js`

**2. `normalizeYouTubeData(youtubeData)`**
- Converts YouTube API format to common structure
- Extracts: platform, title, image, date, link, author

**3. `normalizeTwitterData(twitterData)`**
- Converts Twitter API format to common structure
- Extracts: platform, title, image, date, link, author

**4. `renderFeed(feeds)`**
- Creates HTML cards for each feed item
- Displays all required fields
- Applies platform filtering

**5. `filterFeeds(platform)`**
- Filters feeds by platform
- Updates UI in real-time

---

## 🎓 Learning Outcomes

By completing this project, I learnt:

- ✅ How APIs return data in JSON format
- ✅ The importance of data normalization
- ✅ How to parse and process JSON data
- ✅ Frontend integration with data sources
- ✅ Creating unified user interfaces
- ✅ Responsive web design principles

---

## 📄 License

This is an educational project for learning purposes.

---

**Built with**: HTML5, CSS3, JavaScript (Vanilla)  
**No frameworks required** - Pure vanilla JavaScript for easy understanding!
