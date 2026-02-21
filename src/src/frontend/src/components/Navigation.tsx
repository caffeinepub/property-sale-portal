import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Home, PlusCircle, Building2, LogIn, LogOut, User } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Building2 className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-serif font-semibold tracking-tight">EstateHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors [&.active]:text-foreground [&.active]:font-semibold"
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors [&.active]:text-foreground [&.active]:font-semibold"
            >
              Properties
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/my-listings"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors [&.active]:text-foreground [&.active]:font-semibold"
                >
                  My Listings
                </Link>
                <Link
                  to="/post-property"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors [&.active]:text-foreground [&.active]:font-semibold"
                >
                  Post Property
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && userProfile && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{userProfile.name}</span>
              </div>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="font-medium"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
