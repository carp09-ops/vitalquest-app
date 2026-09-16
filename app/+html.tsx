import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#080A0C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VitalQuest" />
        <link rel="manifest" href="/vitalquest-app/manifest.json" />
        <link rel="apple-touch-icon" href="/vitalquest-app/assets/branding/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/vitalquest-app/assets/branding/icon-192.png" />
        <link rel="preload" as="image" href="/vitalquest-app/art/v1/mythic-world.webp" />
        <link rel="preload" as="image" href="/vitalquest-app/art/v1/mythic-hero.webp" />
        <style dangerouslySetInnerHTML={{__html:`
          html,body,#root{background:#080A0C!important;min-height:100%;margin:0;overscroll-behavior:none;}
          body{color:#F3EBDD;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
          *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
          ::selection{background:rgba(214,160,76,.35);color:#fff6e8;}
        `}} />
        <title>VitalQuest</title>
        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/vitalquest-app/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
