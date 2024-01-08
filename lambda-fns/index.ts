import {
  Course,
  FilterInput,
  Product,
  ProductInput,
  SortInput,
  UpdateProductInput,
} from 'types/graphql-types';
import createCourse from './createCourse/createCourse';
import createProduct from './createProduct/createProduct';
import getProducts from './getProducts/getProducts';
import updateProduct from './updateProduct';
import { log } from 'utils/logger';

type CreateProductArgs = {
  productInput: ProductInput;
};

type GetProductsArgs = {
  filter: FilterInput | null;
  sort: SortInput | null;
  limit: number | null;
  nextToken: string | null;
};

type UpdateProductArgs = {
  product: UpdateProductInput;
};

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    product: any;
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
  log({ message: `Check: ${JSON.stringify(event)}` });
  switch (event.info.fieldName) {
    case 'createProduct':
      return await createProduct(event.arguments.product);
    case 'getProducts':
      return await getProducts(
        event.arguments.product?.filter,
        event.arguments.product?.sort,
        event.arguments.product?.limit,
        event.arguments.product?.nextToken,
      );
    case 'updateProduct':
      return await updateProduct(event.arguments.product);
    default:
      return null;
  }
};
