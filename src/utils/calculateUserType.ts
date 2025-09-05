interface Answers {
  q1_expect: string; q2_habit: string; q3_avoid: string; q4_feeling: string; q5_necessity: string;
}

// 타입 정의
type Scores = { [key: string]: number };
type AnswerPoints = { [answer: string]: Scores };
type PointsConfig = Record<keyof Answers, AnswerPoints>;


// 타입 명시한 점수표
const points: PointsConfig = {
  q1_expect: {
    '숨은 맛집을 발견했을 때': { '무난': 1, '설렘': 1 },
    '아무도 없는 풍경을 마주할 때': { '힐링': 2 },
    '혼자만의 커피 타임': { '힐링': 2 },
    '즉흥적으로 어딘가 떠날 때': { '자유': 2 },
  },
  q2_habit: {
    '계획을 꽉 채운다': { '무난': 1 },
    '루트만 정하고 느긋하게 움직인다': { '힐링': 1, '무난': 1 },
    '발 닿는 대로 간다': { '자유': 2 },
    '어딘가 한곳에 오래 머문다': { '힐링': 2 },
  },
  q3_avoid: {
    '북적거림과 시끌벅적한 분위기': { '힐링': 2 },
    '무계획의 불안함': { '무난': -1, '자유': -2 },
    '혼자 있는 눈치': { '외로움': 2 },
    '길 찾기 어려움': { '자유': -1 },
  },
  q4_feeling: {
    '혼자만의 시간이 편안하고 좋다': { '힐링': 2 },
    '괜히 두근거리고 설렌다': { '설렘': 2 },
    '주변 시선이 가끔 불편하다': { '외로움': 2 },
    '자유롭게 움직일 수 있어 좋다': { '자유': 2 },
    '사진 찍거나 기록하는 걸 좋아한다': { '설렘': 2 },
  },
  q5_necessity: {
    '창 밖을 바라보며 멍 때릴 때': { '힐링': 2 },
    '낯선 골목을 걷는 순간': { '자유': 1, '설렘': 1 },
    '마음에 드는 사진을 찍을 때': { '설렘': 2 },
    '그날의 계획을 정리할 때': { '무난': 1 },
  },
};

export const calculateUserType = (answers: Answers): string => {
  const scores: Scores = { '힐링': 0, '설렘': 0, '자유': 0, '외로움': 0, '무난': 0 };

  (Object.keys(answers) as Array<keyof Answers>).forEach((key) => {
    const answer = answers[key];
    const questionPoints = points[key]; 
    if (questionPoints && questionPoints[answer]) {
      const typeScores = questionPoints[answer];
      for (const type in typeScores) {
        scores[type] += typeScores[type as keyof typeof typeScores];
      }
    }
  });

  let maxScore = -Infinity;
  let finalType = '무난';

  for (const type in scores) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      finalType = type;
    }
  }

  return finalType;
};