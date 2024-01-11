import createCourse from './createCourse/createCourse';
import createProduct from './product/createProduct/createProduct';
import deleteProduct from './product/deleteProduct/deleteProduct';
import getProducts from './product/getProducts/getProducts';
import updateProduct from './product/updateProduct/updateProduct';
import createSupplier from './supplier/createSupplier/createSupplier';
import getSuppliers from './supplier/getSuppliers/getSuppliers';
import updateSupplier from './supplier/updateSupplier/updateSupplier';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: any;
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
    case 'getProducts':
      return await getProducts(
        event.arguments.product?.filter,
        event.arguments.product?.sort,
        event.arguments.product?.limit,
        event.arguments.product?.nextToken,
      );
    case 'updateProduct':
      return await updateProduct(event.arguments.product);
    case 'deleteProduct':
      return await deleteProduct(event.arguments?.productId);
    default:
      return null;
  }
};
export const supplier = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createSupplier':
      return await createSupplier(event.arguments.supplier);
    case 'getSuppliers':
      return await getSuppliers(
        event.arguments.supplier?.filter,
        event.arguments.supplier?.sort,
        event.arguments.supplier?.limit,
        event.arguments.supplier?.nextToken,
      );
    case 'updateSupplier':
      return await updateSupplier(event.arguments.supplier);
    case 'deleteSupplier':
      return await updateSupplier(event.arguments?.supplierId);
    default:
      return null;
  }
};
