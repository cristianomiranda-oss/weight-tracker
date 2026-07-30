export type WeightEntryType = {
  weightEntryId: string;
  weightValue: number;
  weighInDate: string;
  userId: string;
};

export type GoalOption = "Loss" | "Maintenance" | "Gain";

export type GoalWeightEntryType = {
  goalWeightEntryId: string;
  weightValue: number;
  goalType: "Loss" | "Maintenance" | "Gain";
  userId: string;
};

export type UserAccount = {
  userId: string;
  userName: string;
  userPassword: string;
};

export type UserPayloadObj = {
  userId: string;
  userName: string;
};

export type DataBaseStore =
  | "USER_ACCOUNT"
  | "WEIGHT_ENTRY"
  | "GOAL_WEIGHT_ENTRY";

export type DataBaseIndex = "USER_NAME" | "WEIGHT_ENTRY_ID" | "USER_ID";

export type DataBaseAccessType = "readwrite" | "readonly";

export type sortOrder = "ASC" | "DESC";

export type sortingKey = "weightValue" | "weighInDate";

export type sortOptions = {
  sortOrder: sortOrder;
  sortingKey: "weightValue" | "weighInDate";
};

export type CachedObj = {
  expirationTime: number;
  weightEntryArray: WeightEntryType[];
};
