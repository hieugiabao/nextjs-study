import { mongooseConnect } from "@ft/lib/mongoose";
import { ProductModel } from "@ft/models/Product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await mongooseConnect();
  const ids = req.body.ids;
  res.json(await ProductModel.find({ _id: ids }));
}
