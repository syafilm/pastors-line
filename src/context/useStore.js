import { useContext } from 'react'
import { Context } from './Provider'

const useStore = () => useContext(Context)

export default useStore;