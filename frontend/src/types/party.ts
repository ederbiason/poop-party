export interface Party {
    _id: string
    name: string
    createdBy: string
    members: Array<{
        userId: {
            _id: string
            name: string
            email: string
        }
        individualShits: number
    }>
    endDate: Date
    history: Array<{
        userId: string
        name: string
        shitTime: Date
    }>
    goals: Array<{
        targetShits: number
        completed: boolean
    }>
    createdAt: Date
    updatedAt: Date
}
