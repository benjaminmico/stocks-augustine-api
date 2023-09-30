import { Course } from 'types/graphql-types';
import createCourse from './createCourse';

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    course: Course;
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
