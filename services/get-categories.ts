import { CategoryResponse } from "@/types";

const transfrom = (category: CategoryResponse) => {
  return category.data.map((data) => {
    return {
      nameEn: data.name_en,
      nameKH: data.name,
      image: data.image,
      id: data.id,
      status: data.status === 1 ? true : false,
    };
  });
};

export const getCategories = async () => {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    "/api/web/giaodoan/hierarchical-categories?level=2";

  const res = await fetch(api);

  const category = await res.json();

  return transfrom(category as CategoryResponse);

  return transfrom(category as CategoryResponse);
};
