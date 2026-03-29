import { ShopCheckoutForm } from '@/components/shop/ShopCheckoutForm';
import { listPublicShopProducts } from '@/lib/content/shop';

export default async function ShopCheckoutPage() {
  const products = await listPublicShopProducts();
  return <ShopCheckoutForm products={products} />;
}
