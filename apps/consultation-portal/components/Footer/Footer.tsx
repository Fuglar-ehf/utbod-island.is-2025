import {
  ArrowLink,
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Logo,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { SGLogo } from '../svg/index'
import FooterColumn from './components/FooterColumn'

import * as styles from './Footer.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Hidden print={true}>
        <div className={styles.footerColor}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12" paddingTop={6} paddingBottom={6}>
                <Columns
                  alignY="center"
                  space={2}
                  collapseBelow="lg"
                  align="center"
                >
                  <FooterColumn justifyContent="flexStart">
                    <SGLogo />
                  </FooterColumn>
                  <FooterColumn isDivider />
                  <FooterColumn justifyContent="center">
                    <Logo />
                  </FooterColumn>
                  <FooterColumn isDivider />
                  <FooterColumn justifyContent="flexEnd">
                    <Stack space={1}>
                      <Text variant="small">
                        Viltu hjálpa okkur að bæta samráðsgáttina? Ábendingar
                        eru vel þegnar.
                      </Text>
                      <ArrowLink href="mailto:samradsgatt@stjornarradid.is">
                        Senda ábendingu
                      </ArrowLink>
                    </Stack>
                  </FooterColumn>
                </Columns>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </div>
      </Hidden>
    </footer>
  )
}

export default Footer
