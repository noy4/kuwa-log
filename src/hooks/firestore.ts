import { Doc } from '@/@types'
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
  QueryConstraint,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useFirestore = <TData extends Doc>(
  path: string,
  queryConstraints: QueryConstraint[] = [],
  dependencies: any[] = []
) => {
  type FormValues = Omit<TData, keyof Doc>
  const [data, setData] = useState<TData[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isLoading = isFetching || isCreating || isDeleting

  const fetchData = async () => {
    console.log('11:', 11)
    setIsFetching(true)
    const q = query(
      collection(db, path),
      orderBy('updatedAt', 'desc'),
      ...queryConstraints
    )
    const querySnapshot = await getDocs(q)

    const newData = querySnapshot.docs.map(
      (d) =>
        ({
          ...d.data(),
          id: d.ref.path,
          createdAt: d.data().createdAt.toDate(),
          updatedAt: d.data().updatedAt.toDate(),
        } as TData)
    )
    setData(newData)
    setIsFetching(false)
  }

  const create = async (values: FormValues) => {
    try {
      setIsCreating(true)
      const dto = {
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Omit<TData, 'id'>
      const docRef = await addDoc(collection(db, path), dto)
      setData((prev) => [{ ...dto, id: docRef.path } as TData, ...prev])

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
      setData((prev) => prev.filter((k) => k.id !== id))
    } catch (e) {
      console.error('削除失敗')
    }
    setIsDeleting(false)
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    data,
    isLoading,
    isFetching,
    isCreating,
    isDeleting,
    create,
    del,
  }
}
