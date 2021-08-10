import React, { FC } from 'react'
import { Button, Box } from '@island.is/island-ui/core'

const isIterableObject = (val) => {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

const forAll = function* (obj, keyPrefix = '') {
  const filteredKeys = Object.entries(obj).filter(([k]) => k !== '__typename')
  for (const [key, val] of filteredKeys) {
    const newKey = keyPrefix + key

    if (isIterableObject(val)) {
      yield* forAll(val, newKey + '_')
    } else {
      yield [newKey, val]
    }
  }
}

const triggerDownload = (filename, csvContent) => {
  const encodedUri = encodeURI(csvContent)
  const a = document.createElement('a')
  a.setAttribute('href', encodedUri)
  a.setAttribute('target', '_blank')
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const makeCsv = (allFlat) => {
  const [firstRow] = allFlat

  return (
    'data:text/csv;charset=utf-8,' +
    firstRow.map(([key]) => key).join(',') +
    '\r\n' +
    allFlat.map((row) => row.map(([, val]) => val).join(',')).join('\r\n')
  )
}
export interface ExportCSVButtonProps {
  data: string
}

export const ExportCSVButton: FC<ExportCSVButtonProps> = ({ data }) => {
  const newdata = JSON.parse(data)
  const useCsvExport = () => {
    if (data) {
      try {
        const allFlat = newdata.map((obj) => [...forAll(obj)])

        const csvContent = makeCsv(allFlat)

        triggerDownload(`opin_gogn${new Date()}.csv`, csvContent)
      } catch (e) {
        console.log(e)
      }
    }

    return
  }
  return (
    <Box style={{ height: '48px' }}>
      <Button
        colorScheme="default"
        preTextIcon="download"
        iconType="filled"
        onClick={() => useCsvExport}
        preTextIconType="filled"
        size="small"
        type="button"
        variant="ghost"
      >
        CSV
      </Button>
    </Box>
  )
}

export default ExportCSVButton
