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
};

export type Category = {
  __typename?: 'Category';
  categoryId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Course = {
  __typename?: 'Course';
  age: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  level: Level;
  prerequisites?: Maybe<Array<Scalars['String']['output']>>;
  price: Price;
  subjects: Array<Scalars['String']['output']>;
  syllabus: Array<Syllabus>;
  time: Scalars['String']['output'];
  type: Type;
};

export type CourseConnection = {
  __typename?: 'CourseConnection';
  items: Array<Course>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type CourseInput = {
  age: Scalars['Int']['input'];
  level: Level;
  prerequisites?: InputMaybe<Array<Scalars['String']['input']>>;
  price: Price;
  subjects: Array<Scalars['String']['input']>;
  syllabus: Array<SyllabusInput>;
  time: Scalars['String']['input'];
  type: Type;
};

export type FilterInput = {
  attributeName: Scalars['String']['input'];
  attributeValue: Scalars['String']['input'];
};

export enum Level {
  Advanced = 'Advanced',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate'
}

export type Menu = {
  __typename?: 'Menu';
  category?: Maybe<Category>;
  categoryId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  menuId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
};

export type MenuItem = {
  __typename?: 'MenuItem';
  menu?: Maybe<Menu>;
  menuId: Scalars['ID']['output'];
  menuItemId: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  unitOfMeasure?: Maybe<UnitOfMeasure>;
  usedQuantity?: Maybe<Scalars['Float']['output']>;
};

export type Module = {
  __typename?: 'Module';
  content: Scalars['String']['output'];
  type: ModuleType;
};

export type ModuleInput = {
  content: Scalars['String']['input'];
  type: ModuleType;
};

export enum ModuleType {
  Lesson = 'Lesson',
  Project = 'Project',
  Quiz = 'Quiz'
}

export type Mutation = {
  __typename?: 'Mutation';
  createCourse?: Maybe<Course>;
  createProduct?: Maybe<Product>;
  deleteCourse?: Maybe<Scalars['ID']['output']>;
  deleteProduct?: Maybe<Scalars['ID']['output']>;
  updateCourse?: Maybe<Course>;
  updateProduct?: Maybe<Product>;
};


export type MutationCreateCourseArgs = {
  course: CourseInput;
};


export type MutationCreateProductArgs = {
  product: ProductInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationUpdateCourseArgs = {
  course: UpdateCourseInput;
};


export type MutationUpdateProductArgs = {
  product: UpdateProductInput;
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

export enum Price {
  Free = 'Free',
  Paid = 'Paid'
}

export type Product = {
  __typename?: 'Product';
  name: Scalars['String']['output'];
  nicknames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  packageWeight?: Maybe<Scalars['Float']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  productId: Scalars['ID']['output'];
  saleFormat?: Maybe<SaleFormat>;
  supplier?: Maybe<Supplier>;
  supplierId: Scalars['ID']['output'];
  unitOfMeasure?: Maybe<UnitOfMeasure>;
};

export type ProductInput = {
  name: Scalars['String']['input'];
  nicknames?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  price?: InputMaybe<Scalars['Float']['input']>;
  saleFormat?: InputMaybe<SaleFormat>;
  supplierId: Scalars['ID']['input'];
  unit?: InputMaybe<Scalars['Float']['input']>;
  unitOfMeasure?: InputMaybe<UnitOfMeasure>;
};

export type Query = {
  __typename?: 'Query';
  listCategories?: Maybe<Array<Maybe<Category>>>;
  listCourses?: Maybe<CourseConnection>;
  listMenuItems?: Maybe<Array<Maybe<MenuItem>>>;
  listMenus?: Maybe<Array<Maybe<Menu>>>;
  listOrders?: Maybe<Array<Maybe<Order>>>;
  listProducts?: Maybe<Array<Maybe<Product>>>;
  listSales?: Maybe<Array<Maybe<Sale>>>;
  listSalesAnalysis?: Maybe<Array<Maybe<SalesAnalysis>>>;
  listStocks?: Maybe<Array<Maybe<Stock>>>;
  listSubcategories?: Maybe<Array<Maybe<Subcategory>>>;
  listSuppliers?: Maybe<Array<Maybe<Supplier>>>;
};


export type QueryListCategoriesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListCoursesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListMenuItemsArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListMenusArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListOrdersArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListProductsArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListSalesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListSalesAnalysisArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListStocksArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListSubcategoriesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};


export type QueryListSuppliersArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};

export type Sale = {
  __typename?: 'Sale';
  menu?: Maybe<Menu>;
  menuId: Scalars['ID']['output'];
  quantitySold?: Maybe<Scalars['Int']['output']>;
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
  stockId: Scalars['ID']['output'];
};

export type Subcategory = {
  __typename?: 'Subcategory';
  category?: Maybe<Category>;
  categoryId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  subcategoryId: Scalars['ID']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateCourse?: Maybe<Course>;
  onDeleteCourse?: Maybe<Scalars['ID']['output']>;
  onUpdateCourse?: Maybe<Course>;
};

export type Supplier = {
  __typename?: 'Supplier';
  name: Scalars['String']['output'];
  supplierId: Scalars['ID']['output'];
};

export type Syllabus = {
  __typename?: 'Syllabus';
  description: Scalars['String']['output'];
  module: Module;
  title: Scalars['String']['output'];
};

export type SyllabusInput = {
  description: Scalars['String']['input'];
  module: ModuleInput;
  title: Scalars['String']['input'];
};

export enum Type {
  Career = 'Career',
  Skill = 'Skill'
}

export enum UnitOfMeasure {
  Kilogram = 'Kilogram',
  Liter = 'Liter',
  Unit = 'Unit'
}

export type UpdateCourseInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  level?: InputMaybe<Level>;
  prerequisites?: InputMaybe<Array<Scalars['String']['input']>>;
  price?: InputMaybe<Price>;
  subjects?: InputMaybe<Array<Scalars['String']['input']>>;
  syllabus?: InputMaybe<Array<SyllabusInput>>;
  time?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Type>;
};

export type UpdateProductInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  nicknames?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  price?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['ID']['input'];
  saleFormat?: InputMaybe<SaleFormat>;
  supplierId?: InputMaybe<Scalars['ID']['input']>;
  unit?: InputMaybe<Scalars['Float']['input']>;
  unitOfMeasure?: InputMaybe<UnitOfMeasure>;
};
