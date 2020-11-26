import TimeInputField from './TimeInputField'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('TimeInputField', () => {
  test('should add a : character when the user enters two digits', () => {
    // Arrange
    render(
      <TimeInputField>
        <input type="text" />
      </TimeInputField>,
    )

    // Act
    userEvent.type(screen.getByRole('textbox'), '11')

    // Assert
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toEqual(
      '11:',
    )
  })
})
