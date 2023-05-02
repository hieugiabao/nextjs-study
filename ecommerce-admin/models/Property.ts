import { prop } from "@typegoose/typegoose";

export class Property {
  @prop()
  name!: string;

  @prop({ type: () => [String] })
  values!: string[];
}
