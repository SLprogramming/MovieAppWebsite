
import { useSearchParams } from 'react-router-dom'


const GenreContent = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
  return (
    <div>{id}</div>
  )
}

export default GenreContent