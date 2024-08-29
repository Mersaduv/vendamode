import { ServiceResponse } from "@/types";
import instance from "../axiosConfig";
import { IHeaderText } from "@/types/IHeaderText.type";

export const getHeaderText = async (): Promise<ServiceResponse<IHeaderText> | null> => {
  try {
    const response = await instance.get('/api/design/headerText');
    return response.data;
  } catch (error) {
    return null;
  }
}
