import React, { useEffect, useState } from 'react'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  MunicipalityAdminSettings,
} from '@island.is/financial-aid-web/veita/src/components'

import { useMunicipality } from '@island.is/financial-aid/shared/components'
import { Municipality } from '@island.is/financial-aid/shared/lib'

export const MunicipalitySettings = () => {
  const { municipality, error, loading } = useMunicipality()

  const [currentMunicipality, setCurrentMunicipality] = useState<Municipality>()

  useEffect(() => {
    if (municipality && municipality.length > 0) {
      setCurrentMunicipality(municipality[0])
    }
  }, [municipality])

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      {currentMunicipality && (
        <MunicipalityAdminSettings currentMunicipality={currentMunicipality} />
      )}

      {error && (
        <div>
          Abbabab mistókst að sækja sveitarfélagsstillingar, ertu örugglega með
          aðgang að þessu upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default MunicipalitySettings
