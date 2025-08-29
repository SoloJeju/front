export interface SafetyCheckItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface SafetyCategory {
  id: string;
  name: string;
  icon: string;
  items: SafetyCheckItem[];
}

export interface SafetyCheckData {
  date: string;
  categories: SafetyCategory[];
  totalChecked: number;
  totalItems: number;
}

export interface SafetyStats {
  completionRate: number;
  streak: number;
  monthlyData: { [date: string]: number };
}
