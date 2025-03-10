export const imageConfig = {
  development: {
    baseUrl: "/pictures", // Both point to public/pictures
  },
  production: {
    baseUrl: "/wallpapers/pictures",
  },
};

export const getImagePath = (filename: string) => {
  const config = import.meta.env.DEV
    ? imageConfig.development
    : imageConfig.production;
  return `${config.baseUrl}/${filename}`;
};
