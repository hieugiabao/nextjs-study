import { mongooseConnect } from "@admin/lib/mongoose";
import { OrderModel } from "@admin/models/Order";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await mongooseConnect();

  res.json(await OrderModel.find().sort({ createdAt: -1 }));
}
