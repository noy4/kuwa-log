import { KLogFormValues } from '@/@types'
import { useKLogs } from '@/hooks'
import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Spacer,
  Spinner,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'

const Home: NextPage = () => {
  const { kLogs, isLoading, createKLog, deleteKLog } = useKLogs()

  const formMethods = useForm<KLogFormValues>()
  const { handleSubmit, register, reset } = formMethods
  const onSubmit = handleSubmit((values) => {
    createKLog(values)
    reset()
  })

  return (
    <Container maxW='sm'>
      <Flex align='center' mt='8' mb='4'>
        <Heading>くわログ</Heading>
        <Spacer />
        {isLoading && <Spinner />}
      </Flex>
      <form onSubmit={onSubmit}>
        <Input {...register('title')} mb='4' isRequired />
      </form>
      {kLogs.map((kLog, i) => (
        <div key={i}>
          <Flex my='2' py='2' align='end' role='group'>
            <Box>{kLog.title}</Box>
            <Spacer />
            <Box fontSize='xs' ml='auto'>
              {formatDistanceToNowStrict(kLog.date, { locale: ja })}
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
              onClick={() => deleteKLog(kLog.id)}
            />
          </Flex>
        </div>
      ))}
    </Container>
  )
}

export default Home
