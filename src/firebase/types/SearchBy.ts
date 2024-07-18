import type { WhereFilterOp } from "firebase/firestore";

export type SearchBy = {
  field: string;
  condicion: WhereFilterOp;
  value: string | number | boolean;
};