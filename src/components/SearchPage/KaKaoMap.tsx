{/*import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [status, setStatus] = useState('로딩 중...');

  const defaultCoords = { lat: 33.5000, lng: 126.5312 }; // 일단은 제주 시청으로 기본 위치 설정

  // 지도 초기화
  useEffect(() => {
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current) {
        setStatus('카카오 지도 초기화 실패');
        return;
      }

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(defaultCoords.lat, defaultCoords.lng),
        level: 5,
      });
      mapInstanceRef.current = map;

      // 기본 마커 (제주 시청)
      const defaultMarker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(defaultCoords.lat, defaultCoords.lng),
        title: '제주 시청',
      });
      markersRef.current.push(defaultMarker);

      setStatus('지도 초기화 완료');
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
    }
  }, []);

  return (
    <div className="relative w-[393px] h-[507px] flex-shrink-0 rounded-t-[12px] border-t border-[#F78938] overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 text-xs">
        {status}
      </div>
    </div>
  );
};

export default KakaoMap;
*/}