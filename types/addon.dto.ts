export interface AddonItem {
  id: number;
  status: number;
  price: number;
  name: string;
  name_vi: string;
  name_th: string;
  minimum_purchase: number;
  maximum_purchase: number;
  addon_category_id: number;
  master_addon_id: number;
}

export interface AddonCategory {
  id: number;
  name: string;
  required: number; // 1 for required, 0 for optional
  maximum_purchase: number;
  minimum_purchase: number;
  items: AddonItem[];
}

export interface SelectedAddon {
  categoryId: number;
  itemId: number;
  name: string;
  price: number;
}

export interface MenuAddonData {
  addon_categories: AddonCategory[];
}
