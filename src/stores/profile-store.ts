// 역할: 모든 프로필 정보(이름, 닉네임, 질문 답변 등)를 저장하고 관리하는 중앙 데이터 창고 (Zustand 스토어).

import { create } from 'zustand';

export interface ProfileState {
  // 기본 정보
  name: string;
  nickname: string;
  gender: '남자' | '여자' | '';
  birthdate: string;
  
  // 여행 성향 질문 답변
  q1_expect: string;
  q2_habit: string;
  q3_avoid: string;
  q4_feeling: string;
  q5_necessity: string;

  // 액션 함수들
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setGender: (gender: '남자' | '여자') => void;
  setBirthdate: (birthdate: string) => void;
  setQ1: (answer: string) => void;
  setQ2: (answer: string) => void;
  setQ3: (answer: string) => void;
  setQ4: (answer: string) => void;
  setQ5: (answer: string) => void;
  reset: () => void;
}

type ProfileData = Omit<ProfileState, 'setName' | 'setNickname' | 'setGender' | 'setBirthdate' | 'setQ1' | 'setQ2' | 'setQ3' | 'setQ4' | 'setQ5' | 'reset'>;

const initialState: ProfileData = {
  name: '',
  nickname: '',
  gender: '',
  birthdate: '',
  q1_expect: '',
  q2_habit: '',
  q3_avoid: '',
  q4_feeling: '',
  q5_necessity: '',
};

export const useProfileStore = create<ProfileState>((set) => ({
  ...initialState,
  setName: (name) => set({ name }),
  setNickname: (nickname) => set({ nickname }),
  setGender: (gender) => set({ gender }),
  setBirthdate: (birthdate) => set({ birthdate }),
  setQ1: (answer) => set({ q1_expect: answer }),
  setQ2: (answer) => set({ q2_habit: answer }),
  setQ3: (answer) => set({ q3_avoid: answer }),
  setQ4: (answer) => set({ q4_feeling: answer }),
  setQ5: (answer) => set({ q5_necessity: answer }),
  reset: () => set(initialState),
}));
