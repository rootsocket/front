export const normalizeString = (chars: string) =>
  chars.normalize('NFD').replace(/[U0300-U036F]/g, '')
