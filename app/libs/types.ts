export type WeightEntryType = {
  WeightEntryId: number;
  weightValue: number;
  weightDate: Date;
  userId: number;
};

export type GoalOption = "Loss" | "Maintenance" | "Gain";

export type GoalWeightEntryType = {
  goalWeightEntryId: number;
  weightValue: number;
  goalType: "Loss" | "Maintenance" | "Gain";
  userId: number;
};

export type UserAccount = {
  userId: number;
  userName: string;
  userPassword: string;
}

export type DataBaseStore =
  | "USER_ACCOUNT"
  | "WEIGHT_ENTRY"
  | "GOAL_WEIGHT_ENTRY";

export type DataBaseIndex = "USER_NAME" | "WEIGHT_ENTRY_ID" | "USER_ID";

export type DataBaseAccessType = "readwrite" | "readonly";
