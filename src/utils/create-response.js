
export const createResponse = (status, message, code, data = null) => {
  const response = { status, message, code };
  if (data) response.data = data;
  return response;
};
