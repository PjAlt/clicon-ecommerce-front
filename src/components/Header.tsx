
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { AuthModal } from './AuthModal';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { unreadCount } = useNotifications(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const cartItemCount = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const openAuthModal = (tab: 'login' | 'signup') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        {/* Top bar */}
        <div className="bg-gray-900 text-white text-sm py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <p>Free shipping on orders over Rs. 5000</p>
            <div className="hidden md:flex items-center space-x-4">
              <span>Need help? Call: +977-9841234567</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg font-bold text-xl">
                C
              </div>
              <span className="text-2xl font-bold text-gray-900">Clicon</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="flex w-full">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button 
                  type="submit"
                  className="rounded-l-none bg-orange-500 hover:bg-orange-600"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative">
                  <NotificationDropdown />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                    >
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Order History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/track-order">Track Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/addresses">Addresses</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => openAuthModal('login')}>
                    Login
                  </Button>
                  <Button onClick={() => openAuthModal('signup')}>
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button 
                type="submit"
                className="rounded-l-none bg-orange-500 hover:bg-orange-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/categories">Categories</Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/shop">Shop</Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/track-order">Track Order</Link>
                </Button>
                {!isAuthenticated && (
                  <>
                    <Button variant="ghost" onClick={() => openAuthModal('login')} className="justify-start">
                      Login
                    </Button>
                    <Button variant="ghost" onClick={() => openAuthModal('signup')} className="justify-start">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block bg-gray-50 border-t">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-8 py-3">
              <Link 
                to="/categories" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                All Categories
              </Link>
              <Link 
                to="/shop" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                Shop
              </Link>
              <Link 
                to="/track-order" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                Track Order
              </Link>
              <Link 
                to="/electronics" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                Electronics
              </Link>
              <Link 
                to="/home-kitchen" 
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                Home & Kitchen
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
};
