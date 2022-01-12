import React from 'react'
import { Box, Button, Select } from '@island.is/island-ui/core'
import { User, Locale } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { useUpdateUserProfileMutation } from '../../../gen/graphql'
import { sharedMessages } from '@island.is/shared/translations'

export const UserLanguageSwitcher = ({
  user,
  dropdown = false,
}: {
  user: User
  dropdown?: boolean
}) => {
  const { lang, formatMessage, changeLanguage } = useLocale()
  const [updateUserProfileMutation] = useUpdateUserProfileMutation()

  const handleLanguageChange = async () => {
    const locale = lang === 'en' ? 'is' : 'en'
    const actor = user.profile.actor
    const isDelegation = Boolean(actor)
    changeLanguage(locale as Locale)

    if (user && !isDelegation) {
      try {
        await updateUserProfileMutation({
          variables: {
            input: {
              locale: locale,
            },
          },
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  return dropdown ? (
    <Box paddingBottom={[2, 3]}>
      <Select
        backgroundColor="blue"
        name="language-switcher"
        size="xs"
        value={
          lang === 'en'
            ? { label: 'English', value: 'en' }
            : { label: 'Íslenska', value: 'is' }
        }
        onChange={handleLanguageChange}
        label={formatMessage(sharedMessages.language)}
        options={[
          { label: 'Íslenska', value: 'is' },
          { label: 'English', value: 'en' },
        ]}
      />
    </Box>
  ) : (
    <Box marginRight={[1, 2]}>
      <Button
        variant="utility"
        onClick={handleLanguageChange}
        aria-label={'switch language'}
        data-testid="language-switcher"
      >
        {lang === 'en' ? 'IS' : 'EN'}
      </Button>
    </Box>
  )
}
