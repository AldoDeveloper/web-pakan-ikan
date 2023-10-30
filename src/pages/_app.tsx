import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.min.css"
import "primeflex/primeflex.css"
import "primeflex/primeflex.min.css"
import 'primeicons/primeicons.css';
import type { AppProps } from 'next/app'
import { NextPage } from 'next'
import React from 'react'
import '@/styles/globals.css'
import LayoutContextAuth from '../../layout/layoutContextAuth'
import LayoutContextDasboard from "../../layout/layoutContextDasboard";

export type NextPageLayout<P= {}, IP = P> = NextPage<P, IP> & {
  getLayoutAuth     ?: (page: React.ReactElement)  => React.ReactNode,
  getLayoutDasboard ?: (page: React.ReactElement)  => React.ReactNode,
  getLayoutIndex    ?: (page: React.ReactElement)  => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {

  if(Component.getLayoutAuth){
    return(
      <LayoutContextAuth>
        <Component {...pageProps}/>
      </LayoutContextAuth>
    )
  }

  if(Component.getLayoutDasboard){
    return(
      <LayoutContextDasboard>
          <Component {...pageProps} />
      </LayoutContextDasboard>
    )
  }

  if(Component.getLayoutIndex){
    return <Component {...pageProps}/>
  }
}
