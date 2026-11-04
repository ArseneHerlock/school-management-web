export interface ParentContact {
  accountId: string;
  name: string;
  phoneNumber?: string;
  children: string[];
}

export type RawRecord = Record<string, any>;
