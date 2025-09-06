import { type UserType, USER_TYPES } from '../constants/userTypeImages';


interface Answers {
  q1_expect: string;
  q2_habit: string;
  q3_avoid: string;
  q4_feeling: string;
  q5_necessity: string;
}


type Scores = { [key in UserType]: number }; 
type AnswerPoints = { [answer: string]: Partial<Scores> }; 
type PointsConfig = Record<keyof Answers, AnswerPoints>;


const points: PointsConfig = {
  q1_expect: {
    '숨은 맛집을 발견했을 때': { [USER_TYPES.ADVENTURE]: 2 },
    '아무도 없는 풍경을 마주할 때': { [USER_TYPES.MOOD]: 2 },
    '혼자만의 커피 타임': { [USER_TYPES.MOOD]: 2 },
    '즉흥적으로 어딘가 떠날 때': { [USER_TYPES.ADVENTURE]: 2 },
  },
  q2_habit: {
    '계획을 꽉 채운다': { [USER_TYPES.ROUTE]: 2 },
    '루트만 정하고 느긋하게 움직인다': { [USER_TYPES.MOOD]: 1, [USER_TYPES.ROUTE]: 1 },
    '발 닿는 대로 간다': { [USER_TYPES.ADVENTURE]: 2 },
    '어딘가 한곳에 오래 머문다': { [USER_TYPES.MOOD]: 2 },
  },
  q3_avoid: {
    '북적거림과 시끌벅적한 분위기': { [USER_TYPES.MOOD]: 2 },
    '무계획의 불안함': { [USER_TYPES.ROUTE]: 2 },
    '혼자 있는 눈치': { [USER_TYPES.ADVENTURE]: 1 },
    '길 찾기 어려움': { [USER_TYPES.ADVENTURE]: -1 },
  },
  q4_feeling: {
    '혼자만의 시간이 편안하고 좋다': { [USER_TYPES.MOOD]: 2 },
    '괜히 두근거리고 설렌다': { [USER_TYPES.ADVENTURE]: 2 },
    '주변 시선이 가끔 불편하다': {},
    '자유롭게 움직일 수 있어 좋다': { [USER_TYPES.ADVENTURE]: 1 },
    '사진 찍거나 기록하는 걸 좋아한다': { [USER_TYPES.MEMO]: 2 },
  },
  q5_necessity: {
    '창 밖을 바라보며 멍 때릴 때': { [USER_TYPES.MOOD]: 2 },
    '낯선 골목을 걷는 순간': { [USER_TYPES.ADVENTURE]: 1, [USER_TYPES.MEMO]: 1 },
    '마음에 드는 사진을 찍을 때': { [USER_TYPES.MEMO]: 2 },
    '그날의 계획을 정리할 때': { [USER_TYPES.ROUTE]: 2 },
  },
};

export const determineUserType = (answers: Answers): UserType => {
  const scores: Scores = {
    '감성 여유형': 0,
    '탐험 모험형': 0,
    '기록 관찰형': 0,
    '루트 집중형': 0,
  };

  (Object.keys(answers) as Array<keyof Answers>).forEach((key) => {
    const answer = answers[key];
    const questionPoints = points[key];
    if (questionPoints && questionPoints[answer]) {
      const typeScores = questionPoints[answer];
      for (const type in typeScores) {
        // type guard
        if (Object.values(USER_TYPES).includes(type as UserType)) {
          scores[type as UserType] += typeScores[type as UserType]!;
        }
      }
    }
  });

  let maxScore = -Infinity;
  let finalType: UserType = USER_TYPES.MOOD; // 기본값

  for (const type in scores) {
    const userType = type as UserType;
    if (scores[userType] > maxScore) {
      maxScore = scores[userType];
      finalType = userType;
    }
  }

  return finalType;
};