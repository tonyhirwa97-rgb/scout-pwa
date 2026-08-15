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

// Real, specific launch date - per the charter, real numbers/dates
// build trust far better than vague "soon" language. Update this in
// one place if the date ever changes.
export const LAUNCH_DATE_ISO = "2026-10-10";
export const LAUNCH_DATE_LABEL = "October 10, 2026";

export const emptyForm = {
  categories: [],
  want: "",
  name: "",
  phone: "",
  area: "",
};
