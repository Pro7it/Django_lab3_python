export const changeField = <T, V>(value: T, field: string, setter: React.Dispatch<React.SetStateAction<V>>) => setter(d => {
  if (d) {
    const dn = {
      ...d,
      [field]: value
    }
    return dn
  }
  return d
})

export const checkAllFilled = <T extends object>(V: T, emptyV: T, except?: string[]) => {
  return Object.keys(V).every(key => {
    if (except?.includes(key)) return true
    return V[key as keyof T] !== emptyV[key as keyof T];
  });
}
