import { Tag, TagFormValues } from '@/@types'
import { tagsRef, transform } from '@/lib/db'
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
import { addDoc, deleteDoc, orderBy, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'

export const TagCard = () => {
  const [tags = [], loading] = useCollectionData<Tag>(
    query(tagsRef, orderBy('updatedAt', 'asc')) as any,
    {
      refField: 'ref',
      transform,
    }
  )

  const formMethods = useForm<TagFormValues>()
  const { handleSubmit, register, reset } = formMethods
  const onSubmit = handleSubmit(async (values) => {
    const dto = {
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await addDoc(tagsRef, dto)
    reset()
  })

  return (
    <Flex direction='column' h='full'>
      <Flex align='center' mt='8' mb='4'>
        <Heading>タグ</Heading>
        <Spacer />
        {loading && <Spinner />}
      </Flex>
      <form onSubmit={onSubmit}>
        <Input {...register('title')} mb='4' isRequired />
      </form>
      <Box flex='1' overflowY='auto'>
        <Flex gap='1' wrap='wrap'>
          {tags.map((tag, i) => (
            <ChakraTag
              key={i}
              variant='solid'
              fontSize='xx-small'
              size='sm'
              role='group'
            >
              {tag.title}
              <CloseButton
                display='none'
                rounded='full'
                w='5'
                h='5'
                size='sm'
                ml='2'
                _groupHover={{ display: 'block' }}
                onClick={() => deleteDoc(tag.ref)}
              />
            </ChakraTag>
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}
