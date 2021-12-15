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
import { VFC } from 'react'
import { useFormContext } from 'react-hook-form'

type Props = {
  title: string
  isLoading: boolean
  onSubmit: () => void
  data: any[]
  del: (id: string) => void
}

export const FireCard: VFC<Props> = ({
  title,
  isLoading,
  onSubmit,
  data,
  del,
}) => {
  const { register } = useFormContext()

  return (
    <Flex direction='column' h='full'>
      <Flex align='center' mt='8' mb='4'>
        <Heading>{title}</Heading>
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
                {formatDistanceToNowStrict(d.updatedAt, { locale: ja })}
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
