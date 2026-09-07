/**
 * Centralized UUID generation utility.
 * Uses native crypto.randomUUID() — always produces a valid v4 UUID.
 * Do NOT call this during render; call it only during user-initiated actions.
 */
export function generateId(): string {
  return crypto.randomUUID();
}
