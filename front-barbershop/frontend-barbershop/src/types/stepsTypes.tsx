export type Option = {
  label: string
  next: string
}

export type Node = {
  id: string
  message: string
  options?: Option[]
  input?: 'text' | 'date'
  next?: string // para inputs
}