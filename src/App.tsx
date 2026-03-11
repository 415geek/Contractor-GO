// ... existing imports ...
import RestaurantDashboard from "./pages/RestaurantDashboard";

const AppRoutes = () => {
  // ... existing code ...

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={session ? <Navigate to="/restaurant-dashboard" replace /> : <Landing />} />
      <Route path="/login" element={session ? <Navigate to="/restaurant-dashboard" replace /> : <Login />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        {/* ... other routes ... */}
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
// ... rest of the file remains the same ...