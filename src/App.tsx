import AppNavigator from './navigation/AppNavigator';
import { RoleProvider } from './store/role/RoleContext';

export default function App() {
  return (
    <RoleProvider>
      <AppNavigator />
    </RoleProvider>
  );
}
