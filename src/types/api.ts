export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ApiErrorResponse {
  error: string;
}

export interface ApiOkResponse {
  ok: true;
}
