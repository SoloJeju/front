import { create } from 'zustand';
import dayjs from 'dayjs';
import type { PlanDetailResponse } from '../types/plan';

type Place = {
  contentId: number;
  spotName: string;
  spotAddress?: string;
  spotImageUrl?: string | null;
  dayIndex?: number;
};

type SpotDetail = PlanDetailResponse['result']['days'][0]['spots'][0];

export type DayPlan = {
  dayIndex: number;
  date: string;
  spots: { contentId: number; spotName: string }[];
};

type PlanStore = {
  isEditing: boolean;
  plan: PlanDetailResponse['result'] | null;
  selectedPlaces: Place[];
  title: string;
  dateRange: { start: string | null; end: string | null };
  selectedTransport: 'WALK' | 'CAR' | 'BUS' | 'TAXI' | 'TRAIN' | 'BICYCLE' | null;
  planType: 'ai' | 'manual' | null;
  dayPlans: DayPlan[];
  
  setIsEditing: (isEditing: boolean) => void;
  setPlan: (planData: PlanDetailResponse['result']) => void;
  setTitle: (title: string) => void;
  setDateRange: (range: { start: string | null; end: string | null }) => void;
  setSelectedTransport: (transport: 'WALK' | 'CAR' | 'BUS' | 'TAXI' | 'TRAIN' | 'BICYCLE' | null) => void;
  setPlanType: (type: 'ai' | 'manual' | null) => void;
  setDayPlans: (plans: DayPlan[] | ((prevState: DayPlan[]) => DayPlan[])) => void;
  
  updateSpot: (dayIndex: number, locationId: number, newSpotData: SpotDetail) => void;
  updateSpotTime: (dayIndex: number, locationId: number, newTimes: { arrivalDate: string; duringDate: string }) => void;
  updateSpotMemo: (dayIndex: number, locationId: number, memo: string) => void;
  addSpotToDay: (dayIndex: number, spotData: SpotDetail) => void;
  deleteSpot: (dayIndex: number, locationId: number) => void;

  addPlace: (place: Place) => void;
  removePlace: (contentId: number) => void;
  removeSpotFromDay: (dayIndex: number, contentId: number) => void;
  resetPlan: () => void;
  updateDateRange: (range: { startDate: string; endDate: string }) => void;
};

const initialState = {
  plan: null,
  selectedPlaces: [],
  title: '',
  dateRange: { start: null, end: null },
  selectedTransport: null,
  planType: null,
  dayPlans: [],
  isEditing: false,
};

