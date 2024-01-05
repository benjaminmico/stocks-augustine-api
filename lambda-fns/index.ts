import { Course, Product } from 'types/graphql-types';
import createCourse from './createCourse';
import createProduct from './createProduct';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    course: Course;
    product: Product;
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
      return await createProduct(event.arguments.product);
    default:
      return null;
  }
};
