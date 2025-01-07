export interface Party {
    _id: string
    name: string
    createdBy: string
    members: Array<{
        userId: {
            _id: string
            name: string
            email: string
            profileImage: string
        }
        individualShits: number
    }>
    endDate: Date
    history: Array<{
        _id: string
        userId: {
            _id: string
            name: string
            email: string
            profileImage: string
        }
        shitTime: Date
    }>
    goals: Array<{
        _id: string
        targetShits: number
        completed: boolean
    }>
    createdAt: Date
    updatedAt: Date
}
