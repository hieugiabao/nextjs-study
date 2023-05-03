import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class PriceData {
  @prop({ default: "USD" })
  currency!: string;

  @prop({ required: true })
  product_data!: {
    name: string;
  };

  @prop({ required: true })
  unit_amount!: number;
}

export class LineItem {
  @prop({ required: true })
  quantity!: number;

  @prop()
  price_data?: PriceData;
}

export class Order extends TimeStamps {
  public _id?: string;

  @prop({ type: () => [LineItem] })
  public line_items?: LineItem[];

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
