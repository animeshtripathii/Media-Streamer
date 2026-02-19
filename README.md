# Media Streamer Application

A video streaming application built with React, leveraging the YouTube Data API v3. It features video playback, search, trending videos, watch history, and more.

## Features

-   **Home Feed**: Browse popular videos with pagination support.
-   **Search**: Full search functionality with history-based suggestions.
-   **Video Player**: Watch videos with details, description, and related recommendations.
-   **Trending**: View currently trending videos.
-   **Watch History**: Automatically saves watched videos to your history.
-   **Responsive Design**: distinct layouts for desktop and mobile.

## Project Structure

### Routes

| Route | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomeScroll` | Landing page displaying popular videos with infinite scroll. |
| `/trending` | `Trending` | Displays trending content. |
| `/search/:searchTerm` | `SearchFeed` | Shows search results for the given query. |
| `/watch/:id` | `Watch` | The video player page. |
| `/history` | `WatchHistory` | Displays your local watch history. |
| `/upload` | `Upload` | Upload page (Design placeholder). |
| `/profile` | `Profile` | User profile page (Design placeholder). |

### Components (`src/components`)

-   **`Layout`**: The main wrapper component that establishes the app's structure, including the `Navbar` and `Sidebar`.
-   **`Navbar`**: The top navigation bar. It includes the logo, search bar, and search suggestions dropdown. It creates search history suggestions based on your past queries.
-   **`Sidebar`**: The side navigation menu providing links to different sections (Home, Trending, History, etc.).

### Pages (`src/pages`)

-   **`HomeScroll.jsx`**: Fetches and displays a grid of popular videos. Implements infinite scroll using `usePaginationWithTokens`.
-   **`Trending.jsx`**: Fetches and displays trending videos using the YouTube API's `mostPopular` chart.
-   **`SearchFeed.jsx`**: Captures the search term from the URL and displays matching video results.
-   **`Watch.jsx`**: The detailed video player page. It plays the video using an iframe, displays video statistics, and shows a list of recommended videos on the side (or bottom on mobile). It also saves the video to `localStorage` history.
-   **`WatchHistory.jsx`**: Reads from `localStorage` (`watchHistory` key) and displays the list of recently watched videos.

### Hooks (`src/hooks`)

-   **`usePaginationWithTokens(fetchPage)`**:
    -   A custom hook to handle pagination logic compatible with YouTube API's token-based system.
    -   **Features**:
        -   Manages `nextPageToken` for infinite-like scrolling buttons.
        -   Calculates `totalPages` based on `pageInfo.totalResults` from the API response.
        -   Handles loading and error states.

-   **`useRecommendations(query)`**:
    -   Fetches recommended videos based on a query string (usually the current video's title).
    -   **Features**:
        -   Uses the `search` endpoint to find relevant videos.
        -   Handles loading and error states for the recommendations section.

## Setup & Configuration

1.  **Environment Variables**:
    -   Create a `.env` file in the root.
    -   Add your RapidAPI/YouTube API key: `VITE_RAPID_API_KEY=your_key_here`.

2.  **Installation**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
