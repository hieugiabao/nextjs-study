import { prop, getModelForClass } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { Category } from "./Category";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

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

  @prop({ ref: Category })
  public category?: Ref<Category>;

  @prop()
  public properties?: Record<string, string>;
}

export const ProductModel = getModelForClass(Product);
