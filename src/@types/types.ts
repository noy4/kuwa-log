export type Doc = {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type KLogFormValues = {
  title: string
}
export type TaggedKLogFormValues = KLogFormValues & {
  tag: string
}
export type KLog = Doc &
  KLogFormValues & {
    tags: string[]
  }

export type TagFormValues = {
  title: string
}
export type Tag = Doc & TagFormValues
