import { OutletCategoryResponse } from "@/types-v2";

export const getOutletCategory = async (outletId: number) => {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/menu/categories?outlet_id=${outletId}&type=delivery&lang=km`;

  const response = await fetch(api);
  const data = (await response.json()) as OutletCategoryResponse;

  if (data.status === false) {
    return [];
  }

  return data.data.map((item) => ({
    id: item.id,
    nameEN: item.name,
    nameKH: item.name,
  }));
};
