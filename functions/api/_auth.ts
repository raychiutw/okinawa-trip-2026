/**
 * Shared authorization helper for API write handlers.
 */

/**
 * Returns true if the authenticated user has permission to write to the given trip.
 * Admins and service tokens always have permission. Regular users must have an entry
 * in the permissions table matching their email and the trip id (or a wildcard '*').
 */
export async function hasPermission(
  db: D1Database,
  email: string,
  tripId: string,
  isAdmin: boolean,
): Promise<boolean> {
  if (isAdmin) return true;
  const row = await db
    .prepare('SELECT 1 FROM permissions WHERE email = ? AND (trip_id = ? OR trip_id = ?)')
    .bind(email.toLowerCase(), tripId, '*')
    .first();
  return !!row;
}
