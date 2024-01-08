import {
  Course,
  FilterInput,
  Product,
  ProductInput,
  SortInput,
} from 'types/graphql-types';
import createCourse from './createCourse/createCourse';
import createProduct from './createProduct/createProduct';
import getProducts from './getProducts/getProducts';

type CreateProductArgs = {
  productInput: ProductInput;
};

type GetProductsArgs = {
  filter: FilterInput | null;
  sort: SortInput | null;
  limit: number | null;
  nextToken: string | null;
};

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    course: Course;
    createProduct: CreateProductArgs;
    getProducts: GetProductsArgs;
    test: any;
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

export const course = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createCourse':
      return await createCourse(event.arguments.course);
    default:
      return null;
  }
};

export const product = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createProduct':
      return await createProduct(event.arguments.createProduct.productInput);
    case 'getProducts':
      return await getProducts(
        event.arguments.getProducts?.filter,
        event.arguments.getProducts?.sort,
        event.arguments.getProducts?.limit,
        event.arguments.getProducts?.nextToken,
      );
    default:
      return null;
  }
};
