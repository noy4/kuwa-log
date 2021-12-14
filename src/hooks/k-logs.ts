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

export const useKLogs = () => {
  const [kLogs, setKLogs] = useState<KLog[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isLoading = isFetching || isCreating || isDeleting

  const fetchKLogs = async () => {
    setIsFetching(true)
    const q = query(collection(db, 'kLogs'), orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)

    const newKLogs = querySnapshot.docs.map(
      (d) =>
        ({
          ...d.data(),
          id: d.ref.path,
          date: d.data().date.toDate(),
        } as KLog)
    )
    setKLogs(newKLogs)
    setIsFetching(false)
  }

  const createKLog = async (values: KLogFormValues) => {
    try {
      setIsCreating(true)
      const dto = {
        ...values,
        date: new Date(),
      }
      const docRef = await addDoc(collection(db, 'kLogs'), dto)
      setKLogs((prev) => [{ ...dto, id: docRef.path }, ...prev])

      console.log('Doc: ', getDoc(doc(db, docRef.path)))
    } catch (e) {
      console.error('Error adding document: ', e)
    }
    setIsCreating(false)
  }

  const deleteKLog = async (id: string) => {
    try {
      setIsDeleting(true)
      await deleteDoc(doc(db, id))
      setKLogs((prev) => prev.filter((k) => k.id !== id))
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
