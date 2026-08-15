export type WeightEntryType = {
  _id: string;
  weightValue: number;
  weighInDate: string;
  userId: string;
};

export type GoalOption = "Loss" | "Maintenance" | "Gain";

export type GoalWeightEntryType = {
  _id: string;
  weightValue: number;
  goalType: "Loss" | "Maintenance" | "Gain";
  userId: string;
};

export type UserAccount = {
  _id: string;
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

export type CachedObj<CacheType> = {
  expirationTime: number;
  cacheData: CacheType;
};

export type DBCollection =
  | "USER_ACCOUNT"
  | "WEIGHT_ENTRY"
  | "GOAL_WEIGHT_ENTRY";

export type ApiEndpointResponse = {
  message: string;
  userAccountData?: string;
  goalWeightEntry?: GoalWeightEntryType;
  weightEntries?: WeightEntryType[];
  weightEntry?: WeightEntryType;
};

export type ApiEndPointDebugTests = {
  connectionTest: string;
  accountCreation: string;
  accountLogin: string;
  goalWeightCreation: string;
  goalWeightRetrieval: string;
  goalWeightUpdate: string;
  weightEntryCreation: string;
  weightEntriesRetrieval: string;
  weightEntryRetrieval: string;
  weightEntryUpdate: string;
  weightEntryRemoval: string;
  accountCleanUp: string;
  goalWeightEntryCleanUp: string;
};
