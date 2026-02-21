import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Navigation from './components/Navigation';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PostPropertyPage from './pages/PostPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import MyListingsPage from './pages/MyListingsPage';

function RootLayout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Navigation />
      <Outlet />
      <ProfileSetupModal open={showProfileSetup} />
      <Toaster position="top-right" />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const propertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties',
  component: PropertiesPage,
});

const propertyDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/property/$id',
  component: PropertyDetailPage,
});

const postPropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post-property',
  component: PostPropertyPage,
});

const editPropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-property/$id',
  component: EditPropertyPage,
});

const myListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-listings',
  component: MyListingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  propertiesRoute,
  propertyDetailRoute,
  postPropertyRoute,
  editPropertyRoute,
  myListingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
