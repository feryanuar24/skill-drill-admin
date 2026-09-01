import { push, replace, link, location, querystring, params } from "svelte-spa-router";

export { push, replace, link, location, querystring, params };
export const navigate = (path: string) => {
  const target = path.startsWith("/") ? path : `/${path}`;
  push(target);
};
