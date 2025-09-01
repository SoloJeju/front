export const filterCategoryKoToEn = (
  category: string
): 'QUESTION' | 'COMPANION_PROPOSAL' | 'SOLO_TIP' | undefined => {
  switch (category) {
    case '궁금해요':
      return 'QUESTION';
    case '동행제안':
      return 'COMPANION_PROPOSAL';
    case '혼행꿀팁':
      return 'SOLO_TIP';
    default:
      return undefined;
  }
};

export const filterCategoryEntoKo = (
  category: string
): '궁금해요' | '동행제안' | '혼행꿀팁' | undefined => {
  switch (category) {
    case 'QUESTION':
      return '궁금해요';
    case 'COMPANION_PROPOSAL':
      return '동행제안';
    case 'SOLO_TIP':
      return '혼행꿀팁';
    default:
      return undefined;
  }
};
