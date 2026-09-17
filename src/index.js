export default {
  async fetch(request) {

    const url = new URL(request.url);

    const origen = "http://200.234.234.244";

    // prueba principal
    if (url.pathname === "/") {
      return new Response("Fenix VOD Worker activo", {
        headers:{
          "content-type":"text/plain"
        }
      });
    }


    // Playlist HLS
    if (url.pathname === "/vod/pelicula1/playlist.m3u8") {

      const respuesta = await fetch(
        origen + "/vod/pelicula1/playlist.m3u8"
      );

      let texto = await respuesta.text();

      // Cambiar segmentos para que pasen por Cloudflare
      texto = texto.replace(
        /segment_[0-9]+\.ts/g,
        (match)=>{
          return "/vod/pelicula1/" + match;
        }
      );


      return new Response(texto,{
        headers:{
          "content-type":"application/vnd.apple.mpegurl",
          "cache-control":"no-cache"
        }
      });

    }


    // Segmentos TS
    if(url.pathname.startsWith("/vod/pelicula1/segment_")){

      return fetch(
        origen + url.pathname
      );

    }


    return new Response("Ruta no encontrada",{
      status:404
    });

  }
};
