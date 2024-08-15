export interface Item {
  id: string;
  content: string;
  details?: string;
  combinedItems?: Item[];
}