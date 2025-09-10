import { create } from 'zustand';

interface RoomFormData {
  title: string;
  description: string;
  contentId: number | null;
  spotName: string;
  maxMembers: number;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedGender: 'MIXED' | 'MALE' | 'FEMALE';
}

interface CreateRoomStore {
  formData: RoomFormData;
  setFormData: (data: Partial<RoomFormData>) => void;
  resetForm: () => void;
}

export const useCreateRoomStore = create<CreateRoomStore>((set) => ({
  formData: {
    title: '',
    description: '',
    contentId: null,
    spotName: '',
    maxMembers: 2,
    selectedDate: null,
    selectedTime: null,
    selectedGender: 'MIXED',
  },
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () =>
    set({
      formData: {
        title: '',
        description: '',
        contentId: null,
        spotName: '',
        maxMembers: 2,
        selectedDate: null,
        selectedTime: null,
        selectedGender: 'MIXED',
      },
    }),
}));
