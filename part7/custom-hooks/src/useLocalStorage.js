import {useState} from 'react'

export default function useLocalStorage(init) {
   const [value, setValue] = useState(init);   

   return [value, setValue]
}