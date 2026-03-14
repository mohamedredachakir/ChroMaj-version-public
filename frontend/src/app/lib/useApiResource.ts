import { useEffect, useState } from 'react'

interface ResourceState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

export function useApiResource<T>(loader: () => Promise<T>, deps: ReadonlyArray<unknown> = []) {
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    error: null,
    isLoading: true,
  })

  useEffect(() => {
    let active = true

    setState({ data: null, error: null, isLoading: true })

    loader()
      .then((data) => {
        if (!active) {
          return
        }

        setState({ data, error: null, isLoading: false })
      })
      .catch((error: Error) => {
        if (!active) {
          return
        }

        setState({ data: null, error: error.message, isLoading: false })
      })

    return () => {
      active = false
    }
  }, deps)

  return state
}
