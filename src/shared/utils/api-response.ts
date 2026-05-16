type ApiResponse<T = unknown> = {
  success: boolean;

  message: string;

  data?: T;

  error?: unknown;
};

export const successResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (
  message: string,
  error?: unknown
): ApiResponse => {
  return {
    success: false,
    message,
    error,
  };
};