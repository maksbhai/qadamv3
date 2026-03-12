export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    res.status(400).json({
      success: false,
      message: "Missing or invalid sheet URL"
    });
    return;
  }

  try {
    const parsedUrl = new URL(url);

    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        message: `Failed to fetch sheet: ${response.status} ${response.statusText}`
      });
      return;
    }

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sheet",
      error: error.message
    });
  }
}
