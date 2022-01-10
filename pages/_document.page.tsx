import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

import { getCssText } from '../stitches.config'

export default class Document extends NextDocument {
   static async getInitialProps(ctx: any) {
      try {
         const initialProps = await NextDocument.getInitialProps(ctx)

         return {
            ...initialProps,
            styles: (
               <>
                  {initialProps.styles}
                  <style
                     id="stitches"
                     dangerouslySetInnerHTML={{ __html: getCssText() }}
                  />
               </>
            ),
         }
      } finally {
      }
   }

   render() {
      return (
         <Html lang="en">
            <Head>
               <link rel="preconnect" href="https://fonts.googleapis.com" />
               <link
                  crossOrigin="true"
                  rel="preconnect"
                  href="https://fonts.gstatic.com"
               />
               <link
                  href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Poppins:ital,wght@0,400;0,500;1,400&family=Space+Mono:wght@400;700&display=swap"
                  rel="stylesheet"
               />
            </Head>
            <body>
               <Main />
               <NextScript />
            </body>
         </Html>
      )
   }
}
