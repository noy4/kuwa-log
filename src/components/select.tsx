import {
  SelectProps,
  Select as ChakraSelect,
  forwardRef,
} from '@chakra-ui/react'
import { VFC } from 'react'

export type SelectOption = {
  value: string
  text: string
}
export type Props = SelectProps & {
  options: SelectOption[]
}

export const Select: VFC<Props> = forwardRef(({ options, ...props }, ref) => {
  return (
    <ChakraSelect ref={ref} {...props}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.text}
        </option>
      ))}
    </ChakraSelect>
  )
})
