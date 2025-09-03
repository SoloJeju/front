import { useEffect, useRef } from "react";

interface KakaoMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLevel?: number;
}

// Kakao Maps API 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: any) => any;
        MarkerImage: new (src: string, size: any) => any;
        Size: new (width: number, height: number) => any;
        load: (callback: () => void) => void;
      };
    };
  }
}

const KakaoMap = ({
  initialLat = 33.499621, // 제주 시청 위도(기본)
  initialLng = 126.531188, // 제주 시청 경도
  initialLevel = 3,
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kakaoLoad = () => {
      if (!mapRef.current) return;
      const kakao = window.kakao;
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(initialLat, initialLng),
        level: initialLevel,
      });

      const createMarker = (lat: number, lng: number) => {
        const markerImage = new kakao.maps.MarkerImage(
          "/MapPin.png", // public 폴더 절대 경로
          new kakao.maps.Size(40, 40)
        );

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lng),
          image: markerImage,
        });

        marker.setMap(map);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const myLat = pos.coords.latitude;
            const myLng = pos.coords.longitude;
            createMarker(myLat, myLng);
            map.setCenter(new kakao.maps.LatLng(myLat, myLng));
          },
          () => {
            createMarker(initialLat, initialLng);
            map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
          }
        );
      } else {
        createMarker(initialLat, initialLng);
        map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
      }
    };

    if (!window.kakao) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2e874be546fe58cb5e5fa439db51cb7c&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(kakaoLoad);
      };
    } else {
      window.kakao.maps.load(kakaoLoad);
    }
  }, [initialLat, initialLng, initialLevel]);

  return <div ref={mapRef} className="w-full h-full relative z-0" />;
};

export default KakaoMap;