import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Order extends TimeStamps {
  public _id?: string;

  @prop()
  public line_items?: Object;

  @prop()
  public name?: string;

  @prop()
  public email?: string;

  @prop()
  public phone?: string;

  @prop()
  public address?: string;

  @prop()
  public city?: string;

  @prop()
  public country?: string;

  @prop()
  public postalCode?: string;

  @prop()
  public paid?: boolean;
}

export const OrderModel = getModelForClass(Order);
