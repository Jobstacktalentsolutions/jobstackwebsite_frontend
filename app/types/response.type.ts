export type ResponseDto<T> = {
  success: boolean;
  data: T;
  message?: string;
};
