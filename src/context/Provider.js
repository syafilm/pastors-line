import { createContext } from 'react'
import {RootStore} from 'stores'

export const Context = createContext(RootStore)
const Provider = Context.Provider

export default Provider;