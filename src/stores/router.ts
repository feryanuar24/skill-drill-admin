import { push, replace, link, location } from "./routerCompat";

export { push, replace, link, location };
export const navigate = (path: string) => {
  const target = path.startsWith("/") ? path : `/${path}`;
  push(target);
};
