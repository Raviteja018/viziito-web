import AppNavigator from './navigation/AppNavigator';
import { RoleProvider } from './store/role/RoleContext';
import { LanguageProvider } from './store/language/LanguageContext';
import { HospitalRoleProvider } from './store/hospital/HospitalRoleContext';
import { HospitalFilterProvider } from './store/hospital/HospitalFilterContext';
import { ClinicRoleProvider } from './store/clinic/ClinicRoleContext';

export default function App() {
  return (
    <LanguageProvider>
      <RoleProvider>
        <HospitalRoleProvider>
          <ClinicRoleProvider>
            <HospitalFilterProvider>
              <AppNavigator />
            </HospitalFilterProvider>
          </ClinicRoleProvider>
        </HospitalRoleProvider>
      </RoleProvider>
    </LanguageProvider>
  );
}
