import type { OrderByDirection } from "firebase/firestore";

export type OrderBy = {
  field: string;
  direction: OrderByDirection;
};