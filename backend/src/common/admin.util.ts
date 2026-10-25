export function resolveRole(email: string): 'ADMIN' | 'USER' {
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase()) ? 'ADMIN' : 'USER'
}