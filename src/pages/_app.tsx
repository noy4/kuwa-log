import { theme } from '@/lib/theme'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { KLogState } from 'state'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <KLogState.Provider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </KLogState.Provider>
  )
}

export default App
