import { KLog, KLogFormValues } from '@/@types'
import { kLogsRef, transform } from '@/lib/db'
import {
  Box,
  CloseButton,
  Flex,
  Heading,
  Input,
  Spacer,
  Spinner,
  Tag as ChakraTag,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { ja } from 'date-fns/locale'
import { addDoc, deleteDoc, orderBy, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'

export const KLogCard = () => {
  const [kLogs = [], loading] = useCollectionData<KLog>(
    query(kLogsRef, orderBy('updatedAt', 'desc')) as any,
    {
      idField: 'id',
      refField: 'ref',
      transform,
    }
  )
  const { handleSubmit, register, reset } = useForm<KLogFormValues>()
  const onSubmit = handleSubmit(async (values) => {
    const dto = {
      ...values,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await addDoc(kLogsRef, dto)
    reset()
  })

  return (
    <Flex direction='column' h='full'>
      <Flex align='center' mt='8' mb='4'>
        <Heading>くわログ</Heading>
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
