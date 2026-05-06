'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/store/auth.store'
import { useLogout } from '@/hooks/auth/useLogout'
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react'

const sidebarLinks = [
  { href: '/account',                 label: 'Dashboard',       icon: User         },
  { href: '/account/orders',          label: 'My Orders',       icon: Package      },
  { href: '/account/wishlist',        label: 'Wishlist',        icon: Heart        },
  { href: '/account/addresses',       label: 'Addresses',       icon: MapPin       },
  { href: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard   },
  { href: '/account/settings',        label: 'Settings',        icon: Settings     },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const { mutate: logoutUser } = useLogout()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            My Account
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.firstName}!
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <nav className="bg-card rounded-xl border border-border p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {user.firstName[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{fullName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              {/* Nav Links */}
              <ul className="space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon     = link.icon
                  const isActive = pathname === link.href
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Logout */}
              <div className="pt-4 mt-4 border-t border-border">
                <button
                  onClick={() => logoutUser()}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}