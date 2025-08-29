export const filteredCategory = (
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
