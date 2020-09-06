export interface Note {
  title: string;
  description: string;
  isCheckList: boolean;
  checkList: CheckListItem[];
  id?: string;
}

export interface CheckListItem {
  checked: boolean;
  description: string;
}
