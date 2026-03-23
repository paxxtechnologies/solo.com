import Link from "next/link";
import { SoloLogo } from "@/components/ui/SoloLogo";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <SoloLogo size="lg" className="mx-auto mb-8" />
        
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          This page has gone gadget shopping.
        </h2>
        
        <p className="text-muted mb-8">
          The page you{"'"}re looking for doesn{"'"}t exist or has been moved.
          Let{"'"}s get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-primary text-white font-semibold rounded-btn hover:bg-primary-hover transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/shop/all"
            className="flex items-center justify-center gap-2 px-8 py-3 border border-border text-foreground font-semibold rounded-btn hover:bg-surface-alt transition-colors"
          >
            <Search className="w-5 h-5" />
            Search Products
          </Link>
        </div>
      </div>
    </main>
  );
}
