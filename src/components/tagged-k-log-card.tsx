import { KLog, KLogFormValues, Tag } from '@/@types'
import { kLogsRef, tagsRef, transform } from '@/lib/db'
import {
  Box,
  CloseButton,
  Flex,
  Input,
  Spacer,
  Spinner,
  Tag as ChakraTag,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { ja } from 'date-fns/locale'
import { addDoc, deleteDoc, orderBy, query, where } from 'firebase/firestore'
import { useEffect, VFC } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import { Select } from './select'

type Props = {
  storageKey: string
}
export const TaggedKLogCard: VFC<Props> = ({ storageKey }) => {
  const {
    register: tagRegister,
    watch,
    reset: resetTag,
  } = useForm<{ tag: string }>({
    defaultValues: { tag: '' },
  })
  const { handleSubmit, register, reset } = useForm<KLogFormValues>()
  const tag = watch('tag')

  const [kLogs = [], loading] = useCollectionData<KLog>(
    query(
      kLogsRef,
      where('tags', 'array-contains', tag),
      orderBy('updatedAt', 'desc')
    ) as any,
    {
      refField: 'ref',
      transform,
    }
  )

  const [tags = []] = useCollectionData<Tag>(
    query(tagsRef, orderBy('updatedAt', 'desc')) as any,
    {
      refField: 'ref',
      transform,
    }
  )
  const tagOptions = tags.map((t) => ({ value: t.title, text: t.title }))

  const onSubmit = handleSubmit(async (values) => {
    const dto = {
      ...values,
      tags: [tag],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await addDoc(kLogsRef, dto)
    reset()
  })

  useEffect(() => {
    const newTag = localStorage[storageKey] || tags[0]?.title || ''
    resetTag({ tag: newTag })
  }, [tags])

  useEffect(() => {
    if (!tag) return
    localStorage.setItem(storageKey, tag)
  }, [tag])

  return (
    <Flex direction='column' h='full'>
      <Flex align='center' mt='8' mb='4'>
        <Select {...tagRegister('tag')} options={tagOptions} w='40' />
        <Spacer />
        {loading && <Spinner />}
      </Flex>
      <form onSubmit={onSubmit}>
        <Input {...register('title')} mb='4' isRequired />
      </form>
      <Box overflowY='auto' flex='1'>
        {kLogs.map((kLog, i) => (
          <Flex key={i} my='2' py='2' align='center' role='group' wrap='wrap'>
            <Box>{kLog.title}</Box>
            <Spacer />
            {kLog.tags.map((tag, i) => (
              <ChakraTag
                key={i}
                variant='solid'
                fontSize='xx-small'
                size='sm'
                mx='1'
              >
                {tag}
              </ChakraTag>
            ))}
            <Box fontSize='xs' ml='auto'>
              {formatDistanceToNowStrict(kLog.updatedAt, {
                locale: ja,
              })}
            </Box>
            <CloseButton
              display='none'
              rounded='full'
              w='6'
              h='6'
              ml='2'
              _groupHover={{ display: 'block' }}
              onClick={() => deleteDoc(kLog.ref)}
            />
          </Flex>
        ))}
      </Box>
    </Flex>
  )
}
