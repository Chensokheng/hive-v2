import { OutletCategoryResponse } from "@/types-v2";

export const getOutletCategory = async (outletId: number) => {
  const response = await fetch(
    `https://api-truemoney-stg.savyu.com/api/web/menu/categories?outlet_id=${outletId}&type=delivery&lang=km`
  );
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
