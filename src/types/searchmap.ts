export type Category =
  | "전체"
  | "숙박"
  | "여행코스"
  | "문화시설"
  | "축제"
  | "음식점"
  | "레포츠"
  | "쇼핑"
  | "관광지";

export interface Place {
  contentId: number;
  contentTypeId: number;
  title: string;
  addr1: string;
  mapx: number;
  mapy: number;
  distance: number;
  firstimage: string;
  difficulty: string;
  openCompanionRoomCount: number;
}

export interface PlaceListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    spots: Place[];
    totalCount: number;
  };
}

export interface GetPlaceListRequest {
  latitude: number;
  longitude: number;
  radius?: number;
  contentTypeId?: number | null;
}

// 카테고리 ↔ contentTypeId 매핑
export const CATEGORY_CONTENT_TYPE_MAP: Record<Category, number | null> = {
  전체: null,
  관광지: 12,
  문화시설: 14,
  축제: 15,
  여행코스: 25,
  레포츠: 28,
  숙박: 32,
  쇼핑: 38,
  음식점: 39,
};
