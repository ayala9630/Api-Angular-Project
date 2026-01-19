export interface Lottery {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  totalCards?: number;
  totalSum?: number;
  isDone?: boolean;
}

export interface CreateLottery {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateLottery {
  id: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  totalCards?: number;
  totalSum?: number;
  isDone?: boolean;
}
