import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Party extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) 
  createdBy: Types.ObjectId

  @Prop({ 
    type: [{ 
      userId: { type: Types.ObjectId, ref: 'User' }, 
      individualShits: { type: Number, default: 0 } 
    }],
    _id: false 
  }) 
  members: { userId: Types.ObjectId; individualShits: number }[]

  @Prop()
  endDate: Date

  @Prop([{ userId: { type: Types.ObjectId, ref: 'User' }, shitTime: Date }]) 
  history: { userId: Types.ObjectId; shitTime: Date }[]

  @Prop([{
    targetShits: { type: Number, required: true },
    completed: { type: Boolean, default: false },
  }]) 
  goals: { _id: Types.ObjectId; targetShits: number; completed: boolean }[]

  @Prop({ default: false })
  partyEnded: boolean
}

export const PartySchema = SchemaFactory.createForClass(Party)
