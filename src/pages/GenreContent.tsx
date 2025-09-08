import React from 'react'

import type {GenreType} from "../store/content"
import { useSearchParams } from 'react-router-dom'

type PorpsType = {
    type:'movie' | 'tv'
} & GenreType

const GenreContent = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
  return (
    <div>{id}</div>
  )
}

export default GenreContent