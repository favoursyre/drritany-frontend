///This refers to the sitemap configurations

///Libraries -->
import { MetadataRoute } from 'next'
import { domainName, getProducts } from '@/config/utils'
import { IProduct } from '@/config/interfaces';
 
///Commencing code -->
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  //Getting all available products
  const products = await getProducts() as unknown as Array<IProduct>
  const productIds = products.map((product: IProduct) => product._id!.toString());
  const productSitemaps: MetadataRoute.Sitemap = productIds.map((id) => ({ 
      url: `${domainName}/products/${id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
  }));

  return [
    {
      url: domainName,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${domainName}/about`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${domainName}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${domainName}/faqs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${domainName}/terms`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...productSitemaps
  ]
}