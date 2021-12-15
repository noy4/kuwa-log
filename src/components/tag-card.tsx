import { Tag, TagFormValues } from '@/@types'
import { useFirestore } from '@/hooks'
import { CloseIcon } from '@chakra-ui/icons'
import {
  Flex,
  Heading,
  Spacer,
  Spinner,
  Input,
  Box,
  IconButton,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useForm } from 'react-hook-form'

export const TagCard = () => {
  const {
    data: tags,
    isLoading,
    create: createTag,
    del: deleteTag,
  } = useFirestore<Tag>('tags')

  const formMethods = useForm<TagFormValues>()
  const { handleSubmit, register, reset } = formMethods
  const onSubmit = handleSubmit((values) => {
    createTag(values)
    reset()
  })

  return (
    <Flex direction='column' h='full'>
      <Flex align='center' mt='8' mb='4'>
        <Heading>タグ</Heading>
        <Spacer />
        {isLoading && <Spinner />}
      </Flex>
      <form onSubmit={onSubmit}>
        <Input {...register('title')} mb='4' isRequired />
      </form>
      <Box overflowY='auto' flex='1'>
        {tags.map((tag, i) => (
          <div key={i}>
            <Flex my='2' py='2' align='end' role='group'>
              <Box>{tag.title}</Box>
              <Spacer />
              <Box fontSize='xs' ml='auto'>
                {formatDistanceToNowStrict(tag.updatedAt, { locale: ja })}
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
                onClick={() => deleteTag(tag.id)}
              />
            </Flex>
          </div>
        ))}
      </Box>
    </Flex>
  )
}
