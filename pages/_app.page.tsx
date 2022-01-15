import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { ToastProvider } from 'react-toast-notifications'

import client from '../lib/apollo'
import globalStyles from '../styles/globalStyles'

import '../styles/globals.css'
import { UserProvider } from '../lib/user'

const App = ({ Component, pageProps }: AppProps) => {
   globalStyles()
   return (
      <ToastProvider
         autoDismiss
         placement="top-center"
         autoDismissTimeout={3000}
      >
         <ApolloProvider client={client}>
            <UserProvider>
               <Component {...pageProps} />
            </UserProvider>
         </ApolloProvider>
      </ToastProvider>
   )
}

export default App
