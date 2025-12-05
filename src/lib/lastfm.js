const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0';

export async function getTopTracks(page = 1, limit = 50) {
  try {
    const response = await fetch(
      `${LASTFM_BASE_URL}/?method=chart.gettoptracks&api_key=${LASTFM_API_KEY}&format=json&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.tracks?.track || [];
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
}

export async function getTrackInfo(artist, track) {
  try {
    const response = await fetch(
      `${LASTFM_BASE_URL}/?method=track.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.track;
  } catch (error) {
    console.error('Error fetching track info:', error);
    throw error;
  }
}

export async function searchTracks(query, page = 1, limit = 50) {
  try {
    const response = await fetch(
      `${LASTFM_BASE_URL}/?method=track.search&api_key=${LASTFM_API_KEY}&track=${encodeURIComponent(query)}&format=json&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results?.trackmatches?.track || [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
}

