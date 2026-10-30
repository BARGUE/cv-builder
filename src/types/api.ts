/** Code permettant au client de réagir à une erreur sans comparer de message traduit. */
export type ActionErrorCode = "UNAUTHORIZED";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: ActionErrorCode };
