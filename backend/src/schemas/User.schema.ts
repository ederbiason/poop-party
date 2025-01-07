import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Types } from 'mongoose'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: false })
  name: string

  @Prop({ required: false, default: 0 })
  partyWins: number

  @Prop({ required: false, default: "" })
  profileImage: string

  @Prop({ type: [{ type: Types.ObjectId }], ref: 'Party' })
  parties: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
