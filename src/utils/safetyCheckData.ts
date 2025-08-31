// 타입 정의
interface SafetyCheckItem {
  id: string;
  text: string;
  checked: boolean;
}

interface SafetyCategory {
  id: string;
  name: string;
  icon: string;
  items: SafetyCheckItem[];
}

interface SafetyCheckData {
  date: string;
  categories: SafetyCategory[];
  totalChecked: number;
  totalItems: number;
}

// 기본 안전 점검 데이터
export const getDefaultSafetyData = (): SafetyCategory[] => [
  {
    id: 'accommodation',
    name: '숙소',
    icon: '🏠',
    items: [
      { id: 'acc1', text: '예약한 숙소 주소/연락처 확인', checked: false },
      { id: 'acc2', text: '객실 잠금장치(문/창문) 정상 작동 확인', checked: false },
      { id: 'acc3', text: '비상구 위치 확인 (불 시 탈출 경로 미리 파악)', checked: false },
      { id: 'acc4', text: '소지품(여권, 지갑 등) 안전한 장소에 보관', checked: false },
      { id: 'acc5', text: '숙소 주변 편의시설(편의점, 병원) 위치 파악', checked: false },
    ],
  },
  {
    id: 'transportation',
    name: '이동',
    icon: '🚶',
    items: [
      { id: 'trans1', text: '택시 차량 번호·기사 얼굴 확인 후 탑승', checked: false },
      { id: 'trans2', text: '탑승 후 위치/차량 정보 지인·커뮤니티에 공유', checked: false },
      { id: 'trans3', text: '밤길 이동 시 환한 길로만 이동했는지 확인', checked: false },
      { id: 'trans4', text: '이어폰 양쪽 착용 X, 주변 소리 인식 유지', checked: false },
      { id: 'trans5', text: '야간 이동 시 지인에게 실시간 위치 공유', checked: false },
    ],
  },
  {
    id: 'equipment',
    name: '장비',
    icon: '📱',
    items: [
      { id: 'eq1', text: '휴대폰 충전 70% 이상 / 보조 배터리 준비 완료', checked: false },
      { id: 'eq2', text: '현금·교통카드 분리 보관 (분실 대비)', checked: false },
      { id: 'eq3', text: '응급 연락처(가족/친구/대사관/병원 등) 저장 완료', checked: false },
      { id: 'eq4', text: '현지 긴급번호(112/119) 메모 확인', checked: false },
      { id: 'eq5', text: '휴대폰 위치 공유 기능 활성화', checked: false },
    ],
  },
  {
    id: 'activity',
    name: '활동',
    icon: '🍽️',
    items: [
      { id: 'act1', text: '새로운 장소 가기 전 리뷰/혼행 적합도 확인', checked: false },
      { id: 'act2', text: '음식 알레르기·주의사항 체크 후 주문', checked: false },
      { id: 'act3', text: '술자리에서 음료를 혼자 두지 않기', checked: false },
      { id: 'act4', text: '야간 활동 시 안전한 장소에서만 활동', checked: false },
      { id: 'act5', text: '낯선 사람과의 만남 시 공개된 장소에서만', checked: false },
    ],
  },
  {
    id: 'health',
    name: '건강',
    icon: '🏥',
    items: [
      { id: 'health1', text: '필수 약품(알레르기, 위장약 등) 준비', checked: false },
      { id: 'health2', text: '현지 음식/물 섭취 시 주의사항 확인', checked: false },
      { id: 'health3', text: '현지 병원/약국 위치 미리 파악', checked: false },
      { id: 'health4', text: '건강보험 해외여행자보험 가입 확인', checked: false },
      { id: 'health5', text: '충분한 수면 취하기 (피로로 인한 판단력 저하 방지)', checked: false },
    ],
  },
  {
    id: 'communication',
    name: '소통',
    icon: '💬',
    items: [
      { id: 'comm1', text: '일정 및 위치 정보 가족/친구와 공유', checked: false },
      { id: 'comm2', text: '현지 언어 기본 인사말/긴급 표현 학습', checked: false },
      { id: 'comm3', text: '커뮤니티에 안전 상황 공유', checked: false },
      { id: 'comm4', text: '위험 상황 시 "도와주세요" 현지어 표현 미리 학습', checked: false },
      { id: 'comm5', text: '정기적으로 지인에게 안전 상황 보고하기', checked: false },
    ],
  },
  {
    id: 'mental',
    name: '마음 챙김',
    icon: '🧘',
    items: [
      { id: 'ment1', text: '낯선 사람이 따라오면 바로 가게/편의점으로 이동', checked: false },
      { id: 'ment2', text: '불안하면 커뮤니티에 위치 공유/도움 요청 글 작성', checked: false },
      { id: 'ment3', text: '일정 너무 무리하지 않고 밤늦게 활동 자제', checked: false },
      { id: 'ment4', text: '과도한 친근함에 경계심 유지 (낯선 사람의 친절에 주의)', checked: false },
      { id: 'ment5', text: '긴급 상황 시 침착하게 대응할 수 있도록 연습', checked: false },
    ],
  },
];

