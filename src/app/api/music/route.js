import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Track from '@/models/Track';
import { getTopTracks, getTrackInfo } from '@/lib/lastfm';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const filter = searchParams.get('filter');
    const value = searchParams.get('value');

    if (action === 'fetch') {
      let query = {};
      
      if (filter && value) {
        if (filter === 'artist') {
          query.artist = { $regex: value, $options: 'i' };
        } else if (filter === 'track') {
          query.name = { $regex: value, $options: 'i' };
        } else if (filter === 'tag') {
          query.tags = { $in: [value] };
        } else if (filter === 'playcount') {
          const minPlaycount = parseInt(value);
          query.playcount = { $gte: minPlaycount };
        }
      }

      const tracks = await Track.find(query).sort({ fetchedAt: -1 }).limit(100);
      return NextResponse.json({ success: true, data: tracks });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/music:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const { action, count = 20 } = await request.json();

    if (action === 'fetch-and-save') {
      const tracks = await getTopTracks(1, parseInt(count));

      const savedTracks = [];

      for (const track of tracks) {
        try {
          const trackId = `${track.artist?.name || 'Unknown'}-${track.name}`;
          
          const existing = await Track.findOne({ lastfmId: trackId });
          
          if (!existing) {
            let trackDetails = null;
            try {
              trackDetails = await getTrackInfo(track.artist?.name || 'Unknown', track.name);
            } catch (error) {
              console.error(`Error fetching track details for ${track.name}:`, error);
            }

            const trackData = {
              lastfmId: trackId,
              name: track.name,
              artist: track.artist?.name || 'Unknown',
              album: trackDetails?.album?.title || '',
              image: track.image || [],
              playcount: parseInt(trackDetails?.playcount || track.playcount || 0),
              listeners: parseInt(trackDetails?.listeners || track.listeners || 0),
              url: track.url || trackDetails?.url || '',
              tags: trackDetails?.toptags?.tag?.map(t => t.name) || [],
              wiki: {
                summary: trackDetails?.wiki?.summary || '',
                content: trackDetails?.wiki?.content || '',
              },
            };

            const saved = await Track.create(trackData);
            savedTracks.push(saved);
          } else {
            savedTracks.push(existing);
          }
        } catch (error) {
          console.error(`Error saving track ${track.name}:`, error);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `Saved ${savedTracks.length} tracks`,
        data: savedTracks 
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/music:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('id');
    const deleteAll = searchParams.get('all') === 'true';

    if (deleteAll) {
      const result = await Track.deleteMany({});
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.deletedCount} tracks` 
      });
    }

    if (trackId) {
      const result = await Track.deleteOne({ lastfmId: trackId });
      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, message: 'Track not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Track deleted' });
    }

    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error in DELETE /api/music:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

