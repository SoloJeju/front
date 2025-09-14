export interface ContentType {
  id: number;
  label: string;
  marker: string; // 퍼블릭 마커 이미지 경로
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const CONTENT_TYPES: ContentType[] = [
  { id: 12, label: '관광지', marker: '/markers/type-tourist.png' },
  { id: 14, label: '문화시설', marker: '/markers/type-culture.png' },
  { id: 15, label: '축제', marker: '/markers/type-festival.png' },
  { id: 25, label: '여행코스', marker: '/markers/type-course.png' },
  { id: 28, label: '레포츠', marker: '/markers/type-leports.png' },
  { id: 32, label: '숙박', marker: '/markers/type-bed.png' },
  { id: 38, label: '쇼핑', marker: '/markers/type-shopping.png' },
  { id: 39, label: '음식점', marker: '/markers/type-food.png' },
];

export const CATEGORY_CONTENT_TYPE_MAP: Record<string, number> = {
  관광지: 12,
  문화시설: 14,
  축제: 15,
  여행코스: 25,
  레포츠: 28,
  숙박: 32,
  쇼핑: 38,
  음식점: 39,
};
