export type WeightEntryType = {
    WeightEntryId: number
    weightValue: number
    weightDate: Date
    userId: number
}

export type GoalOption = "Loss" | "Maintenance" | "Gain";

export type GoalWeightEntryType = {
    GoalWeightEntryId: number
    weightValue: number
    goalType: "Loss" | "Maintenance" | "Gain"
    userId: number
}
