import { str2duration } from "./DurationUtils"

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

export const checkSame = <T extends object>(V: T, emptyV: T, except?: string[]) => {
  return Object.keys(V).every(key => {
    if (except?.includes(key)) return true
    return V[key as keyof T] == emptyV[key as keyof T];
  });
}

export const changeTime = <T,>(
  v: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<T>>,
  onChanged?: () => any
) => {
  const inputEl = v.currentTarget
  const curpos = inputEl.selectionStart || 0
  const time = str2duration(v.currentTarget.value)
  
  if (time != null) {
    changeField(time, "duration", setter)
    if (onChanged)
      onChanged()
  }

  setTimeout(() => {
    inputEl.setSelectionRange(curpos, curpos)
  }, 0)
}
