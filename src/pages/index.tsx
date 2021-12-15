import { KLogCard, TagCard, TaggedKLogCard } from '@/components'
import { Container, Grid } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <Grid templateColumns='repeat(3, 1fr)'>
      <Container maxW='sm' h='50vh'>
        <TagCard />
      </Container>

      <Container maxW='sm' gridRow='span 2' h='100vh'>
        <KLogCard />
      </Container>
      <Container maxW='sm' h='50vh'>
        <TaggedKLogCard storageKey='tag1' />
      </Container>
      <Container maxW='sm' h='50vh'>
        <TaggedKLogCard storageKey='tag2' />
      </Container>
      <Container maxW='sm' h='50vh'>
        <TaggedKLogCard storageKey='tag3' />
      </Container>
    </Grid>
  )
}

export default Home
