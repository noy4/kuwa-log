import { KLog, Tag, TaggedKLogFormValues } from '@/@types'
import { useFirestore, useTaggedKLogs } from '@/hooks'
import { pick } from '@/lib/pick'
import { CloseIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Input, Spacer, Spinner } from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { ja } from 'date-fns/locale'
import { where } from 'firebase/firestore'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Select } from './select'

export const TaggedKLogCard = () => {
  const formMethods = useForm<TaggedKLogFormValues>()
  const { handleSubmit, register, reset, watch } = formMethods
  const tag = watch('tag')
  // const { data, isLoading, create, del } = useFirestore<KLog>(
  //   'kLogs',
  //   [where('tags', 'array-contains', tag ?? '')],
  //   [tag]
  // )
  const { data, isLoading, create, del } = useTaggedKLogs(tag)
  const { data: tags } = useFirestore<Tag>('tags')
  const tagOptions = tags.map((t) => ({ value: t.title, text: t.title }))

  const onSubmit = handleSubmit((values) => {
    console.log('values:', values)
    create({ ...pick(values, 'title') })
    reset()
  })

  useEffect(() => {
    reset({ tag: tags[0]?.title })
  }, [tags])

  return (
    <Flex direction='column' h='full'>
      <Flex align='center' mt='8' mb='4'>
        <Select {...register('tag')} options={tagOptions} w='40' />
        <Spacer />
        {isLoading && <Spinner />}
      </Flex>
      <form onSubmit={onSubmit}>
        <Input {...register('title')} mb='4' isRequired />
      </form>
      <Box overflowY='auto' flex='1'>
        {data?.map((d, i) => (
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
