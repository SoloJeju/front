import TouristIcon from '../assets/type-tourist.svg?react';
import CultureIcon from '../assets/type-culture.svg?react';
import FestivalIcon from '../assets/type-festival.svg?react';
import CourseIcon from '../assets/type-course.svg?react';
import LeportsIcon from '../assets/type-leports.svg?react';
import BedIcon from '../assets/type-bed.svg?react';
import ShoppingIcon from '../assets/type-shopping.svg?react';
import FoodIcon from '../assets/type-food.svg?react';

export interface ContentType {
  id: number;
  label: string;
  marker: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const CONTENT_TYPES: ContentType[] = [
  { id: 12, label: '관광지', marker: '/markers/type-tourist.png', icon: TouristIcon },
  { id: 14, label: '문화시설', marker: '/markers/type-culture.png', icon: CultureIcon },
  { id: 15, label: '축제', marker: '/markers/type-festival.png', icon: FestivalIcon },
  { id: 25, label: '여행코스', marker: '/markers/type-course.png', icon: CourseIcon },
  { id: 28, label: '레포츠', marker: '/markers/type-leports.png', icon: LeportsIcon },
  { id: 32, label: '숙박', marker: '/markers/type-bed.png', icon: BedIcon },
  { id: 38, label: '쇼핑', marker: '/markers/type-shopping.png', icon: ShoppingIcon },
  { id: 39, label: '음식점', marker: '/markers/type-food.png', icon: FoodIcon },
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
