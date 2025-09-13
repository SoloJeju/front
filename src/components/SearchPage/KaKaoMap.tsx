import { useEffect, useRef } from "react";
import { publicAxios } from "../../apis/axios";
import { CATEGORY_CONTENT_TYPE_MAP, CONTENT_TYPES } from "../../constants/contentTypes";
import type { Place, Category } from "../../types/searchmap";

interface KakaoMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLevel?: number;
  selectedCategory: Category;
}

interface KakaoLatLng { getLat(): number; getLng(): number; }
interface KakaoSize { width: number; height: number; }
interface KakaoMarkerImage { getUrl(): string; getSize(): KakaoSize; }
interface KakaoMarker { setMap(map: KakaoMap | null): void; getPosition(): KakaoLatLng; }
interface KakaoMap { setCenter(latlng: KakaoLatLng): void; getCenter(): KakaoLatLng; setLevel(level: number): void; getLevel(): number; }
interface KakaoMapOptions { center: KakaoLatLng; level: number; }
interface KakaoMarkerOptions { position: KakaoLatLng; image?: KakaoMarkerImage; }

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
        MarkerImage: new (src: string, size: KakaoSize) => KakaoMarkerImage;
        Size: new (width: number, height: number) => KakaoSize;
        load: (callback: () => void) => void;
      };
    };
  }
}

const KakaoMap = ({
  initialLat = 33.499621,
  initialLng = 126.531188,
  initialLevel = 3,
  selectedCategory,
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kakaoLoad = async () => {
      if (!mapRef.current) return;
      const kakao = window.kakao;

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(initialLat, initialLng),
        level: initialLevel,
      });

      const createMarker = (lat: number, lng: number, imageUrl?: string) => {
        const markerImage = imageUrl
          ? new kakao.maps.MarkerImage(imageUrl, new kakao.maps.Size(40, 40))
          : undefined;
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lng),
          image: markerImage,
        });
        marker.setMap(map);
      };

      // 내 위치 마커 표시
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const myLat = pos.coords.latitude;
            const myLng = pos.coords.longitude;
            createMarker(myLat, myLng, "/markers/MapPin.png");
            map.setCenter(new kakao.maps.LatLng(myLat, myLng));
          },
          () => {
            createMarker(initialLat, initialLng, "/markers/MapPin.png");
            map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
          }
        );
      } else {
        createMarker(initialLat, initialLng, "/markers/MapPin.png");
        map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
      }

      // 장소 API 호출
      const isAllCategory = selectedCategory === "전체";
      const categoryId = CATEGORY_CONTENT_TYPE_MAP[selectedCategory];

      const params = {
        latitude: initialLat,
        longitude: initialLng,
        radius: 1000,
        ...(isAllCategory ? {} : { contentTypeId: categoryId }),
      };

      console.log("📦 selectedCategory:", selectedCategory);
      console.log("📦 categoryId:", categoryId);
      console.log("📦 요청 파라미터:", params);


      try {
        const res = await publicAxios.post("/api/tourist-spots/nearby", { params });

        const spots: Place[] = res.data.result.spots;

        spots.forEach((spot) => {
          const type = CONTENT_TYPES.find((c) => c.id === spot.contentTypeId);
          createMarker(spot.mapy, spot.mapx, type?.marker);
        });
      } catch (err) {
        console.error("❌ 장소 API 호출 실패:", err);
      }
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(kakaoLoad);
    } else {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => window.kakao.maps.load(kakaoLoad);
    }
  }, [initialLat, initialLng, initialLevel, selectedCategory]);

  return <div ref={mapRef} className="w-full h-full relative z-0" />;
};

export default KakaoMap;
