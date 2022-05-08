export enum RoomStatus {
  OPEN = 'OPEN',
  CLOSED_MANUALLY = 'CLOSED_MANUALLY',
  CLOSED_AUTOMATICALLY = 'CLOSED_AUTOMATICALLY',
}

export interface Room {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  closedAt: Date | null;
  status: RoomStatus;
}
