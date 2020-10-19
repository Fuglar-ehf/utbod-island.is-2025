import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { Inline } from '../Inline/Inline'
import { Tag } from './Tag'

export default {
  title: 'Components/Tag',
  component: Tag,
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=49%3A285',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=30%3A1',
  }),
}

export const Basic = () => (
  <ContentBlock>
    <Box paddingY={[1, 2]}>
      <Inline space={1}>
        <Tag>Ferðagjöf</Tag>
        <Tag variant="darkerBlue">Gifting</Tag>
        <Tag variant="darkerMint">Fæðingarorlof</Tag>
        <Tag variant="mint">Skilnaður</Tag>
        <Tag variant="purple">Færnimat</Tag>
        <Tag variant="red" label>
          Færnimat
        </Tag>
        <Tag variant="white" label>
          Færnimat
        </Tag>
        <Tag variant="rose">Færnimat</Tag>
        <Tag variant="red" attention>
          Mikilvægt
        </Tag>
      </Inline>
    </Box>
  </ContentBlock>
)

export const Bordered = () => (
  <ContentBlock>
    <Box paddingY={[1, 2]}>
      <Inline space={1}>
        <Tag bordered>Ferðagjöf</Tag>
        <Tag variant="darkerBlue" bordered>
          Gifting
        </Tag>
        <Tag variant="darkerMint" bordered>
          Fæðingarorlof
        </Tag>
        <Tag variant="mint" bordered>
          Skilnaður
        </Tag>
        <Tag variant="purple" bordered>
          Færnimat
        </Tag>
        <Tag variant="red" label bordered>
          Færnimat
        </Tag>
        <Tag variant="white" label bordered>
          Færnimat
        </Tag>
        <Tag variant="darkerMint" label bordered attention>
          Mikilvægt
        </Tag>
      </Inline>
    </Box>
  </ContentBlock>
)
