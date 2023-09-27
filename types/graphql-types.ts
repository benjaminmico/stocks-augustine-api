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
  deleteCourse?: Maybe<Scalars['ID']['output']>;
  updateCourse?: Maybe<Course>;
};


export type MutationCreateCourseArgs = {
  course: CourseInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCourseArgs = {
  course: UpdateCourseInput;
};

export enum Price {
  Free = 'Free',
  Paid = 'Paid'
}

export type Query = {
  __typename?: 'Query';
  listCourses?: Maybe<CourseConnection>;
};


export type QueryListCoursesArgs = {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SortInput>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SortInput = {
  attributeName: Scalars['String']['input'];
  direction: SortDirection;
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateCourse?: Maybe<Course>;
  onDeleteCourse?: Maybe<Scalars['ID']['output']>;
  onUpdateCourse?: Maybe<Course>;
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
