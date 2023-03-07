import {
  Box,
  Columns,
  Column,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  ArrowLink,
  Hidden,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './HeroBanner.css'

import { HeroLogo } from '../svg'
import { StatisticBox } from '..'
import HeroTiles from './HeroTiles'
import SplashSmall from '../svg/SplashSmall'

export const HeroBanner = () => {
  return (
    <Box
      style={{
        borderBottom: `1px solid ${theme.color.blue200}`,
      }}
      background="blue100"
      display="flex"
      flexDirection={'column'}
    >
      <GridContainer>
        <Box paddingX={[0, 0, 0, 0, 15]}>
          <GridRow className={styles.rowAlign}>
            <Hidden above="md">
              <GridColumn span="12/12" order={[1, 1]}>
                <HeroLogo width="0.81" height="0.81" />
              </GridColumn>
            </Hidden>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              order={[2, 2, 2, 1, 1]}
            >
              <Hidden below="lg">
                <HeroLogo />
              </Hidden>
              <Text paddingY={4}>
                Markmið Samráðsgáttarinnar er að auka gagnsæi og möguleika
                almennings og hagsmunaaðila á þátttöku í stefnumótun,
                reglusetningu og ákvarðanatöku opinberra aðila. Hér er á einum
                stað hægt að finna öll mál ráðuneyta sem birt hafa verið til
                samráðs við almenning. Öllum er frjálst að senda inn umsögn eða
                ábendingu.
              </Text>
              <Columns collapseBelow="lg" space={2}>
                <Column>
                  <ArrowLink href="/um">Lesa meira</ArrowLink>
                </Column>
                <Column width="content">
                  <ArrowLink href="/um">Skoða þingmálaskrá</ArrowLink>
                </Column>
              </Columns>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              order={[1, 1, 1, 2, 2]}
            >
              <Box className={styles.bg}>
                <SplashSmall />
              </Box>
              <Box className={styles.alignTiles}>
                <HeroTiles space={2} columns={[1, 1, 1, 2, 2]}>
                  <StatisticBox label="Mál til umsagnar" statistic="32 mál" />
                  <StatisticBox
                    label="Umsagnir frá upphafi"
                    statistic="12.843 umsagnir"
                  />
                  <StatisticBox
                    label="Mál frá upphafi"
                    statistic="48.942 mál"
                  />
                </HeroTiles>
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </Box>
  )
}
export default HeroBanner
