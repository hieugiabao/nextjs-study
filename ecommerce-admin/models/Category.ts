import { getModelForClass, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
export class Category {
  @prop({ required: true })
  public _id?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ ref: Category })
  public parent?: Ref<Category>;

  @prop({ type: () => [Object] })
  public properties?: Object[];
}

export const CategoryModel = getModelForClass(Category);
