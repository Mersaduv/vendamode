import type { ICategory } from '@/types';

export interface ICategoryForm {
  id?: string;
  name: string;
  isActive: boolean;
  thumbnail?: FileList;
  mainCategoryId?: string;
  parentCategoryId?: string;
  level: number;
}

export type ILoginForm = {
  mobileNumber: string;
  password: string;
}

export type IRegisterForm = {
  mobileNumber: string;
  password: string;
}