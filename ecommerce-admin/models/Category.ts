import { getModelForClass, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { Property } from "./Property";
export class Category {
  public _id?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ ref: Category })
  public parent?: Ref<Category>;

  @prop()
  public properties?: Property[];
}

export const CategoryModel = getModelForClass(Category);
