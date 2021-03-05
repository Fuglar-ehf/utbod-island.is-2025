import React, { FC } from 'react'
import Background from '../Background/Background'
import {
  Box,
  GridColumn,
  GridRow,
  ProfileCard,
} from '@island.is/island-ui/core'

export interface TeamListProps {
  teamMembers: { title: string; name: string; image: { url: string } }[]
}

export const TeamList: FC<TeamListProps> = ({ teamMembers }) => {
  return (
    <GridRow>
      {teamMembers.map((member, index) => (
        <GridColumn span={['12/12', '6/12', '6/12', '4/12']} key={index}>
          <Box paddingBottom={3} height="full">
            <ProfileCard
              title={member.name}
              description={member.title}
              image={`${member.image.url}?w=400`}
              heightFull
            />
          </Box>
        </GridColumn>
      ))}
    </GridRow>
  )
}

export default TeamList
