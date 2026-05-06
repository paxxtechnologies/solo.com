import { HeroSection } from '@/components/home/HeroSection'
import { FlashDealsSection } from '@/components/home/FlashDealsSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { BnplPromo } from '@/components/home/BnplPromo'
import { BestSellers } from '@/components/home/BestSellers'
import { TrustStrip } from '@/components/home/TrustStrip'
import { StoreLocations } from '@/components/home/StoreLocations'
import { Testimonials } from '@/components/home/Testimonials'
import { WhatsAppCta } from '@/components/home/WhatsAppCta'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FlashDealsSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BnplPromo />
      <BestSellers />
      <TrustStrip />
      <StoreLocations />
      <Testimonials />
      <WhatsAppCta />
    </>
  )
}
