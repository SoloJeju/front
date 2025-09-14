import { useEffect, useRef } from "react";
import { publicAxios } from "../../apis/axios";
import { CATEGORY_CONTENT_TYPE_MAP, CONTENT_TYPES } from "../../constants/contentTypes";
import type { Place, Category } from "../../types/searchmap";

import tagNoneIcon from "../../assets/TagNONE.svg";
import tagEasyIcon from "../../assets/TagEASY.svg";
import tagNormalIcon from "../../assets/TagNORMAL.svg";
import tagHardIcon from "../../assets/TagHARD.svg";
import more from "../../assets/arrow-more.svg";

interface KakaoMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLevel?: number;
  selectedCategory: Category;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = ({
  initialLat = 33.499621,
  initialLng = 126.531188,
  initialLevel = 3,
  selectedCategory,
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  let activeOverlay: any = null;
  let myLocationMarker: any = null;

  useEffect(() => {
    const kakaoLoad = async () => {
      if (!mapRef.current) return;
      const kakao = window.kakao;

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(initialLat, initialLng),
        level: initialLevel,
      });

      const createMyLocationMarker = (lat: number, lng: number) => {
        const markerSize = new kakao.maps.Size(48, 48);
        const markerImage = new kakao.maps.MarkerImage("/markers/MapPin.png", markerSize);
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
            createMyLocationMarker(myLat, myLng);
            map.setCenter(new kakao.maps.LatLng(myLat, myLng));
          },
          () => {
            createMyLocationMarker(initialLat, initialLng); // fallback
            map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
          }
        );
      } else {
        createMyLocationMarker(initialLat, initialLng); // fallback
        map.setCenter(new kakao.maps.LatLng(initialLat, initialLng));
      }

      const createMarker = (
        lat: number,
        lng: number,
        imageUrl?: string,
        size: number = 28,
        isMyLocation: boolean = false
      ) => {
        const markerImage = imageUrl
          ? new kakao.maps.MarkerImage(imageUrl, new kakao.maps.Size(size, size))
          : undefined;

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lng),
          image: markerImage,
        });

        marker.setMap(map);

        if (isMyLocation) {
          if (myLocationMarker) myLocationMarker.setMap(null);
          myLocationMarker = marker;
        }
      };

      const createSpotMarker = (spot: Place) => {
        const type = CONTENT_TYPES.find((c) => c.id === spot.contentTypeId);
        const markerImage = type
          ? new kakao.maps.MarkerImage(type.marker, new kakao.maps.Size(28, 28))
          : undefined;

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(spot.mapy, spot.mapx),
          image: markerImage,
        });
        marker.setMap(map);

        kakao.maps.event.addListener(marker, "click", () => {
          if (activeOverlay) activeOverlay.setMap(null);

          const difficultyIconMap: Record<string, string> = {
            NONE: tagNoneIcon,
            EASY: tagEasyIcon,
            NORMAL: tagNormalIcon,
            HARD: tagHardIcon,
          };

          const difficultyKey = spot.difficulty?.toUpperCase() ?? "NONE";
          const difficultyIcon = difficultyIconMap[difficultyKey] ?? tagNoneIcon;
          const contentTypeIcon = type?.marker ?? "/icons/default-type.svg";

          const popupHTML = `
            <div class="bg-[#FFFFFD] rounded-[12px] shadow-md border border-[#F78938] p-3 min-w-[240px] w-full max-w-[240px] text-xs font-[Pretendard] custom-overlay">
              <div class="flex items-center justify-between w-full mb-1">
                <div class="flex items-center gap-[2px]">
                  <span class="text-black text-[12px] font-medium leading-[14px] tracking-[-0.24px] whitespace-nowrap">${spot.title}</span>
                  <img src="${contentTypeIcon}" class="w-[12px] h-[12px]" />
                  <img src="${difficultyIcon}" class="w-[24px] h-[12px]" />
                </div>
                <a href="/search-detail/${spot.contentId}">
                  <img src="${more}" class="w-[12px] h-[12px]" />
                </a>
              </div>
              <p class="text-[#262626] text-[10px] leading-[12px] tracking-[-0.2px] break-words">${spot.addr1}</p>
              ${spot.tel ? `<p class="text-[#262626] text-[10px] leading-[12px] tracking-[-0.2px] break-words">${spot.tel}</p>` : ""}
              <p class="text-[#262626] text-[10px] leading-[12px] tracking-[-0.2px]">열려있는 동행방: ${spot.openCompanionRoomCount}</p>
              <div class="w-full flex justify-end">
                <button onclick="this.closest('.custom-overlay')?.remove()" class="text-[10px] leading-[12px] tracking-[-0.2px] text-[#F78938]">
                  닫기
                </button>
              </div>
            </div>
          `;

          const overlay = new kakao.maps.CustomOverlay({
            content: popupHTML,
            position: new kakao.maps.LatLng(spot.mapy, spot.mapx),
            yAnchor: 1,
          });

          overlay.setMap(map);
          activeOverlay = overlay;
        });
      };

      const handleLocation = (lat: number, lng: number) => {
        createMarker(lat, lng, "/markers/MapPin.png", 40, true);
        map.setCenter(new kakao.maps.LatLng(lat, lng));
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => handleLocation(pos.coords.latitude, pos.coords.longitude),
          () => handleLocation(initialLat, initialLng)
        );
      } else {
        handleLocation(initialLat, initialLng);
      }

      const isAllCategory = selectedCategory === "전체";
      const categoryId = CATEGORY_CONTENT_TYPE_MAP[selectedCategory];

      const params = {
        latitude: initialLat,
        longitude: initialLng,
        radius: 1000,
        ...(isAllCategory ? {} : { contentTypeId: categoryId }),
      };

      try {
        const res = await publicAxios.get("/api/tourist-spots/nearby", { params });
        const spots: Place[] = res.data.result.spots;
        spots.forEach(createSpotMarker);
      } catch (err) {
        console.error("장소 API 호출 실패:", err);
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