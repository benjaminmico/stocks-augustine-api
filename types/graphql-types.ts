export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSJSON: { input: any; output: any; }
};

export type Category = {
  __typename?: 'Category';
  categoryId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  restaurantId: Scalars['ID']['output'];
};

export type File = {
  __typename?: 'File';
  url: Scalars['String']['output'];
};

export type FilterInput = {
  attributeName: Scalars['String']['input'];
  attributeValue: Scalars['String']['input'];
};

export type MenuItem = {
  __typename?: 'MenuItem';
  menuItemId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipe: Array<Maybe<RecipeItem>>;
  restaurantId: Scalars['ID']['output'];
  type: MenuItemType;
};

export type MenuItemInput = {
  name: Scalars['String']['input'];
  type: MenuItemType;
};

export enum MenuItemType {
  Appetizer = 'APPETIZER',
  Dessert = 'DESSERT',
  Main = 'MAIN'
}

export type Mutation = {
  __typename?: 'Mutation';
  addRecipeItem?: Maybe<MenuItem>;
  createMenuItem?: Maybe<MenuItem>;
  createProduct?: Maybe<Product>;
  createRestaurant?: Maybe<Restaurant>;
  createSupplier?: Maybe<Supplier>;
  deleteMenuItem?: Maybe<Scalars['ID']['output']>;
  deleteProduct?: Maybe<Scalars['ID']['output']>;
  deleteRecipeItem?: Maybe<Scalars['ID']['output']>;
  deleteRestaurant?: Maybe<Scalars['ID']['output']>;
  deleteSupplier?: Maybe<Scalars['ID']['output']>;
  scanInvoice: File;
  updateProduct?: Maybe<Product>;
  updateRestaurant?: Maybe<Restaurant>;
  updateSupplier?: Maybe<Supplier>;
};


export type MutationAddRecipeItemArgs = {
  menuItemId: Scalars['ID']['input'];
  recipeItem?: InputMaybe<RecipeItemInput>;
};


export type MutationCreateMenuItemArgs = {
  menuItem: MenuItemInput;
};


export type MutationCreateProductArgs = {
  product: ProductInput;
};


export type MutationCreateRestaurantArgs = {
  restaurant: RestaurantInput;
};


export type MutationCreateSupplierArgs = {
  supplier: SupplierInput;
};


