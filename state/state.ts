import { Doc, KLog } from '@/@types'
import { useState } from 'react'
import { createContainer } from 'unstated-next'

type KLogTree = {
  kLogs: KLog[]
  [key: string]: (Record<string, any> & Doc)[]
}

export const KLogState = createContainer(() => {
  const [kLogTree, setKLogTree] = useState<KLogTree>({ kLogs: [] })
  console.log('kLogTree:', kLogTree)

  const setKLogsByKey = (key: string, newKLogs: KLog[]) => {
    setKLogTree((prev) => ({ ...prev, [key]: newKLogs }))
  }

  const setKLogs = (newKLogs: KLog[]) => {
    setKLogsByKey('kLogs', newKLogs)
  }

  const addKLog = (data: KLog) => {
    const tagTree = data.tags.reduce((tree, tag) => {
      return { ...tree, [tag]: [data, ...kLogTree[tag]] }
    }, Object.create(null))
    const fn = (prev: KLogTree) => {
      const newKLogTree: KLogTree = {
        ...prev,
        kLogs: [data, ...prev.kLogs],
        ...tagTree,
      }
      return newKLogTree
    }
    setKLogTree(fn)
  }

  const removeKLog = (id: string) => {
    const newKLogTree = Object.keys(kLogTree).reduce((tree, key) => {
      return { ...tree, [key]: kLogTree[key].filter((v) => v.id !== id) }
    }, Object.create(null))
    setKLogTree(newKLogTree)
  }

  return {
    kLogs: kLogTree.kLogs,
    kLogTree,
    setKLogsByKey,
    setKLogs,
    addKLog,
    removeKLog,
  }
})
