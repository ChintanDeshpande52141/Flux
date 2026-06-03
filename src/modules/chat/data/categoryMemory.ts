export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Others";

export interface CategoryMemory {
  [key: string]: Category;
}

/**
 * Initial category memory with common merchants and categories
 * This will be extended with learned mappings over time
 */
export const initialCategoryMemory: CategoryMemory = {
  // Food
  swiggy: "Food",
  zomato: "Food",
  burger: "Food",
  burgers: "Food",
  pizza: "Food",
  dominos: "Food",
  mcdonalds: "Food",
  kfc: "Food",
  subway: "Food",
  starbucks: "Food",
  cafe: "Food",
  coffee: "Food",
  tea: "Food",
  lunch: "Food",
  dinner: "Food",
  breakfast: "Food",
  restaurant: "Food",
  food: "Food",
  groceries: "Food",

  // Transport
  uber: "Transport",
  ola: "Transport",
  petrol: "Transport",
  diesel: "Transport",
  gas: "Transport",
  fuel: "Transport",
  metro: "Transport",
  train: "Transport",
  bus: "Transport",
  auto: "Transport",
  rickshaw: "Transport",
  taxi: "Transport",
  cab: "Transport",
  parking: "Transport",
  toll: "Transport",

  // Shopping
  amazon: "Shopping",
  flipkart: "Shopping",
  westside: "Shopping",
  shoppers: "Shopping",
  lifestyle: "Shopping",
  reliance: "Shopping",
  "big bazaar": "Shopping",
  dmart: "Shopping",
  more: "Shopping",
  spencer: "Shopping",
  mall: "Shopping",
  clothes: "Shopping",
  shoes: "Shopping",
  electronics: "Shopping",
  mobile: "Shopping",
  laptop: "Shopping",
  gadgets: "Shopping",

  // Entertainment
  netflix: "Entertainment",
  spotify: "Entertainment",
  "amazon prime": "Entertainment",
  hotstar: "Entertainment",
  youtube: "Entertainment",
  movies: "Entertainment",
  movie: "Entertainment",
  cinema: "Entertainment",
  theatre: "Entertainment",
  concert: "Entertainment",
  show: "Entertainment",
  game: "Entertainment",
  gaming: "Entertainment",
  pub: "Entertainment",
  bar: "Entertainment",
  club: "Entertainment",

  // Common variations and misspellings
  swigy: "Food",
  zomto: "Food",
  amazn: "Shopping",
  flpkr: "Shopping",
  ubr: "Transport",
  olaa: "Transport",
  netflixs: "Entertainment",
  spotifi: "Entertainment",
};
