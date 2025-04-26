export default async function handler(req, res) {
  const { query } = req.query;
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  if (!query) {
    return res.status(400).json({ error: "Missing search query." });
  }

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
    query
  )}&key=${youtubeApiKey}&maxResults=5`;

  try {
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.items) {
      return res.status(404).json({ error: "No videos found." });
    }

    const videoId = searchData.items[0].id.videoId;

    // Fake transcript matches (for now, just to test)
    const fakeMatches = [
      { videoId, start: 60 * 5, text: `${query} mentioned at 5:00` },
      { videoId, start: 60 * 10, text: `${query} mentioned at 10:00` },
    ];

    res.status(200).json({ matches: fakeMatches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data." });
  }
}
