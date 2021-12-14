export type KLog = {
  id: string
  title: string
  date: Date
}

export type KLogFormValues = Pick<KLog, 'title'>
