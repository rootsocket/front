// @ts-ignore
export const sortObjectByValue = (
  obj: any,
  comparator: (a: any, b: any) => number
) => {
  return Object.entries(obj)
    .sort(comparator)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
}
