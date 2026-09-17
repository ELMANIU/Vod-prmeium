export default {
  async fetch(request) {

    const url = new URL(request.url);

    // IP / dominio de tu servidor Nginx
    const ORIGEN = "http://200.234.234.244";


    // ==========================
    // TEST WORKER
    // ==========================
    if (url.pathname === "/") {

      return new Response(
        "Fenix VOD Worker activo",
        {
          headers:{
            "Content-Type":"text/plain"
          }
        }
      );

    }



    // ==========================
    // PLAYLIST HLS
    // ==========================
    if (
      url.pathname === "/vod/pelicula1/playlist.m3u8"
    ) {


      const respuesta = await fetch(
        ORIGEN + "/vod/pelicula1/playlist.m3u8"
      );


      let playlist = await respuesta.text();


      // Cambiar segmentos para pasar por Worker
      playlist = playlist.replace(
        /segment_[0-9]+\.ts/g,
        (segmento)=>{
          return "/vod/pelicula1/" + segmento;
        }
      );


      // Cambiar subtítulos si existen
      playlist = playlist.replace(
        /playlist0\.vtt/g,
        "/vod/pelicula1/playlist0.vtt"
      );


      return new Response(
        playlist,
        {
          headers:{
            "Content-Type":
            "application/vnd.apple.mpegurl",

            "Access-Control-Allow-Origin":"*",

            "Cache-Control":
            "no-cache, no-store, must-revalidate"
          }
        }
      );


    }




    // ==========================
    // SEGMENTOS TS + VTT
    // ==========================

    if (
      url.pathname.startsWith("/vod/pelicula1/")
    ) {


      const rango =
      request.headers.get("Range");


      const headers = {};


      if(rango){
        headers.Range = rango;
      }



      const respuesta = await fetch(
        ORIGEN + url.pathname,
        {
          headers
        }
      );



      return new Response(
        respuesta.body,
        {

          status: respuesta.status,


          headers:{

            "Content-Type":
            respuesta.headers.get(
              "Content-Type"
            ) || "video/mp2t",


            "Content-Length":
            respuesta.headers.get(
              "Content-Length"
            ) || "",


            "Content-Range":
            respuesta.headers.get(
              "Content-Range"
            ) || "",


            "Accept-Ranges":
            "bytes",


            "Access-Control-Allow-Origin":
            "*",


            "Cache-Control":
            "no-cache"

          }

        }
      );


    }




    // ==========================
    // TODO LO DEMÁS
    // ==========================

    return new Response(
      "Ruta no encontrada",
      {
        status:404
      }
    );


  }
};
