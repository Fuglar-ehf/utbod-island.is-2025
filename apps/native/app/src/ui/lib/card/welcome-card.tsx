import React from 'react';
import {
  DynamicColorIOS,
  ImageSourcePropType,
  Platform,
  Image,
} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {dynamicColor} from '../../utils';
import {font} from '../../utils/font';
import gridDotSmallSrc from '../../assets/illustrations/grid-dot-small.png';
import {Link} from '../link/link';

const Host = styled.View<{color: any}>`
  padding: 0 0 24px;
  margin-bottom: 30px;
  margin-left: ${({theme}) => theme.spacing[2]}px;
  width: 283px;
  min-height: 406px;
  background-color: ${dynamicColor(props => props.color)};
  border-radius: ${({theme}) => theme.border.radius.large};
`;

const IllustrationImage = styled.Image`
  width: 100%;
  height: 262px;
`;

const Content = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 24px 0;
`;

const Description = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
  })}
`;

const DotGrid = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 38px;
  padding: 16px;
  height: 262px;
`;

interface CardProps {
  description?: string;
  backgroundColor: {light: string; dark: string};
  imgSrc?: ImageSourcePropType;
  style?: any;
  grid?: boolean;
  link?: {
    url: string;
    title: string;
  };
}

export function WelcomeCard({
  description,
  imgSrc,
  backgroundColor,
  style,
  grid,
  link,
}: CardProps) {
  const theme = useTheme();
  const color = backgroundColor;

  return (
    <Host color={color} style={style}>
      {grid && (
        <DotGrid>
          <Image
            source={gridDotSmallSrc}
            style={{
              width: '100%',
              height: '100%',
              tintColor:
                Platform.OS === 'android'
                  ? theme.color.purple200
                  : DynamicColorIOS({
                      light: theme.color.purple200,
                      dark: '#401c60',
                    }),
            }}
            resizeMode="repeat"
          />
        </DotGrid>
      )}
      {imgSrc && <IllustrationImage source={imgSrc} resizeMode="cover" />}
      <Content>
        <Description>{description}</Description>
        {link && <Link url={link.url}>{link.title}</Link>}
      </Content>
    </Host>
  );
}
