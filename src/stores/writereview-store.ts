import { create } from 'zustand';

interface WriteReviewStore {
  contentId?: number;
  spotName?: string;
  contentTypeId?: number;
  setFormData: (data: { contentId: number; spotName: string; contentTypeId: number }) => void;
  resetFormData: () => void;
}

export const useWriteReviewStore = create<WriteReviewStore>((set) => ({
  contentId: undefined,
  spotName: undefined,
  contentTypeId: undefined,
  setFormData: (data) =>
    set({
      contentId: data.contentId,
      spotName: data.spotName,
      contentTypeId: data.contentTypeId,
    }),
  resetFormData: () =>
    set({
      contentId: undefined,
      spotName: undefined,
      contentTypeId: undefined,
    }),
}));
