import React from "react";

import OrderDetailsPage from "./_component/order-page";

export async function generateStaticParams() {
  return [];
}

export default function page() {
  return <OrderDetailsPage />;
}
