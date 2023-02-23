import { SearchBar } from '@ui'
import React from 'react'
import styled from 'styled-components/native'
import { I18nProvider } from '../../contexts/i18n-provider'
import { ThemeProvider } from '../../contexts/theme-provider'
import { uiStore, useUiStore } from '../../stores/ui-store'

const Host = styled.View`
  height: 120px;
  background-color: ${(props) => props.theme.shade.background};
`

const Container = styled.View`
  flex: 1;
  margin-bottom: 4px;
  padding-top: 56px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: ${(props) => props.theme.shade.background};
`

const SearchBarComponent = ({
  queryKey = 'inboxQuery',
  placeholder = 'Leita...',
}: {
  queryKey?: 'inboxQuery' | 'applicationQuery'
  placeholder?: string
} = {}) => {
  const ui = useUiStore()
  return (
    <Host>
      <Container>
        <SearchBar
          value={ui[queryKey]}
          onChangeText={(text) => uiStore.setState({ [queryKey]: text } as any)}
          onCancelPress={() => uiStore.setState({ [queryKey]: '' } as any)}
          placeholder={placeholder}
          returnKeyType="search"
        />
      </Container>
    </Host>
  )
}

export const AndroidSearchBar = (props: any) => {
  return (
    <I18nProvider>
      <ThemeProvider>
        <SearchBarComponent {...props} />
      </ThemeProvider>
    </I18nProvider>
  )
}
