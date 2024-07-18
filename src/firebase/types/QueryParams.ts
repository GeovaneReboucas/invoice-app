import type { OrderBy } from "./OrderBy";
import type { SearchBy } from "./SearchBy";

export type QueryParams = {
  id?: string;
  searchBy?: SearchBy;
  orderBy?: OrderBy;
}