import { m } from '@island.is/service-portal/core'
import { PortalRoute } from '@island.is/portals/core'
import { FinancePaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

export const redirects: PortalRoute[] = [
  {
    name: m.financeBills,
    path: FinancePaths.FinancePayments,
    enabled: true,
    element: <Navigate to={FinancePaths.FinancePaymentsBills} replace />,
  },
  {
    name: m.financeBills,
    path: FinancePaths.FinanceBills,
    enabled: true,
    element: <Navigate to={FinancePaths.FinancePaymentsBills} replace />,
  },
  {
    name: m.financeBills,
    path: FinancePaths.FinanceSchedule,
    enabled: true,
    element: <Navigate to={FinancePaths.FinancePaymentsSchedule} replace />,
  },
]
