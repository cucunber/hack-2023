export const getMediaUrl = (url: string) => {
  return `${process.env.REACT_APP_BASE_STATIC}${url}`;
};
