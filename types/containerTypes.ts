export type containerType = {
  id: string;
  userId: string;
  title: string;
  slug: string;
  isPrivate: boolean;
  resumeUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface MonthlyStats extends Record<string, unknown> {
  month: string;
  views: number;
  downloads: number;
}
