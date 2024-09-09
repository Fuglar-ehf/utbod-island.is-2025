/* eslint-disable local-rules/disallow-kennitalas */

import { Group } from '../../models/group.model'
import { Item } from '../../models/item.model'

export type Process = {
  state: State
}

export type State = {
  code: string
  title: string
  date?: Date
  icon?: 'attention' | 'checkmark' | 'error'
}

export type Items = {
  label: string
  value?: string
  link?: string
  action?: {
    label: string
    url: string
    type?: string
  }
}

export type Actions = {
  type: 'file' | 'url' | 'inbox'
  title: string
  data?: string
}

export type Lawyers = {
  name: string
  nationalId: string
  practice: string
}

type Cases = {
  texts?: {
    intro?: string
    footnote?: string
  }
  actions?: Actions[]
  data: {
    id: string
    caseNumber: string
    caseNumberTitle: string
    acknowledged?: boolean
    type: string
    status: string
    groups: {
      label: string
      items: Items[]
    }[]
  }
}

export type Subpoena = {
  texts?: {
    intro?: string
    confirmation?: string
    description?: string
    claim?: string
  }
  actions?: Actions[]
  data: {
    id: string
    acknowledged?: boolean
    chosenDefender?: string // ef null = birta lista ef ekki, birta breyta
    groups: Array<Group>
  }
}

