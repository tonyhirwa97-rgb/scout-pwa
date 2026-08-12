import {
  Smartphone,
  ShoppingBag,
  Shirt,
  Sparkle,
  UtensilsCrossed,
  Sofa,
  BookOpen,
  Cable,
  MoreHorizontal,
} from "lucide-react";

export const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: Smartphone },
  { id: "groceries", label: "Groceries", icon: ShoppingBag },
  { id: "clothes", label: "Clothes", icon: Shirt },
  { id: "beauty", label: "Beauty", icon: Sparkle },
  { id: "kitchen", label: "Kitchen Items", icon: UtensilsCrossed },
  { id: "furniture", label: "Furniture", icon: Sofa },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "phone-accessories", label: "Phone Accessories", icon: Cable },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

export const TOTAL_STEPS = 2;

export const emptyForm = {
  categories: [],
  want: "",
  name: "",
  phone: "",
  area: "",
};
