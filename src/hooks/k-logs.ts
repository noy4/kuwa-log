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
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { KLogState } from 'state'

export const useKLogs = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isLoading = isFetching || isCreating || isDeleting
  const { kLogs, setKLogs, addKLog, removeKLog } = KLogState.useContainer()

  const fetchKLogs = async () => {
    setIsFetching(true)
    const q = query(collection(db, 'kLogs'), orderBy('updatedAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const newKLogs = querySnapshot.docs.map(
      (d) =>
        ({
          ...d.data(),
          id: d.ref.path,
          createdAt: d.data().createdAt.toDate(),
          updatedAt: d.data().updatedAt.toDate(),
        } as KLog)
    )
    console.log('newKLogs:', newKLogs)
    setKLogs(newKLogs)
    setIsFetching(false)
  }

  const createKLog = async (values: KLogFormValues) => {
    try {
      setIsCreating(true)
      const dto = {
        ...values,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const docRef = await addDoc(collection(db, 'kLogs'), dto)
      addKLog({ ...dto, id: docRef.path })

      console.log('Doc: ', await getDoc(doc(db, docRef.path)))
    } catch (e) {
      console.error('Error adding document: ', e)
    }
    setIsCreating(false)
  }

  const deleteKLog = async (id: string) => {
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
    fetchKLogs()
  }, [])

  return {
    kLogs,
    isLoading,
    isFetching,
    isCreating,
    isDeleting,
    createKLog,
    deleteKLog,
  }
}