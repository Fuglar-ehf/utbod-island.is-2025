import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Stack,
  Text,
  Button,
  Input,
  GridColumn,
  toast,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useRouter } from 'next/router'
import { RecyclingPartner } from '@island.is/skilavottord-web/types'

interface FormProps {
  initialValues?: RecyclingPartner
  type: FormType
}

type FormType = 'edit' | 'add'

const CompanyInfoForm: FC<FormProps> = ({
  initialValues = {
    companyName: 'Company name',
    address: '',
    postnumber: '',
    city: '',
    website: '',
    phone: '',
  },
  type,
}) => {
  const {
    t: { companyInfoForm: t, routes },
  } = useI18n()
  const router = useRouter()
  const { handleSubmit, control, formState } = useForm({ mode: 'onChange' })

  const onSubmit = (formData: RecyclingPartner) => {
    console.log(formData)
    router.push(`${routes.companyInfo.baseRoute}`).then(() => {
      toast.success(t.success)
    })
  }

  const handleCancel = () => {
    router.push(`${routes.companyInfo.baseRoute}`)
  }

  return (
    <Stack space={4}>
      <Box background="blue100" paddingY={10} borderRadius="large">
        <GridColumn
          span={['9/9', '9/9', '7/9', '7/9']}
          offset={['0', '0', '1/9', '1/9']}
        >
          <Stack space={4}>
            <Controller
              control={control}
              name="company"
              rules={{ required: true }}
              defaultValue={initialValues.companyName}
              render={({ value, name }) => (
                <Input
                  label={t.form.company.label}
                  name={name}
                  disabled
                  value={value}
                />
              )}
            />
            <Stack space={2}>
              <Text variant="h4">{t.form.title}</Text>
              <Controller
                control={control}
                name="address"
                rules={{ required: true }}
                defaultValue={initialValues.address}
                render={({ onChange, value, name }) => (
                  <Input
                    label={t.form.visitingAddress.label}
                    placeholder={t.form.visitingAddress.placeholder}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="postNumber"
                rules={{ required: true }}
                defaultValue={initialValues.postnumber}
                render={({ onChange, value, name }) => (
                  <Input
                    label={t.form.postNumber.label}
                    placeholder={t.form.postNumber.placeholder}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="city"
                rules={{ required: true }}
                defaultValue={initialValues.city}
                render={({ onChange, value, name }) => (
                  <Input
                    label={t.form.city.label}
                    placeholder={t.form.city.placeholder}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="website"
                defaultValue={initialValues.website}
                render={({ onChange, value, name }) => (
                  <Input
                    label={t.form.website.label}
                    placeholder={t.form.website.placeholder}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )}
              />
              <Controller
                control={control}
                name="phone"
                rules={{ required: true }}
                defaultValue={initialValues.phone}
                render={({ onChange, value, name }) => (
                  <Input
                    label={t.form.phoneNumber.label}
                    placeholder={t.form.phoneNumber.placeholder}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                  />
                )}
              />
            </Stack>
          </Stack>
        </GridColumn>
      </Box>
      <Box display="flex" justifyContent="spaceBetween">
        <Button onClick={handleCancel} variant="ghost">
          {t.buttons.cancel}
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={!formState.isValid}>
          {type === 'add' ? t.buttons.add : t.buttons.save}
        </Button>
      </Box>
    </Stack>
  )
}

export default CompanyInfoForm
