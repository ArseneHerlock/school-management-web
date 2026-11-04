export interface AlbumItem {
  id: string;
  url: string;
  title: string;
  cleanNote?: string;
  date: string;
  monthKey: string; // YYYY-MM
  type: 'image' | 'video';
  category: string;
  scope: 'class' | 'child';
  childId?: string;
  childName?: string;
  activityId?: string;
  activityTitle?: string;
  createdBy?: string;
}
