import Layout from "@admin/components/Layout";
import axios from "axios";
import { Fetcher } from "swr";
import { Order } from "@admin/models/Order";
import useSWR from "swr";
import { ScaleLoader } from "react-spinners";

export default function OrdersPage() {
  const ordersFetcher: Fetcher<Order[], string> = (url) =>
    axios.get(url).then((res) => res.data);

  const {
    data: orders,
    isLoading,
    error,
  } = useSWR("/api/orders", ordersFetcher, {
    fallbackData: [],
  });
  console.log(orders);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <ScaleLoader color="#1E3A8A" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return <Layout>Error: {error}</Layout>;
  }

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt || "").toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city}, {order.country}
                  <br />
                  {order.address}
                </td>
                <td>
                  {order.line_items?.map((l) => (
                    <>
                      {l.price_data?.product_data.name} x{l.quantity}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
