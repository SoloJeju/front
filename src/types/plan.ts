export type Spot = {
  arrivalDate: string
  duringDate: string
  contentId: number|null
  title: string
  memo: string
}

export type DayPlan = {
  dayIndex: number
  spots: Spot[]
}

export type CreatePlanRequest = {
  title: string
  transportType: 'CAR'|'BUS'|'TRAIN'|'TAXI'| 'BICYCLE'| 'WALK'
  startDate: string
  endDate: string
  days: DayPlan[]
}

export type CreateAIPlanRequest = {
  title: string
  transportType: 'CAR'|'BUS'|'TRAIN'|'TAXI'| 'BICYCLE'| 'WALK'
  startDate: string
  endDate: string
  contentIds: number[]
}

export type PlanResponse = {
  isSuccess: boolean
  code: string
  message: string
  result: {
    title: string
    planId: number
  }
}

export type AIPlanResponse = {
  isSuccess: boolean
  code: string
  message: string
  result: {
    title: string
    transportType: 'CAR'|'BUS'|'TRAIN'|'TAXI'| 'BICYCLE'| 'WALK'
    startDate: string
    endDate: string
    days: DayPlan[]
    planId: number
  }
}

export type PlanDetailResponse = {
  isSuccess: boolean
  code: string
  message: string
  result: {
    planId: number
    title: string
    transportType: 'CAR'|'BUS'|'TRAIN'|'TAXI'| 'BICYCLE'| 'WALK'
    startDate: string
    endDate: string
    ownerNickname: string
    ownerId: number
    days: {
      dayIndex: number
      spots: {
        locationId: number
        arrivalDate: string
        duringDate: string
        memo: string
        contentId: number
        spotTitle: string
        spotAddress: string
        spotImageUrl: string
      }[]
    }[]
  }
}
