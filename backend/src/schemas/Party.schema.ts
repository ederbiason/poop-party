import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Party extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) // Criador da party
  createdBy: Types.ObjectId

  @Prop({ 
    type: [{ 
      userId: { type: Types.ObjectId, ref: 'User' }, 
      totalShits: { type: Number, default: 0 } 
    }] 
  }) // Lista de participantes com o total de cagadas de cada um
  members: { userId: Types.ObjectId; individualShits: number }[]

  @Prop()
  endDate: Date

  @Prop([{ userId: { type: Types.ObjectId, ref: 'User' }, shitTime: Date }]) // Histórico de cagadas como linha do tempo
  history: { userId: Types.ObjectId; shitTime: Date }[]

  @Prop([{ 
    targetShits: { type: Number, required: true },
    completed: { type: Boolean, default: false } 
  }]) // Metas da party
  goals: { targetShits: number; completed: boolean }[];
}

export const PartySchema = SchemaFactory.createForClass(Party)
