import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.css'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children is the specific page content
  return children
}

export default App