export type MutationDeleteMenuItemArgs = {
  menuItemId: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationDeleteRecipeItemArgs = {
  recipeItemId: Scalars['ID']['input'];
};


export type MutationDeleteRestaurantArgs = {
  restaurantId: Scalars['ID']['input'];
};


export type MutationDeleteSupplierArgs = {
  supplierId: Scalars['ID']['input'];
};


export type MutationScanInvoiceArgs = {
  file: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  product: UpdateProductInput;
};


export type MutationUpdateRestaurantArgs = {
  restaurant: UpdateRestaurantInput;
};


export type MutationUpdateSupplierArgs = {
  supplier: UpdateSupplierInput;
};

export type Order = {
  __typename?: 'Order';
  deliveryDate?: Maybe<Scalars['String']['output']>;
  orderDate?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['ID']['output'];
  orderedQuantity?: Maybe<Scalars['Int']['output']>;
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
};

export type Product = {
  __typename?: 'Product';
  name: Scalars['String']['output'];
  packageWeight?: Maybe<Scalars['Float']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  productId: Scalars['ID']['output'];
  restaurantId: Scalars['ID']['output'];
  saleFormat?: Maybe<SaleFormat>;
  supplier?: Maybe<Supplier>;
  supplierId: Scalars['ID']['output'];
  unitOfMeasure?: Maybe<UnitOfMeasure>;
};

export type ProductInput = {
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  restaurantId: Scalars['ID']['input'];
  saleFormat: SaleFormat;
  supplierId?: InputMaybe<Scalars['ID']['input']>;
  unit: Scalars['Float']['input'];
  unitOfMeasure: UnitOfMeasure;
};

export type Query = {
  __typename?: 'Query';
  getCategories?: Maybe<Array<Maybe<Category>>>;
  getMenuItem?: Maybe<MenuItem>;
  getMenuItems?: Maybe<Array<Maybe<MenuItem>>>;
  getOrders?: Maybe<Array<Maybe<Order>>>;
  getProducts?: Maybe<Array<Maybe<Product>>>;
  getRestaurants?: Maybe<Array<Maybe<Restaurant>>>;
  getSales?: Maybe<Array<Maybe<Sale>>>;
  getSalesAnalysis?: Maybe<Array<Maybe<SalesAnalysis>>>;
  getStocks?: Maybe<Array<Maybe<Stock>>>;
  getSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  getSuppliers?: Maybe<Array<Maybe<Supplier>>>;
  getUploadUrl: Scalars['AWSJSON']['output'];
};


export type QueryGetCategoriesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetMenuItemArgs = {
  menuItemId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetMenuItemsArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetOrdersArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetProductsArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetRestaurantsArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetSalesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetSalesAnalysisArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetStocksArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetSubcategoriesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetSuppliersArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryGetUploadUrlArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type RecipeItem = {
  __typename?: 'RecipeItem';
  category?: Maybe<Category>;
  menuItemId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  product?: Maybe<Product>;
  recipeItemId: Scalars['ID']['output'];
  restaurantId: Scalars['ID']['output'];
  subcategory?: Maybe<Subcategory>;
  unitOfMeasure?: Maybe<UnitOfMeasure>;
  usedQuantity?: Maybe<Scalars['Float']['output']>;
};

export type RecipeItemInput = {
  category?: InputMaybe<Category>;
  name: Scalars['String']['input'];
  product?: InputMaybe<Product>;
  subcategory?: InputMaybe<Subcategory>;
  unitOfMeasure?: InputMaybe<UnitOfMeasure>;
  usedQuantity?: InputMaybe<Scalars['Float']['input']>;
};

export type Restaurant = {
  __typename?: 'Restaurant';
  name: Scalars['String']['output'];
  restaurantId: Scalars['ID']['output'];
};

export type RestaurantInput = {
  name: Scalars['String']['input'];
};

export type Sale = {
  __typename?: 'Sale';
  menuId: Scalars['ID']['output'];
  quantitySold?: Maybe<Scalars['Int']['output']>;
  restaurantId: Scalars['ID']['output'];
  saleDate?: Maybe<Scalars['String']['output']>;
  saleId: Scalars['ID']['output'];
};

export enum SaleFormat {
  Individual = 'Individual',
  Package = 'Package'
}

export type SalesAnalysis = {
  __typename?: 'SalesAnalysis';
  analysisId: Scalars['ID']['output'];
  lossPercentage?: Maybe<Scalars['Float']['output']>;
  margin?: Maybe<Scalars['Float']['output']>;
  restaurantId: Scalars['ID']['output'];
  sale?: Maybe<Sale>;
  saleId: Scalars['ID']['output'];
  salePrice?: Maybe<Scalars['Float']['output']>;
  saleTrend?: Maybe<Scalars['String']['output']>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SortInput = {
  attributeName: Scalars['String']['input'];
  direction: SortDirection;
};

export type Stock = {
  __typename?: 'Stock';
  alertThreshold?: Maybe<Scalars['Int']['output']>;
  availableQuantity?: Maybe<Scalars['Int']['output']>;
  lastUpdateDate?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  restaurantId: Scalars['ID']['output'];
  stockId: Scalars['ID']['output'];
};

export type Subcategory = {
  __typename?: 'Subcategory';
  category?: Maybe<Category>;
  categoryId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  restaurantId: Scalars['ID']['output'];
  subcategoryId: Scalars['ID']['output'];
};

export type Supplier = {
  __typename?: 'Supplier';
  name: Scalars['String']['output'];
  supplierId: Scalars['ID']['output'];
};

export type SupplierInput = {
  name: Scalars['String']['input'];
};

export enum UnitOfMeasure {
  Kilogram = 'Kilogram',
  Liter = 'Liter',
  Unit = 'Unit'
}

export type UpdateProductInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['ID']['input'];
  saleFormat?: InputMaybe<SaleFormat>;
  supplierId?: InputMaybe<Scalars['ID']['input']>;
  unit?: InputMaybe<Scalars['Float']['input']>;
  unitOfMeasure?: InputMaybe<UnitOfMeasure>;
};

export type UpdateRestaurantInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  restaurantId: Scalars['ID']['input'];
};

export type UpdateSupplierInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  supplierId: Scalars['ID']['input'];
};
