import { KLog, KLogFormValues } from '@/@types'
import { useFirestore, useKLogs } from '@/hooks'
import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Spacer,
  Spinner,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useForm } from 'react-hook-form'

export const KLogCard = () => {
  // const { data, isLoading, create, del } = useFirestore<KLog>('kLogs')
  const {
    kLogs: data,
    createKLog: create,
    isLoading,
    deleteKLog: del,
  } = useKLogs()

  const formMethods = useForm<KLogFormValues>()
  const { handleSubmit, register, reset } = formMethods
  const onSubmit = handleSubmit((values) => {
    create({ ...values })
    reset()
  })

  return (
    <Flex direction='column' h='full'>
      <Flex align='center' mt='8' mb='4'>
        <Heading>くわログ</Heading>
        <Spacer />
        {isLoading && <Spinner />}
      </Flex>
      <form onSubmit={onSubmit}>
        <Input {...register('title')} mb='4' isRequired />
      </form>
      <Box overflowY='auto' flex='1'>
        {data.map((d, i) => (
          <div key={i}>
            <Flex my='2' py='2' align='end' role='group'>
              <Box>{d.title}</Box>
              <Spacer />
              <Box fontSize='xs' ml='auto'>
                {formatDistanceToNowStrict(d.updatedAt, {
                  locale: ja,
                })}
              </Box>
              <IconButton
                aria-label='削除'
                display='none'
                variant='ghost'
                rounded='full'
                size='xs'
                ml='2'
                _groupHover={{ display: 'block' }}
                icon={<CloseIcon />}
                onClick={() => del(d.id)}
              />
            </Flex>
          </div>
        ))}
      </Box>
    </Flex>
  )
}
