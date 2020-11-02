import { createMemoryHistory } from 'history'
import React from 'react'
import { act, render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import CourtRecord from './CourtRecord'
import userEvent from '@testing-library/user-event'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import {
  mockJudgeUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UpdateCase } from '@island.is/judicial-system/types'

describe(`${Constants.COURT_DOCUMENT_ROUTE}`, () => {
  test('should now allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Mock localstorage methods
    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id_2',
        courtStartTime: '2020-10-24T13:37:00Z',
        courtEndTime: '2020-10-24T13:40:00Z',
      })
    })
    Storage.prototype.setItem = jest.fn()

    // Act
    const { getByTestId } = render(
      <MockedProvider
        mocks={mockUpdateCaseMutation([
          {
            courtAttendees: 'Jon Hnerring, Pol Ulov',
          } as UpdateCase,
          {
            policeDemands:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Duo Reges: constructio interrete. Nam his libris eum malo quam reliquo ornatu villae delectari. Quod cum dixissent, ille contra. At enim hic etiam dolore. Vide ne ista sint Manliana vestra aut maiora etiam, si imperes quod facere non possim. Ita ne hoc quidem modo paria peccata sunt. Non autem hoc: igitur ne illud quidem. Quare conare, quaeso. Nam si propter voluptatem, quae est ista laus, quae possit e macello peti? ',
          } as UpdateCase,
          {
            accusedPlea:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iam id ipsum absurdum, maximum malum neglegi. Sed ne, dum huic obsequor, vobis molestus sim. Quae dici eadem de ceteris virtutibus possunt, quarum omnium fundamenta vos in voluptate tamquam in aqua ponitis. Hanc ergo intuens debet institutum illud quasi signum absolvere. Duo Reges: constructio interrete. Quorum sine causa fieri nihil putandum est. Antiquorum autem sententiam Antiochus noster mihi videtur persequi diligentissime, quam eandem Aristoteli fuisse et Polemonis docet. Atque ab his initiis profecti omnium virtutum et originem et progressionem persecuti sunt. Nam et complectitur verbis, quod vult, et dicit plane, quod intellegam; Cur deinde Metrodori liberos commendas?',
          } as UpdateCase,
          {
            litigationPresentations:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nihilne est in his rebus, quod dignum libero aut indignum esse ducamus? Haec quo modo conveniant, non sane intellego. Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt; Etenim semper illud extra est, quod arte comprehenditur. Paulum, cum regem Persem captum adduceret, eodem flumine invectio? Nunc haec primum fortasse audientis servire debemus. Duo Reges: constructio interrete. Quare hoc videndum est, possitne nobis hoc ratio philosophorum dare.',
          } as UpdateCase,
        ])}
        addTypename={false}
      >
        <userContext.Provider value={mockJudgeUserContext}>
          <Router history={history}>
            <CourtRecord />
          </Router>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    await act(async () => {
      userEvent.type(
        getByTestId('courtAttendees') as HTMLInputElement,
        'Jon Hnerring, Pol Ulov',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('policeDemands') as HTMLInputElement,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Duo Reges: constructio interrete. Nam his libris eum malo quam reliquo ornatu villae delectari. Quod cum dixissent, ille contra. At enim hic etiam dolore. Vide ne ista sint Manliana vestra aut maiora etiam, si imperes quod facere non possim. Ita ne hoc quidem modo paria peccata sunt. Non autem hoc: igitur ne illud quidem. Quare conare, quaeso. Nam si propter voluptatem, quae est ista laus, quae possit e macello peti? ',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('accusedPlea') as HTMLInputElement,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iam id ipsum absurdum, maximum malum neglegi. Sed ne, dum huic obsequor, vobis molestus sim. Quae dici eadem de ceteris virtutibus possunt, quarum omnium fundamenta vos in voluptate tamquam in aqua ponitis. Hanc ergo intuens debet institutum illud quasi signum absolvere. Duo Reges: constructio interrete. Quorum sine causa fieri nihil putandum est. Antiquorum autem sententiam Antiochus noster mihi videtur persequi diligentissime, quam eandem Aristoteli fuisse et Polemonis docet. Atque ab his initiis profecti omnium virtutum et originem et progressionem persecuti sunt. Nam et complectitur verbis, quod vult, et dicit plane, quod intellegam; Cur deinde Metrodori liberos commendas?',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('litigationPresentations') as HTMLInputElement,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nihilne est in his rebus, quod dignum libero aut indignum esse ducamus? Haec quo modo conveniant, non sane intellego. Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt; Etenim semper illud extra est, quod arte comprehenditur. Paulum, cum regem Persem captum adduceret, eodem flumine invectio? Nunc haec primum fortasse audientis servire debemus. Duo Reges: constructio interrete. Quare hoc videndum est, possitne nobis hoc ratio philosophorum dare.',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(false)
    })
  })
})
