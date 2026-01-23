import { Prop } from '@nestjs/mongoose';

export class StandardFields {
  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;

  @Prop({ type: Boolean, default: false })
  isVoid?: boolean;

  @Prop({ type: String })
  createBy?: string;

  @Prop({ type: String })
  updateBy?: string;
}
