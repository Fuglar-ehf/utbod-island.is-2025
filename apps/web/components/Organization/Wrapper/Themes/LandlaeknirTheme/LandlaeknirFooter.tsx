import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Link,
  ResponsiveSpace,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem, Slice } from '@island.is/web/graphql/schema'
import { SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'
import { webRichText } from '@island.is/web/utils/richText'
import * as styles from './LandlaeknirFooter.css'

const renderParagraphs = (
  content: Slice[],
  marginBottom: ResponsiveSpace = 2,
  bold = false,
) =>
  webRichText(content as SliceType[], {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <Text
          fontWeight={bold ? 'semiBold' : undefined}
          marginBottom={marginBottom}
        >
          {children}
        </Text>
      ),
    },
  })

interface LandLaeknirFooterProps {
  footerItems: Array<FooterItem>
}

export const LandLaeknirFooter = ({ footerItems }: LandLaeknirFooterProps) => {
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <Box className={styles.container}>
        <GridContainer className={styles.mainColumn}>
          <GridColumn>
            <GridRow>
              <Box marginLeft={2}>
                <img
                  src="https://images.ctfassets.net/8k0h54kbe6bj/3aKn7lTVtvZVVHJVPSs6Gh/bf8844713aa03d44916e98ae612ea5da/landlaeknir-heilbrigdisraduneytid.png"
                  alt="landlaeknirLogo"
                />
              </Box>
            </GridRow>

            <GridRow marginTop={2}>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderTop} />
                {footerItems?.[0] &&
                  renderParagraphs(footerItems[0].content, 2, true)}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderTop} />
                {footerItems?.[1] && (
                  <Box>
                    <Box marginBottom={2}>
                      {footerItems[1].link?.url ? (
                        <Link href={footerItems[1].link.url} color="white">
                          <Text fontWeight="semiBold" marginBottom={2}>
                            <Hyphen>{footerItems[1].title}</Hyphen>
                          </Text>
                        </Link>
                      ) : (
                        <Text fontWeight="semiBold" marginBottom={2}>
                          <Hyphen>{footerItems[1].title}</Hyphen>
                        </Text>
                      )}
                    </Box>
                    {renderParagraphs(footerItems[1].content)}
                  </Box>
                )}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderTop} />
                {footerItems?.[2] && (
                  <Box>
                    <Box marginBottom={2}>
                      {footerItems[2].link?.url ? (
                        <Link href={footerItems[2].link.url} color="white">
                          <Text fontWeight="semiBold" marginBottom={2}>
                            <Hyphen>{footerItems[2].title}</Hyphen>
                          </Text>
                        </Link>
                      ) : (
                        <Text fontWeight="semiBold" marginBottom={2}>
                          <Hyphen>{footerItems[2].title}</Hyphen>
                        </Text>
                      )}
                    </Box>
                    {renderParagraphs(footerItems[2].content)}
                  </Box>
                )}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderTop} />
                {footerItems.slice(3, 5).map((item, index) => (
                  <Box key={index}>
                    <Box marginBottom={2}>
                      {item.link?.url ? (
                        <Link href={item.link.url} color="white">
                          <Text fontWeight="semiBold" marginBottom={2}>
                            <Hyphen>{item.title}</Hyphen>
                          </Text>
                        </Link>
                      ) : (
                        <Text fontWeight="semiBold" marginBottom={2}>
                          <Hyphen>{item.title}</Hyphen>
                        </Text>
                      )}
                    </Box>
                    {renderParagraphs(item.content)}
                  </Box>
                ))}
              </GridColumn>
            </GridRow>

            <GridRow className={styles.bottomLine}>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderBottom} />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderBottom} />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderBottom} />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box className={styles.borderBottom} />
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden below="lg">
                  <Box
                    marginLeft={1}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <img
                      src="https://images.ctfassets.net/8k0h54kbe6bj/3vtLh2dJ55PA1Y1aOXIkM9/6c60a95ed3db8136a49e9734adbc8c7c/Jafnlaunavottun.svg"
                      alt="jafnlaunavottunLogo"
                    />
                    <Box marginLeft={2}>
                      {footerItems?.[5] &&
                        renderParagraphs(footerItems[5].content, 0, true)}
                    </Box>
                  </Box>
                </Hidden>
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden below="lg">
                  {footerItems?.[6] && (
                    <Box className={styles.row}>
                      <Box marginLeft={2} marginRight={1}>
                        {renderParagraphs(footerItems[6].content, 0)}
                      </Box>
                      <img
                        className={styles.facebookLogo}
                        src="https://images.ctfassets.net/8k0h54kbe6bj/1hx4HeCK1OFzPIjtKkMmrL/fa769439b9221a92bfb124b598494ba4/Facebook-Logo-Dark.svg"
                        alt="facebookLogo"
                      />
                    </Box>
                  )}
                </Hidden>
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden below="lg">
                  {footerItems?.[7] && renderParagraphs(footerItems[7].content)}
                </Hidden>
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden below="lg">
                  {footerItems?.[8] && renderParagraphs(footerItems[8].content)}
                </Hidden>
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn span="12/12">
                <Hidden above="sm">
                  <Box className={styles.borderBottom} />
                </Hidden>
                <Hidden above="md">
                  <Box
                    marginLeft={1}
                    marginBottom={3}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <img
                      src="https://images.ctfassets.net/8k0h54kbe6bj/3vtLh2dJ55PA1Y1aOXIkM9/6c60a95ed3db8136a49e9734adbc8c7c/Jafnlaunavottun.svg"
                      alt="jafnlaunavottunLogo"
                    />
                    <Box marginLeft={2}>
                      {footerItems?.[5] &&
                        renderParagraphs(footerItems[5].content, 0, true)}
                    </Box>
                  </Box>
                </Hidden>
                <Hidden above="md">
                  {footerItems?.[6] && (
                    <Box
                      marginBottom={2}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <Box marginRight={1}>
                        {renderParagraphs(footerItems[6].content, 0)}
                      </Box>
                      <img
                        src="https://images.ctfassets.net/8k0h54kbe6bj/1hx4HeCK1OFzPIjtKkMmrL/fa769439b9221a92bfb124b598494ba4/Facebook-Logo-Dark.svg"
                        alt="facebookLogo"
                      />
                    </Box>
                  )}
                </Hidden>
                <Hidden above="md">
                  {footerItems?.[7] && renderParagraphs(footerItems[7].content)}
                </Hidden>
                <Hidden above="md">
                  {footerItems?.[8] && renderParagraphs(footerItems[8].content)}
                </Hidden>
              </GridColumn>
            </GridRow>
          </GridColumn>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default LandLaeknirFooter
