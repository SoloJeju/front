declare namespace kakao.maps {
  function load(callback: () => void): void;

  class Map {
    constructor(container: HTMLElement, options: { center: LatLng; level: number });
    setCenter(latlng: LatLng): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Size {
    constructor(width: number, height: number);
  }

  class MarkerImage {
    constructor(src: string, size: Size);
  }

  class Marker {
    constructor(options: { position: LatLng; image?: MarkerImage });
    setMap(map: Map | null): void;
  }

  class CustomOverlay {
    constructor(options: { content: string | HTMLElement; position: LatLng; yAnchor?: number });
    setMap(map: Map | null): void;
  }

  namespace event {
    function addListener(target: any, type: string, handler: (...args: any[]) => void): void;
  }
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}