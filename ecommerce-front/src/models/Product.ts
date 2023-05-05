import { prop, getModelForClass } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import mongoose from "mongoose";

export class Product extends TimeStamps {
  public _id?: string;

  @prop({ required: true })
  public title!: string;

  @prop()
  public description?: string;

  @prop({ require: true })
  public price!: number;

  @prop({ type: () => [String] })
  public images?: string[];

  @prop()
  public category?: mongoose.Types.ObjectId;

  @prop()
  public properties?: Record<string, string>;
}

export const ProductModel = getModelForClass(Product);
