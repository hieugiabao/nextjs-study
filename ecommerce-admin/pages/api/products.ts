import { mongooseConnect } from "@admin/lib/mongoose";
import { ProductModel } from "@admin/models/Product";
import { NextApiRequest, NextApiResponse } from "next";
import { isAdminRequest } from "@admin/pages/api/auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  switch (method) {
    case "GET":
      if (req.query?.id) {
        res.json(await ProductModel.findOne({ _id: req.query.id }));
      } else {
        res.json(await ProductModel.find());
      }
      break;
    case "POST":
      const { title, description, price, images, category, properties } =
        req.body;
      const productDoc = await ProductModel.create({
        title,
        description,
        price,
        images,
        category,
        properties,
      });
      res.json(productDoc);
      break;
    case "PUT":
      const { _id } = req.body;
      const result = await ProductModel.updateOne({ _id }, { ...req.body });
      res.json(true);
      break;
    case "DELETE":
      if (req.query?.id) {
        await ProductModel.deleteOne({ _id: req.query?.id });
        res.json(true);
      }
  }
}
