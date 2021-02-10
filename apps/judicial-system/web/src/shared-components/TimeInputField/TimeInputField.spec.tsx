import TimeInputField from './TimeInputField'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('TimeInputField', () => {
  test('should add a : character when the user enters two digits', async () => {
    // Arrange
    render(
      <TimeInputField>
        <input type="text" />
      </TimeInputField>,
    )

    // Act
    userEvent.type(await screen.findByRole('textbox'), '11')

    // Assert
    expect(
      ((await screen.findByRole('textbox')) as HTMLInputElement).value,
    ).toEqual('11:')
  })
})
