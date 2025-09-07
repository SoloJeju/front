import {authAxios} from './axios'
import type { CreatePlanRequest, CreateAIPlanRequest, PlanResponse, AIPlanResponse, PlanDetailResponse } from '../types/plan'

export const createPlan = async (data: CreatePlanRequest) => {
  const res = await authAxios.post<PlanResponse>('/api/plans', data);
  return res.data;
}

export const createAIPlan = async (data: CreateAIPlanRequest) => {
  const res = await authAxios.post<AIPlanResponse>('/api/plans/ai', data, {
      timeout: 60000, 
    });
  return res.data;
}

export const getPlanDetail = async (planId: number) => {
  const res = await authAxios.get<PlanDetailResponse>(`/api/plans/${planId}`);
  return res.data;
}

export const updatePlan = async (planId: number, data: CreatePlanRequest) => {
  const res = await authAxios.patch(`/api/plans/${planId}`, data);
  return res.data;
};