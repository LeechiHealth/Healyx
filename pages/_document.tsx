import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en" className="dark bg-background">
      <Head>
        <meta name="theme-color" content="#0c151d" />
        <link rel="icon" href="/healyx-logo.jpg" />
        <link rel="apple-touch-icon" href="/healyx-logo.jpg" />
      </Head>
      <body className="bg-background text-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
