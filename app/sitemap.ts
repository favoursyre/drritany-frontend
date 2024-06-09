///This refers to the sitemap configurations

///Libraries -->
import { MetadataRoute } from 'next'
import { domainName } from '@/config/utils'
 
///Commencing code -->
export default function sitemap(): MetadataRoute.Sitemap {

  return [
    {
      url: domainName,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${domainName}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${domainName}#products`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
    // {
    //     url: `${domainName}/register/0`,
    //     lastModified: new Date(),
    //     changeFrequency: 'monthly',
    //     priority: 0.7,
    //   },
    // {
    //     url: `${domainName}/login`,
    //     lastModified: new Date(),
    //     changeFrequency: 'monthly',
    //     priority: 0.6,
    //   },
  ]
}