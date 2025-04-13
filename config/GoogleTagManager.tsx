///Google Tag Manager component

///Libraries -->
import { container } from 'googleapis/build/src/apis/container';
import Script from 'next/script';
import React, { FC } from 'react';

//Commencing the code
const GoogleTagManager: FC = () => {
  const containerId = "GTM-55DBL8LN" //process.env.NEXT_PUBLIC_GTM_CONTAINER_ID!
  console.log('Container: ', containerId)

  if (!containerId) {
    console.log("GTM container id not detected")
  }

  return (
    <>
      <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
                console.log('GTM Loaded, dataLayer:', w[l]);
              })(window,document,'script','dataLayer','${containerId}');
            `,
          }}
      />
    </>
  );
}

export default GoogleTagManager;