// 로컬 스토리지 키
const SAFETY_CHECK_KEY = 'safety_check_data';
const SAFETY_STATS_KEY = 'safety_stats';

// 오늘 날짜 문자열 반환
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 로컬 스토리지에서 안전 점검 데이터 불러오기
export const loadSafetyCheckData = (): SafetyCheckData => {
  try {
    const today = getTodayString();
    const savedData = localStorage.getItem(SAFETY_CHECK_KEY);
    
    if (savedData) {
              const parsedData = JSON.parse(savedData);
        if (parsedData.date === today) {
          // 오늘 데이터가 있지만 새로운 카테고리가 없는 경우 업데이트
          const defaultCategories = getDefaultSafetyData();
          const hasNewCategories = defaultCategories.some(newCat => 
            !parsedData.categories.find((existingCat: SafetyCategory) => existingCat.id === newCat.id)
          );
          
          if (hasNewCategories) {
            // 새로운 카테고리가 있으면 데이터 업데이트
            const updatedData: SafetyCheckData = {
              date: today,
              categories: defaultCategories,
              totalChecked: 0,
              totalItems: defaultCategories.reduce((sum, cat) => sum + cat.items.length, 0),
            };
            saveSafetyCheckData(updatedData);
            return updatedData;
          }
          
          return parsedData;
        }
    }
    
    // 오늘 데이터가 없으면 새로 생성
    const defaultCategories = getDefaultSafetyData();
    const newData: SafetyCheckData = {
      date: today,
      categories: defaultCategories,
      totalChecked: 0,
      totalItems: defaultCategories.reduce((sum, cat) => sum + cat.items.length, 0),
    };
    
    return newData;
  } catch (error) {
    console.error('안전 점검 데이터 로드 실패:', error);
    const defaultCategories = getDefaultSafetyData();
    return {
      date: getTodayString(),
      categories: defaultCategories,
      totalChecked: 0,
      totalItems: defaultCategories.reduce((sum, cat) => sum + cat.items.length, 0),
    };
  }
};

// 로컬 스토리지에 안전 점검 데이터 저장
export const saveSafetyCheckData = (data: SafetyCheckData): void => {
  try {
    localStorage.setItem(SAFETY_CHECK_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('안전 점검 데이터 저장 실패:', error);
  }
};

// 통계 데이터 불러오기
export const loadSafetyStats = () => {
  try {
    const savedStats = localStorage.getItem(SAFETY_STATS_KEY);
    if (savedStats) {
      return JSON.parse(savedStats);
    }
  } catch (error) {
    console.error('안전 점검 통계 로드 실패:', error);
  }
  
  return {
    completionRate: 0,
    streak: 0,
    monthlyData: {},
  };
};

// 통계 데이터 저장
export const saveSafetyStats = (stats: {
  completionRate: number;
  streak: number;
  monthlyData: { [key: string]: { [key: string]: number } };
}): void => {
  try {
    localStorage.setItem(SAFETY_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('안전 점검 통계 저장 실패:', error);
  }
};

// 완료율 계산
export const calculateCompletionRate = (data: SafetyCheckData): number => {
  if (data.totalItems === 0) return 0;
  return Math.round((data.totalChecked / data.totalItems) * 100);
};

// 카테고리별 완료 개수 계산
export const getCategoryProgress = (category: SafetyCategory): { checked: number; total: number } => {
  const checked = category.items.filter(item => item.checked).length;
  return { checked, total: category.items.length };
};
