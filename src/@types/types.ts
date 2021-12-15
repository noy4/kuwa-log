import { DocumentReference } from 'firebase/firestore'

export type Doc = {
  ref: DocumentReference
  createdAt: Date
  updatedAt: Date
}

export type KLog = Doc & {
  title: string
  tags: string[]
}
export type KLogFormValues = Pick<KLog, 'title'>
export type Tag = Doc & { title: string }
export type TagFormValues = Pick<Tag, 'title'>
