import { defineMessage, defineMessages } from 'react-intl'

export const icCaseFiles = {
  heading: defineMessage({
    id: 'judicial.system.investigation_cases:case_files.heading',
    defaultMessage: 'Rannsóknargögn',
    description:
      'Notaður sem titill á rannsóknargagna skrefi í rannsóknarheimildum.',
  }),
  sections: {
    description: defineMessages({
      heading: {
        id:
          'judicial.system.investigation_cases:case_files.description.heading',
        defaultMessage: 'Meðferð gagna',
        description:
          'Notaður sem titill fyrir "meðferð gagna" hlutann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      list: {
        id:
          'judicial.system.investigation_cases:case_files.description.list#markdown',
        defaultMessage:
          '- Hér er hægt að hlaða upp rannsóknargögnum til að sýna dómara.\\n\\n- Gögnin eru eingöngu aðgengileg dómara í málinu og aðgengi að þeim lokast þegar dómari hefur úrskurðað.\\n\\n- Gögnin verða ekki lögð fyrir eða flutt í málakerfi dómstóls nema annar hvor aðilinn kæri úrskurðinn.',
        description:
          'Listi yfir það hvernig rannsóknargögn eru geymd og hver hefur aðgang að þeim.',
      },
    }),
    files: defineMessages({
      heading: {
        id: 'judicial.system.investigation_cases:case_files.files.heading',
        defaultMessage: 'Rannsóknargögn',
        description:
          'Notaður sem titill fyrir "rannsóknargögn" hlutann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      introduction: {
        id: 'judicial.system.investigation_cases:case_files.files.introduction',
        defaultMessage:
          'Gögnin í pakkanum hér fyrir neðan munu liggja frammi í þinghaldinu.',
        description:
          'Notaður sem skýring fyrir "rannsóknargögn" hlutann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      label: {
        id: 'judicial.system.investigation_cases:case_files.files.label',
        defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
        description:
          'Notaður sem titill í "rannsóknargögn" skjalaboxi á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      buttonLabel: {
        id: 'judicial.system.investigation_cases:case_files.files.buttonLabel',
        defaultMessage: 'Velja skjöl til að hlaða upp',
        description:
          'Notaður sem titill í "velja gögn til að hlaða upp" takka á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
    }),
    policeCaseFiles: defineMessages({
      heading: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.heading',
        defaultMessage: 'Gögn úr LÖKE-máli {policeCaseNumber}',
        description:
          'Notaður sem titill fyrir "LOKE" gagnapakkann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.tooltip',
        defaultMessage:
          'Ef krafan var stofnuð í gegnum LÖKE er hægt að sjá öll skjöl úr málinu sem hafa verið merkt sem rannsóknargögn í LÖKE í listanum hér fyrir neðan, og velja þau beint inn með takkanum Hlaða upp.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "gögn úr LÖKE-máli ..." titil á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      introduction: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.introduction',
        defaultMessage:
          'Til að gögn úr þessum lista verði hluti af gagnapakka málsins þarf að velja þau og smella á Hlaða upp.',
        description:
          'Notaður sem skýring fyrir "LOKE" gagnapakkann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      selectAllLabel: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.select_all_label',
        defaultMessage: 'Velja allt',
        description:
          'Notaður sem texti fyrir "Velja allt" valmöguleikann í LÖKE gagnapakkanum á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      caseNotFoundInLOKEMessage: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.case_not_found_in_loke_message',
        defaultMessage: 'Þessi krafa var ekki stofnuð í gegnum LÖKE',
        description:
          'Notaður sem villuskilaboð í LÖKE gagnapakkanum á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      noFilesFoundInLOKEMessage: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.no_files_found_in_loke_message',
        defaultMessage: 'Engin skjöl fundust fyrir kröfuna í LÖKE',
        description:
          'Notaður sem villuskilaboð í LÖKE gagnapakkanum á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      allFilesUploadedMessage: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.all_files_uploaded',
        defaultMessage: 'Öllum skjölum hefur verið hlaðið upp',
        description:
          'Notaður sem skilaboð þegar öllum skjölum hefur verið hlaðið upp í LÖKE gagnapakkanum á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      uploadButtonLabel: {
        id:
          'judicial.system.investigation_cases:case_files.police_case_files.upload_button_label',
        defaultMessage: 'Hlaða upp',
        description:
          'Notaður sem texti í "hlaða upp" takka í LÖKE gagnapakkanum á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
    }),
    comments: defineMessages({
      heading: {
        id: 'judicial.system.investigation_cases:case_files.comments.heading',
        defaultMessage: 'Athugasemdir vegna rannsóknargagna',
        description:
          'Notaður sem titill fyrir "athugasemdir vegna rannsóknargagna" hlutann á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id: 'judicial.system.investigation_cases:case_files.comments.tooltip',
        defaultMessage:
          'Hér er hægt að skrá athugasemdir til dómara og dómritara varðandi rannsóknargögnin.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "athugasemdir vegna rannsóknargagna" titil á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      label: {
        id: 'judicial.system.investigation_cases:case_files.comments.label',
        defaultMessage: 'Skilaboð',
        description:
          'Notaður sem titill í "skilaboð" textaboxi á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:case_files.comments.placeholder',
        defaultMessage:
          'Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi gögnin?',
        description:
          'Notaður sem skýritexti í "skilaboð" textaboxi á rannsóknargagna skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
