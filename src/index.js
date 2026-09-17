export default {
  async fetch(request) {

    const url = new URL(request.url);

    if (!url.pathname.startsWith("/vod/")) {
      return new Response(
        "Fenix VOD Worker activo",
        { status: 200 }
      );
    }

    const ORIGIN = "http://200.234.234.244";

    const target = ORIGIN + url.pathname + url.search;

    const response = await fetch(target, {
      headers: {
        "User-Agent": "FenixTV-Roku",
        "Range": request.headers.get("Range") || ""
      }
    });

    const headers = new Headers(response.headers);

    headers.set(
      "Access-Control-Allow-Origin",
      "*"
    );

    headers.set(
      "Access-Control-Allow-Headers",
      "*"
    );

    headers.set(
      "Cache-Control",
      "no-cache"
    );

    return new Response(
      response.body,
      {
        status: response.status,
        headers
      }
    );
  }
};
