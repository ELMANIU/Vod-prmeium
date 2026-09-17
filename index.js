export default {
  async fetch(request) {

    const url = new URL(request.url);

    const ORIGIN = "http://200.234.234.244";

    // Salud
    if (url.pathname === "/") {
      return new Response("Fenix VOD Worker activo", {
        headers:{
          "content-type":"text/plain"
        }
      });
    }


    // Proxy HLS
    if (url.pathname.startsWith("/vod/")) {

      const target = ORIGIN + url.pathname + url.search;


      const response = await fetch(target, {
        method: request.method,
        headers:{
          "Range": request.headers.get("Range") || "",
          "Origin":"*"
        }
      });


      const headers = new Headers(response.headers);

      headers.set(
        "Access-Control-Allow-Origin",
        "*"
      );

      headers.set(
        "Access-Control-Allow-Methods",
        "GET, OPTIONS"
      );

      headers.set(
        "Access-Control-Allow-Headers",
        "*"
      );

      headers.set(
        "Cache-Control",
        "no-cache, no-store"
      );


      return new Response(
        response.body,
        {
          status:response.status,
          headers
        }
      );

    }


    return new Response(
      "Ruta no encontrada",
      {status:404}
    );

  }
};
