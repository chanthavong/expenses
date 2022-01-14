import React from 'react'

export const usePrevious = (value: string) => {
   const ref = React.useRef()
   React.useEffect(() => {
      ref.current = value
   }, [value])
   return ref.current
}
