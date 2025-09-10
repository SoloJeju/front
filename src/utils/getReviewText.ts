interface getReveiwTextProps {
  easy: number;
  normal: number;
  hard: number;
}

export function getReveiwText({
  easy,
  normal,
  hard,
}: getReveiwTextProps): string[] | string {
  if (easy >= 70) {
    return ['대부분이 Easy를 골랐어요!', '혼자가기 부담 없는 곳이에요 😌'];
  } else if (normal >= 70) {
    return [
      '대부분이 Normal을 택했어요!',
      '혼자 가도 적당히 즐길 수 있어요 🙂',
    ];
  } else if (hard >= 70) {
    return [
      '압도적으로 Hard가 선택됐어요!',
      '혼자 도전하면 특별한 경험이 될 거예요 💪',
    ];
  }

  if (easy >= 50) {
    return ['절반 이상이 Easy를 선택했네요!', '가볍게 즐기기 좋아요.'];
  } else if (normal >= 50) {
    return [
      '절반 이상이 Normal을 선택했네요!',
      '무난하면서도 살짝 도전적이에요.',
    ];
  } else if (hard >= 50) {
    return [
      '절반 이상이 Hard를 택했네요!',
      '혼자 하기 쉽진 않지만 성취감 있어요.',
    ];
  }

  return '';
}