export const listCases = (locale: 'is' | 'en') => {
  const casesEN: Cases[] = [
    {
      actions: [
        {
          title: 'Download charge',
          type: 'file',
          data: '123',
        },
      ],
      data: {
        id: '2f2c4944-04a9-47fe-b02d-faf278af558a',
        caseNumber: 'S-0000',
        caseNumberTitle: 'Case number S-0000/2022',
        type: 'Charge',
        status: 'On the agenda',
        acknowledged: undefined,
        groups: [
          {
            label: 'Defender',
            items: [
              {
                label: 'Name',
                value: 'Lísa Jónsdóttir',
              },
              {
                label: 'National ID',
                value: '010203-6789',
              },
              {
                label: 'Legal residence',
                value: 'Hagamelur 92, 107 Reykjavík',
              },
              {
                label: 'Subpoena sent',
                value: '6.maí 2022',
              },
            ],
          },
          {
            label: 'Defendant',
            items: [
              {
                label: 'Name',
                value: 'Andri Valur Ívarsson',
              },
              {
                label: 'Email',
                value: 'andri.ivar@fyrirtaeki.is',
                link: 'mailto:',
              },
              {
                label: 'Telephone',
                value: '555 4789',
                link: 'tel:',
              },
            ],
          },
          {
            label: 'Case information',
            items: [
              {
                label: 'Type',
                value: 'Charge',
              },
              {
                label: 'Case number district court',
                value: 'S-999/2022',
              },
              {
                label: 'Court',
                value: 'District court of Reykjavík',
              },
              {
                label: 'Judge',
                value: 'Halldór Jón Sigurðsson',
              },
              {
                label: 'Office',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Accuser',
                value: 'Katrín Ólöf Einarsdóttir',
              },
            ],
          },
        ],
      },
    },
  ]

  const cases: Cases[] = [
    {
      actions: [
        {
          title: 'Hlaða niður ákæru',
          type: 'file',
          data: '123',
        },
      ],
      data: {
        id: '2f2c4944-04a9-47fe-b02d-faf278af558a',
        caseNumber: 'S-0000',
        caseNumberTitle: 'Málsnúmer S-0000/2022',
        type: 'Ákæra',
        status: 'Á dagskrá',
        acknowledged: undefined,
        groups: [
          {
            label: 'Varnaraðili',
            items: [
              {
                label: 'Nafn',
                value: 'Lísa Jónsdóttir',
              },
              {
                label: 'Kennitala',
                value: '010203-6789',
              },
              {
                label: 'Lögheimili',
                value: 'Hagamelur 92, 107 Reykjavík',
              },
              {
                label: 'Fyrirkall sent',
                value: '6.maí 2022',
              },
            ],
          },
          {
            label: 'Verjandi',
            items: [
              {
                label: 'Nafn',
                value: 'Andri Valur Ívarsson',
              },
              {
                label: 'Netfang',
                value: 'andri.ivar@fyrirtaeki.is',
                link: 'mailto:',
              },
              {
                label: 'Símanúmer',
                value: '555 4789',
                link: 'tel:',
              },
            ],
          },
          {
            label: 'Málsupplýsingar',
            items: [
              {
                label: 'Tegund',
                value: 'Ákæra',
              },
              {
                label: 'Málsnúmer héraðsdóms',
                value: 'S-999/2022',
              },
              {
                label: 'Dómstóll',
                value: 'Héraðsdómur Reykjavíkur',
              },
              {
                label: 'Dómari',
                value: 'Halldór Jón Sigurðsson',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
            ],
          },
        ],
      },
    },
    {
      actions: [
        {
          title: 'Hlaða niður ákæru',
          type: 'file',
          data: '123',
        },
      ],
      data: {
        id: '1234',
        caseNumber: 'S-1111',
        caseNumberTitle: 'Málsnúmer S-1111/2022',
        type: 'Ákæra',
        status: 'Á dagskrá',
        acknowledged: true,
        groups: [
          {
            label: 'Varnaraðili',
            items: [
              {
                label: 'Nafn',
                value: 'Lísa Jónsdóttir',
              },
              {
                label: 'Kennitala',
                value: '010203-6789',
              },
              {
                label: 'Lögheimili',
                value: 'Hagamelur 92, 107 Reykjavík',
              },
              {
                label: 'Fyrirkall sent',
                value: '6.maí 2022',
              },
            ],
          },
          {
            label: 'Verjandi',
            items: [
              {
                label: 'Nafn',
                value: 'Andri Valur Ívarsson',
              },
              {
                label: 'Netfang',
                value: 'andri.ivar@fyrirtaeki.is',
                link: 'mailto:',
              },
              {
                label: 'Símanúmer',
                value: '555 4789',
                link: 'tel:',
              },
            ],
          },
          {
            label: 'Málsupplýsingar',
            items: [
              {
                label: 'Tegund',
                value: 'Ákæra',
              },
              {
                label: 'Málsnúmer héraðsdóms',
                value: 'S-999/2022',
              },
              {
                label: 'Dómstóll',
                value: 'Héraðsdómur Reykjavíkur',
              },
              {
                label: 'Dómari',
                value: 'Halldór Jón Sigurðsson',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
            ],
          },
        ],
      },
    },
    {
      actions: [
        {
          title: 'Hlaða niður ákæru',
          type: 'file',
          data: '123',
        },
      ],
      data: {
        id: '12345',
        caseNumber: 'S-2222',
        caseNumberTitle: 'Málsnúmer S-2222/2022',
        type: 'Ákæra',
        status: 'Á dagskrá',
        acknowledged: false,
        groups: [
          {
            label: 'Varnaraðili',
            items: [
              {
                label: 'Nafn',
                value: 'Lísa Jónsdóttir',
              },
              {
                label: 'Kennitala',
                value: '010203-6789',
              },
              {
                label: 'Lögheimili',
                value: 'Hagamelur 92, 107 Reykjavík',
              },
              {
                label: 'Fyrirkall sent',
                value: '6.maí 2022',
              },
            ],
          },
          {
            label: 'Verjandi',
            items: [
              {
                label: 'Nafn',
                value: 'Andri Valur Ívarsson',
              },
              {
                label: 'Netfang',
                value: 'andri.ivar@fyrirtaeki.is',
                link: 'mailto:',
              },
              {
                label: 'Símanúmer',
                value: '555 4789',
                link: 'tel:',
              },
            ],
          },
          {
            label: 'Málsupplýsingar',
            items: [
              {
                label: 'Tegund',
                value: 'Ákæra',
              },
              {
                label: 'Málsnúmer héraðsdóms',
                value: 'S-999/2022',
              },
              {
                label: 'Dómstóll',
                value: 'Héraðsdómur Reykjavíkur',
              },
              {
                label: 'Dómari',
                value: 'Halldór Jón Sigurðsson',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
            ],
          },
        ],
      },
    },
  ]

  return locale === 'is' ? cases : casesEN
}

export const getCase = (id: string, locale: 'is' | 'en') => {
  const cases = listCases(locale)

  const detailedCase = cases.find((x) => x.data.id === id) ?? null

  const courtCaseDetail = {
    courtCaseDetail: detailedCase,
  }
  return { data: detailedCase, loading: false, error: false }
}

const lawyers: Lawyers[] = [
  {
    name: 'Halldór Halldórsson',
    nationalId: '1010203090',
    practice: 'Paxma',
  },
  {
    name: 'Agnes Guðmundsdóttir',
    nationalId: '1004303090',
    practice: 'Lögfræðingar Reykjavíkur',
  },
  {
    name: 'Jóhann Atli Jóhannesson',
    nationalId: '1012203090',
    practice: 'Logos',
  },
]

export const getLawyers = () => {
  const lwrs = { items: lawyers }
  return {
    data: lwrs,
    loading: false,
    error: false,
  }
}
export const getSubpoena = (id: string) => {
  const subpoenas: Subpoena[] = [
    {
      texts: {
        intro: 'Héraðsdómur Reykjavíkur, Dómhúsið við Lækjartorg, Reykjavík.',
        confirmation: 'Staðfesting á móttöku hefur verið send á dómstóla',
        description:
          'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi. Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum. Birtingarfrestur er þrír sólarhringar.',
        claim:
          'Ég hef jafnframt veitt viðtöku greinargerð/-um vegna bótakröfu/-krafna í málinu.',
      },
      actions: [
        {
          type: 'file',
          title: 'Hala niður PDF',
          data: 'þetta er pdf',
        },
      ],
      data: {
        id: '2f2c4944-04a9-47fe-b02d-faf278af558a',
        acknowledged: undefined,

        groups: [
          {
            label: 'Mál nr. S-2023/2022',
            items: [
              {
                label: 'Dagsetning',
                value: '6. maí 2022',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
              {
                label: 'Ákærði',
                value: 'Jón Jónsson',
              },
              {
                label: 'Verður tekið fyrir á dómþingi',
                value: '1.6.2022 kl. 14:15',
              },
              {
                label: 'Staður',
                value: 'Héraðsdómur Reykjavíkur, Dómsalur 202',
              },
              {
                label: 'Dómsathöfn',
                value: 'Þingfesting',
              },
            ] as Array<Item>,
          },
        ],
      },
    },
    {
      texts: {
        intro: 'Héraðsdómur Reykjavíkur, Dómhúsið við Lækjartorg, Reykjavík.',
        confirmation: 'Staðfesting á móttöku hefur verið send á dómstóla',
        description:
          'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi. Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum. Birtingarfrestur er þrír sólarhringar.',
        claim:
          'Ég hef jafnframt veitt viðtöku greinargerð/-um vegna bótakröfu/-krafna í málinu.',
      },
      actions: [
        {
          type: 'file',
          title: 'Hala niður PDF',
          data: 'þetta er pdf',
        },
      ],
      data: {
        id: '1234',
        acknowledged: true,

        groups: [
          {
            label: 'Mál nr. S-2023/2022',
            items: [
              {
                label: 'Dagsetning',
                value: '6. maí 2022',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
              {
                label: 'Ákærði',
                value: 'Jón Jónsson',
              },
              {
                label: 'Verður tekið fyrir á dómþingi',
                value: '1.6.2022 kl. 14:15',
              },
              {
                label: 'Staður',
                value: 'Héraðsdómur Reykjavíkur, Dómsalur 202',
              },
              {
                label: 'Dómsathöfn',
                value: 'Þingfesting',
              },
            ],
          },
        ],
      },
    },
    {
      texts: {
        intro: 'Héraðsdómur Reykjavíkur, Dómhúsið við Lækjartorg, Reykjavík.',
        confirmation: 'Staðfesting á móttöku hefur verið send á dómstóla',
        description:
          'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi. Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum. Birtingarfrestur er þrír sólarhringar.',
        claim:
          'Ég hef jafnframt veitt viðtöku greinargerð/-um vegna bótakröfu/-krafna í málinu.',
      },
      actions: [
        {
          type: 'file',
          title: 'Hala niður PDF',
          data: 'þetta er pdf',
        },
      ],
      data: {
        id: '12345',
        acknowledged: false,

        groups: [
          {
            label: 'Mál nr. S-2023/2022',
            items: [
              {
                label: 'Dagsetning',
                value: '6. maí 2022',
              },
              {
                label: 'Embætti',
                value: 'Lögreglustjórinn á höfuðborgarsvæðinu',
              },
              {
                label: 'Ákærandi',
                value: 'Katrín Ólöf Einarsdóttir',
              },
              {
                label: 'Ákærði',
                value: 'Jón Jónsson',
              },
              {
                label: 'Verður tekið fyrir á dómþingi',
                value: '1.6.2022 kl. 14:15',
              },
              {
                label: 'Staður',
                value: 'Héraðsdómur Reykjavíkur, Dómsalur 202',
              },
              {
                label: 'Dómsathöfn',
                value: 'Þingfesting',
              },
            ],
          },
        ],
      },
    },
  ]

  const subpoena = subpoenas.find((x) => x.data.id === id) ?? null

  return { data: subpoena, loading: false, error: false }
}