export const usePlanStore = create<PlanStore>((set) => ({
  ...initialState,
  setIsEditing: (isEditing) => set({ isEditing }),
  
  setPlan: (planData) => set({ plan: planData }),
  setTitle: (title) => set((state) => ({
    title,
    plan: state.plan ? { ...state.plan, title } : null,
  })),
  setDateRange: (dateRange) => set({ dateRange }),
  setSelectedTransport: (selectedTransport) => set({ selectedTransport }),
  setPlanType: (planType) => set({ planType }),
  setDayPlans: (plans) => set((state) => ({ 
    dayPlans: typeof plans === 'function' ? plans(state.dayPlans) : plans 
  })),

  addPlace: (place) => set((state) => ({ selectedPlaces: [...state.selectedPlaces, place] })),
  removePlace: (contentId) =>
    set((state) => ({
      selectedPlaces: state.selectedPlaces.filter((p) => p.contentId !== contentId),
    })),
  removeSpotFromDay: (dayIndex, contentId) =>
    set((state) => ({
      dayPlans: state.dayPlans.map((day) =>
        day.dayIndex === dayIndex ? { ...day, spots: day.spots.filter((spot) => spot.contentId !== contentId) } : day
      ),
    })),
  resetPlan: () => set(initialState),
  
  updateDateRange: ({ startDate, endDate }) =>
    set((state) => {
      if (!state.plan) return {};

      const oldStartDate = dayjs(state.plan.startDate);
      const newStartDate = dayjs(startDate);
      const dayDiff = newStartDate.diff(oldStartDate, 'day');

      const newTotalDays = dayjs(endDate).diff(newStartDate, 'day') + 1;
      const oldDaysMap = new Map(state.plan.days.map((day) => [day.dayIndex, day]));
      const newDays = [];

      for (let i = 1; i <= newTotalDays; i++) {
        const oldDayData = oldDaysMap.get(i);
        if (oldDayData) {
          const updatedSpots = oldDayData.spots.map((spot) => {
            const newArrivalDate = dayjs(spot.arrivalDate).add(dayDiff, 'day').format('YYYY-MM-DDTHH:mm:ss');
            const newDuringDate = dayjs(spot.duringDate).add(dayDiff, 'day').format('YYYY-MM-DDTHH:mm:ss');
            return { ...spot, arrivalDate: newArrivalDate, duringDate: newDuringDate };
          });
          newDays.push({ ...oldDayData, dayIndex: i, spots: updatedSpots });
        } else {
          newDays.push({ dayIndex: i, spots: [] });
        }
      }

      return {
        plan: {
          ...state.plan,
          startDate,
          endDate,
          days: newDays,
        },
      };
    }),
  
  updateSpot: (dayIndex, locationId, newSpotData) =>
    set((state) => {
      if (!state.plan) return {};
      const updatedDays = state.plan.days.map((day) => {
        if (day.dayIndex === dayIndex) {
          const updatedSpots = day.spots.map((spot) => (spot.locationId === locationId ? newSpotData : spot));
          updatedSpots.sort((a, b) => dayjs(a.arrivalDate).valueOf() - dayjs(b.arrivalDate).valueOf());
          return { ...day, spots: updatedSpots };
        }
        return day;
      });
      return { plan: { ...state.plan, days: updatedDays } };
    }),
  
  updateSpotTime: (dayIndex, locationId, newTimes) =>
    set((state) => {
      if (!state.plan) return {};
      const updatedDays = state.plan.days.map((day) => {
        if (day.dayIndex === dayIndex) {
          const updatedSpots = day.spots.map((spot) =>
            spot.locationId === locationId ? { ...spot, ...newTimes } : spot
          );
          updatedSpots.sort((a, b) => dayjs(a.arrivalDate).valueOf() - dayjs(b.arrivalDate).valueOf());
          return { ...day, spots: updatedSpots };
        }
        return day;
      });
      return { plan: { ...state.plan, days: updatedDays } };
    }),
  
  updateSpotMemo: (dayIndex, locationId, memo) =>
    set((state) =>
      state.plan ? { plan: { ...state.plan, days: state.plan.days.map((day) =>
        day.dayIndex === dayIndex ? { ...day, spots: day.spots.map((spot) => (spot.locationId === locationId ? { ...spot, memo } : spot)) } : day
      )}} : {}
    ),
  
  addSpotToDay: (dayIndex, spotData) =>
    set((state) => {
      if (!state.plan) return state;
      
      const dayExists = state.plan.days.some((day) => day.dayIndex === dayIndex);
      let updatedDays;

      if (dayExists) {
        updatedDays = state.plan.days.map((day) => {
          if (day.dayIndex === dayIndex) {
            const newSpots = [...day.spots, spotData];
            newSpots.sort((a, b) => dayjs(a.arrivalDate).valueOf() - dayjs(b.arrivalDate).valueOf());
            return { ...day, spots: newSpots };
          }
          return day;
        });
      } else {
        const newDay = { dayIndex, spots: [spotData] };
        updatedDays = [...state.plan.days, newDay].sort((a, b) => a.dayIndex - b.dayIndex);
      }
      
      return {
        plan: {
          ...state.plan,
          days: updatedDays,
        },
      };
    }),
  
  deleteSpot: (dayIndex, locationId) =>
    set((state) =>
      state.plan ? { plan: { ...state.plan, days: state.plan.days.map((day) =>
        day.dayIndex === dayIndex ? { ...day, spots: day.spots.filter((spot) => spot.locationId !== locationId) } : day
      )}} : {} 
    ),
}));