import moodTypeImg from '../assets/moodType.svg';
import routeTypeImg from '../assets/routeType.svg';
import adventureTypeImg from '../assets/adventureType.svg';
import memoTypeImg from '../assets/memoType.svg';

export const USER_TYPES = {
  MOOD: '감성 여유형',
  ROUTE: '루트 집중형',
  ADVENTURE: '탐험 모험형',
  MEMO: '기록 관찰형',
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

export const userTypeImages: Record<UserType, string> = {
  '감성 여유형': moodTypeImg,
  '루트 집중형': routeTypeImg,
  '탐험 모험형': adventureTypeImg,
  '기록 관찰형': memoTypeImg,
};

// 각 유형에 대한 설명을 관리 - 임의로 적은건데 정해진 게 있는지 확인할 것
export const userTypeDescriptions: Record<UserType, string> = {
  '감성 여유형': '아름다운 풍경을 즐기며, 여유로운 여행을 선호해요.',
  '루트 집중형': '계획에 따라 움직이며, 알찬 여행을 만들어가요.',
  '탐험 모험형': '새로운 곳을 발견하고, 즉흥적인 도전을 즐겨요.',
  '기록 관찰형': '사진과 기록으로 모든 순간을 소중히 간직해요.',
};

export const defaultUserImage = moodTypeImg; // 기본 이미지 '감성 여유형'