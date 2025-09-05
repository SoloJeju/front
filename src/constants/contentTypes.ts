import TouristIcon from '../assets/type-tourist.svg?react';
import CultureIcon from '../assets/type-culture.svg?react';
import FestivalIcon from '../assets/type-festival.svg?react';
import CourseIcon from '../assets/type-course.svg?react';
import LeportsIcon from '../assets/type-leports.svg?react';
import BedIcon from '../assets/type-bed.svg?react';
import ShoppingIcon from '../assets/type-shopping.svg?react';
import FoodIcon from '../assets/type-food.svg?react';
import type { FC, SVGProps } from 'react';

export interface ContentType {
  id: number;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}

export const CONTENT_TYPES: ContentType[] = [
  { id: 12, label: '관광지', icon: TouristIcon },
  { id: 14, label: '문화시설', icon: CultureIcon },
  { id: 15, label: '행사/공연/축제', icon: FestivalIcon },
  { id: 25, label: '여행코스', icon: CourseIcon },
  { id: 28, label: '레포츠', icon: LeportsIcon },
  { id: 32, label: '숙박', icon: BedIcon },
  { id: 38, label: '쇼핑', icon: ShoppingIcon },
  { id: 39, label: '음식점', icon: FoodIcon },
];