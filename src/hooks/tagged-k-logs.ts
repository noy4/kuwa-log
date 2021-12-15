import { KLog, KLogFormValues } from '@/@types'
import { db } from '@/lib/db'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { KLogState } from 'state'

export const useTaggedKLogs = (tag: string) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isLoading = isFetching || isCreating || isDeleting
  const { kLogTree, setKLogsByKey, addKLog, removeKLog } =
    KLogState.useContainer()

  const fetchData = async () => {
    console.log('11:', 11)
    setIsFetching(true)
    const q = query(
      collection(db, 'kLogs'),
      orderBy('updatedAt', 'desc'),
      where('tags', 'array-contains', tag ?? '')
    )
    const querySnapshot = await getDocs(q)

    const newData = querySnapshot.docs.map(
      (d) =>
        ({
          ...d.data(),
          id: d.ref.path,
          createdAt: d.data().createdAt.toDate(),
          updatedAt: d.data().updatedAt.toDate(),
        } as KLog)
    )
    setKLogsByKey(tag, newData)
    setIsFetching(false)
  }

  const create = async (values: KLogFormValues) => {
    try {
      setIsCreating(true)
      const dto = {
        ...values,
        tags: [tag],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const docRef = await addDoc(collection(db, 'kLogs'), dto)
      addKLog({ ...dto, id: docRef.path })

      console.log('Doc: ', (await getDoc(doc(db, docRef.path))).data())
    } catch (e) {
      console.error('Error adding document: ', e)
    }
    setIsCreating(false)
  }

  const del = async (id: string) => {
    try {
      setIsDeleting(true)
      await deleteDoc(doc(db, id))
      removeKLog(id)
    } catch (e) {
      console.error('削除失敗')
    }
    setIsDeleting(false)
  }

  useEffect(() => {
    fetchData()
  }, [tag])

  return {
    data: kLogTree[tag],
    isLoading,
    isFetching,
    isCreating,
    isDeleting,
    create,
    del,
  }
}
