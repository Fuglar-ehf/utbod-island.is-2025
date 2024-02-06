import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { messages } from './messages'
import { HealthPaths } from './paths'

export const healthNavigation: PortalNavigationItem = {
  name: m.health,
  path: HealthPaths.HealthRoot,
  icon: {
    icon: 'heart',
  },
  children: [
    {
      name: m.health,
      navHide: true,
      path: HealthPaths.HealthRoot,
    },
    {
      name: messages.overviewTitle,
      path: HealthPaths.HealthOverview,
    },
    {
      name: m.therapies,
      path: HealthPaths.HealthTherapies,
      children: [
        {
          name: messages.physicalTherapy,
          path: HealthPaths.HealthTherapiesPhysical,
          navHide: true,
        },
        {
          name: messages.speechTherapy,
          path: HealthPaths.HealthTherapiesSpeech,
          navHide: true,
        },
        {
          name: messages.occupationalTherapy,
          path: HealthPaths.HealthTherapiesOccupational,
          navHide: true,
        },
      ],
    },
    {
      name: m.payments,
      path: HealthPaths.HealthPayments,
      children: [
        {
          name: messages.paymentParticipation,
          path: HealthPaths.HealthPaymentParticipation,
          navHide: true,
        },
        {
          name: messages.paymentOverview,
          path: HealthPaths.HealthPaymentOverview,
          navHide: true,
        },
      ],
    },
    {
      name: m.aidsAndNutrition,
      path: HealthPaths.HealthAidsAndNutrition,
    },
    {
      name: m.dentists,
      path: HealthPaths.HealthDentists,
      children: [
        {
          name: messages.dentistRegisterationPageTitle,
          path: HealthPaths.HealthDentistRegistration,
          navHide: true,
        },
      ],
    },
    {
      name: m.healthCenter,
      path: HealthPaths.HealthCenter,
      children: [
        {
          name: messages.healthCenterRegistrationTitle,
          path: HealthPaths.HealthCenterRegistration,
          navHide: true,
        },
      ],
    },
    {
      name: messages.medicineTitle,
      path: HealthPaths.HealthMedicine,
      children: [
        {
          name: messages.medicinePurchaseTitle,
          path: HealthPaths.HealthMedicinePurchase,
          navHide: true,
        },
        {
          name: messages.medicineCalculatorTitle,
          path: HealthPaths.HealthMedicineCalculator,
          activeIfExact: true,
          navHide: true,
        },
        {
          name: messages.medicineLicenseIntroTitle,
          path: HealthPaths.HealthMedicineCertificates,
          activeIfExact: true,
          navHide: true,
          children: [
            {
              name: messages.medicineLicenseTitle,
              path: HealthPaths.HealthMedicineCertificate,
              activeIfExact: true,
              navHide: true,
            },
          ],
        },
      ],
    },
  ],
  description: m.healthDescription,
}
