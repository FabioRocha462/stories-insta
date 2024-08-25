export interface Story {
  id: number;
  title: string;
  imageUrl: string;
  text: string;
  is_visible: boolean;
  is_video?: boolean;
  list_user_visible: int[];
}
