import createCourse from './createCourse/createCourse';
import createProduct from './product/createProduct/createProduct';
import deleteProduct from './product/deleteProduct/deleteProduct';
import getProducts from './product/getProducts/getProducts';
import getUploadUrl from './product/getUploadUrl/getUploadUrl';
import scanInvoice from './product/scanInvoice/scanInvoice';
import updateProduct from './product/updateProduct/updateProduct';
import createRestaurant from './restaurant/createRestaurant/createRestaurant';
import deleteRestaurant from './restaurant/deleteRestaurant/deleteRestaurant';
import getRestaurants from './restaurant/getRestaurants/getRestaurants';
import updateRestaurant from './restaurant/updateRestaurant/updateRestaurant';
import createSupplier from './supplier/createSupplier/createSupplier';
import deleteSupplier from './supplier/deleteSupplier/deleteSupplier';
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
  console.log('Username', event.identity.username);
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
    case 'scanInvoice':
      return await scanInvoice(event.arguments?.file);
    case 'getUploadUrl':
      return await getUploadUrl(event.identity.username);
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
      return await deleteSupplier(event.arguments?.supplierId);
    default:
      return null;
  }
};

export const restaurant = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createRestaurant':
      return await createRestaurant(event.arguments.restaurant);
    case 'getRestaurants':
      return await getRestaurants(
        event.arguments.restaurant?.filter,
        event.arguments.restaurant?.sort,
        event.arguments.restaurant?.limit,
        event.arguments.restaurant?.nextToken,
      );
    case 'updateRestaurant':
      return await updateRestaurant(event.arguments.restaurant);
    case 'deleteRestaurant':
      return await deleteRestaurant(event.arguments?.restaurantId);
    default:
      return null;
  }
};
