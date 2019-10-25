import { helper } from '@ember/component/helper';

/*
  Convert an ISO8601 Date String (which may contain fractional seconds)
  to a human-readable Date string in the user's locale.
 */
export function formatDate([proxy]) {
  let date = new Date(proxy.content);
  return date.toLocaleString();
}

export default helper(formatDate);
