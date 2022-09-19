import { defineMessages } from 'react-intl'

export const institutionApplicationMessages = {
  application: defineMessages({
    applicationName: {
      id: 'ia.application:application.name',
      defaultMessage: 'Umsókn um samstarf við Stafrænt Ísland',
      description: 'Application for collaboration with Stafrænt Ísland',
    },
    institutionName: {
      id: 'ia.application:application.institutionName',
      defaultMessage: 'Stafrænt Ísland',
      description: 'Application for collaboration institution name',
    },
  }),
  applicant: defineMessages({
    formName: {
      id: 'ia.application:form.name',
      defaultMessage: 'Verkefnaumsókn',
      description: 'Display name for application',
    },
    sectionLabel: {
      id: 'ia.application:applicant.section.label',
      defaultMessage: 'Upplýsingar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ia.application:applicant.section.title',
      defaultMessage: 'Upplýsingar um ráðuneyti eða stofnun',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ia.application:applicant.section.description',
      defaultMessage:
        'Stofnun eða ráðuneyti sem sækist eftir samstarfi við Stafrænt Ísland og málefnasvið sem verkefnið tilheyrir. ',
      description: 'Section description',
    },
    institutionSubtitle: {
      id: 'ia.application:applicant.institution.subTitle',
      defaultMessage: 'Hvaða ráðuneyti eða stofnun sækir um samstarf?',
      description: 'Subtitle for institution name formfield',
    },
    institutionLabel: {
      id: 'ia.application:applicant.institution.label',
      defaultMessage: 'Nafn á ráðuneyti eða stofnun',
      description: 'Form label for institution name formfield',
    },
    contactSubtitle: {
      id: 'ia.application:applicant.contact.subTitle',
      defaultMessage: 'Upplýsingar tengiliðs',
      description: 'Subtitle for contact formfields',
    },
    contactInstitutionEmailLabel: {
      id: 'ia.application:applicant.contact.InstitutionEmailLabel.label',
      defaultMessage: 'Aðalnetfang stofnunar',
      description: 'Form label for contact institution email formfield',
    },
    contactNameLabel: {
      id: 'ia.application:applicant.contact.name.label',
      defaultMessage: 'Nafn tengiliðs',
      description: 'Form label for contact name formfield',
    },
    contactPhoneLabel: {
      id: 'ia.application:applicant.contact.phone.label',
      defaultMessage: 'Símanúmer tengiliðs',
      description: 'Form label for contact phone formfield',
    },
    contactEmailLabel: {
      id: 'ia.application:applicant.contact.email.label',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Form label for contact email formfield',
    },
    contactAddButtonLabel: {
      id: 'ia.application:applicant.contact.addButtonLabel',
      defaultMessage: 'Bæta við tengilið',
      description: 'Button label for adding secondary contact',
    },

    secondaryContactSubtitle: {
      id: 'ia.application:applicant.secondaryContact.subTitle',
      defaultMessage: 'Upplýsingar tengiliðs 2',
      description: 'Subtitle for secondaryContact formfields',
    },
  }),
  project: defineMessages({
    sectionLabel: {
      id: 'ia.application:project.section.label',
      defaultMessage: 'Verkefnið',
      description: 'Section label',
    },
    subSectionLabel: {
      id: 'ia.application:project.subSection.label',
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Sub section label',
    },
    sectionTitle: {
      id: 'ia.application:project.section.title',
      defaultMessage: 'Verkefnið',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ia.application:project.section.description',
      defaultMessage:
        'Hér er hægt að fara í forsöguna og almennt lýsa þeirri hugmynd sem liggur að baki verkefninu.',
      description: 'Section description',
    },
    informationSubtitle: {
      id: 'ia.application:project.information.subTitle',
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Subtitle for project information formfields',
    },
    nameLabel: {
      id: 'ia.application:project.name.label',
      defaultMessage: 'Heiti verkefnis',
      description: 'Form label for project name formfield',
    },
    backgroundLabel: {
      id: 'ia.application:project.background.label',
      defaultMessage: 'Bakgrunnur verkefnis',
      description: 'Form label for project background formfield',
    },
    backgroundPlaceholder: {
      id: 'ia.application:project.background.placeholder',
      defaultMessage: 'Hver er forsaga og umfang verkefnisins í gófum dráttum?',
      description: 'Placeholder for project background formfield',
    },
    goalsLabel: {
      id: 'ia.application:project.goals.label',
      defaultMessage: 'Markmið verkefnis, ávinningur og markhópur',
      description: 'Form label for project goals formfield',
    },
    goalsPlaceholder: {
      id: 'ia.application:project.goals.placeholder',
      defaultMessage:
        'Hvað á að leysa með verkefninu? Hver er ávinningurinn og fyrir hvern? Hér væri gott að nota tölfræði ef hún liggur fyrir.',
      description: 'Placeholder for project goals formfield',
    },
    scopeLabel: {
      id: 'ia.application:project.scope.label',
      defaultMessage: 'Umfang (e. Scope) verkefins',
      description: 'Form label for project scope formfield',
    },
    scopePlaceholder: {
      id: 'ia.application:project.scope.placeholder',
      defaultMessage:
        'Hverjar eru grófar útlínur verkefnisins? Hvað telst hluti af því og hvað ekki?',
      description: 'Placeholder for project scope formfield',
    },
    financeLabel: {
      id: 'ia.application:project.finance.label',
      defaultMessage: 'Fjármögnun',
      description: 'Form label for project finance formfield',
    },
    financePlaceholder: {
      id: 'ia.application:project.finance.placeholder',
      defaultMessage: 'Hvert er framlag stofnunarinnar?',
      description: 'Placeholder for project finance formfield',
    },
    attachmentsSubtitle: {
      id: 'ia.application:project.attachment.subTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Subtitle for project attachment formfields',
    },
    attachmentsDescription: {
      id: 'ia.application:project.attachment.description',
      defaultMessage:
        'Ef búið er að útbúa þarfagreiningu fyrir verkefnið eða önnur skjöl sem þú vilt koma á framfæri. ',
      description: 'Description for project attachment formfields',
    },
    attachmentsUploadHeader: {
      id: 'ia.application:project.attachment.uploadHeader',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Upload header for project attachment formfields',
    },
    attachmentsUploadDescription: {
      id: 'ia.application:project.attachment.uploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Upload description for project attachment formfields',
    },
    attachmentsUploadButtonLabel: {
      id: 'ia.application:project.attachment.uploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Button label for uploading project attachment',
    },
  }),
  service: defineMessages({
    sectionLabel: {
      id: 'ia.application:service.section.label',
      defaultMessage: 'Þjónusta',
      description: 'Section label',
    },
    subSectionLabel: {
      id: 'ia.application:service.subSection.label',
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Sub section label',
    },
    sectionTitle: {
      id: 'ia.application:service.section.title',
      defaultMessage: 'Þjónusta',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ia.application:service.section.description',
      defaultMessage: `Þú getur nálgast nánar helstu upplýsingar um þjónustur á vef`,
      description: 'Section description',
    },
    informationSubtitle: {
      id: 'ia.application:service.information.subTitle',
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Subtitle for project information formfields',
    },
    nameLabel: {
      id: 'ia.application:service.name.label',
      defaultMessage: 'Heiti verkefnis',
      description: 'Form label for project name formfield',
    },
    backgroundLabel: {
      id: 'ia.application:service.background.label',
      defaultMessage: 'Bakgrunnur verkefnis',
      description: 'Form label for project background formfield',
    },
    backgroundPlaceholder: {
      id: 'ia.application:service.background.placeholder',
      defaultMessage: 'Hver er forsaga og umfang verkefnisins í gófum dráttum?',
      description: 'Placeholder for project background formfield',
    },
    goalsLabel: {
      id: 'ia.application:service.goals.label',
      defaultMessage: 'Markmið verkefnis, ávinningur og markhópur',
      description: 'Form label for project goals formfield',
    },
    goalsPlaceholder: {
      id: 'ia.application:service.goals.placeholder',
      defaultMessage:
        'Hvað á að leysa með verkefninu? Hver er ávinningurinn og fyrir hvern? Hér væri gott að nota tölfræði ef hún liggur fyrir.',
      description: 'Placeholder for project goals formfield',
    },
    scopeLabel: {
      id: 'ia.application:service.scope.label',
      defaultMessage: 'Umfang (e. Scope) verkefins',
      description: 'Form label for project scope formfield',
    },
    scopePlaceholder: {
      id: 'ia.application:service.scope.placeholder',
      defaultMessage:
        'Hverjar eru grófar útlínur verkefnisins? Hvað telst hluti af því og hvað ekki?',
      description: 'Placeholder for project scope formfield',
    },
    financeLabel: {
      id: 'ia.application:service.finance.label',
      defaultMessage: 'Fjármögnun',
      description: 'Form label for project finance formfield',
    },
    financePlaceholder: {
      id: 'ia.application:service.finance.placeholder',
      defaultMessage: 'Hvert er framlag stofnunarinnar?',
      description: 'Placeholder for project finance formfield',
    },
    attachmentsSubtitle: {
      id: 'ia.application:service.attachment.subTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Subtitle for project attachment formfields',
    },
    attachmentsDescription: {
      id: 'ia.application:service.attachment.description',
      defaultMessage:
        'Ef búið er að útbúa þarfagreiningu fyrir verkefnið eða önnur skjöl sem þú vilt koma á framfæri. ',
      description: 'Description for project attachment formfields',
    },
    attachmentsUploadHeader: {
      id: 'ia.application:service.attachment.uploadHeader',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Upload header for project attachment formfields',
    },
    attachmentsUploadDescription: {
      id: 'ia.application:service.attachment.uploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Upload description for project attachment formfields',
    },
    attachmentsUploadButtonLabel: {
      id: 'ia.application:service.attachment.uploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Button label for uploading project attachment',
    },
  }),
  constraints: defineMessages({
    subSectionLabel: {
      id: 'ia.application:constraints.subSection.label',
      defaultMessage: 'Þjónustur sem sótt er eftir',
      description: 'Sub section label',
    },
    sectionTitle: {
      id: 'ia.application:constraints.section.title',
      defaultMessage: 'Þjónustur sem sóst er eftir',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ia.application:constraints.section.description',
      defaultMessage:
        'Vinsamlegast veljið og útskýrið þau atriði sem taka þarf tillit til við framkvæmd og skipulag verkefnisins. Eru verkefninu einhverjar skorður settar? Þarf að yfirstíga einhverjar áskoranir og finna þeim úrlausn?',
      description: 'Section description',
    },

    constraintsMailLabel: {
      id: 'ia.application:applicant.constraints.mail.label',
      defaultMessage: 'Pósthólf',
      description: 'Form label for constraints technical formfield',
    },
    constraintsMailPlaceholder: {
      id: 'ia.application:applicant.constraints.mail.placeholder',
      defaultMessage: 's.s. upplýsingatæknistefna ríkisins eða stofnunarinnar',
      description: 'Form placeholder for constraints technical formfield',
    },
    constraintsLoginLabel: {
      id: 'ia.application:applicant.constraints.login',
      defaultMessage: 'Innskráningarþjónusta',
      description: 'Form label for constraints financial formfield',
    },
    constraintsLoginPlaceholder: {
      id: 'ia.application:applicant.constraints.login.placeholder',
      defaultMessage:
        's.s. takmörkun á útlögðum kostnaði, heildarkostnaði verkefnisins eða skorður um val á byrgjum.',
      description: 'Form placeholder for constraints financial formfield',
    },
    constraintsStraumurLabel: {
      id: 'ia.application:applicant.constraints.straumur.label',
      defaultMessage: 'Straumurinn',
      description: 'Form label for constraints moral formfield',
    },
    constraintsStraumurPlaceholder: {
      id: 'ia.application:applicant.constraints.straumur.placeholder',
      defaultMessage:
        's.s lög og reglur sem stofnunin starfar eftir sem taka þarf tillit til eða siðferðileg atriði um meðhöndlun og vinnslu upplýsinga.',
      description: 'Form placeholder for constraints moral formfield',
    },
    constraintsWebsiteLabel: {
      id: 'ia.application:applicant.constraints.website.label',
      defaultMessage: 'Vefsíða stofnunar',
      description: 'Form label for constraints time formfield',
    },
    constraintsWebsitePlaceholder: {
      id: 'ia.application:applicant.constraints.website.placeholder',
      defaultMessage:
        's.s. þörf á því að vinna verkefni innan ákveðins tímabils eða dagsetningar sem þarf að taka tillit til.',
      description: 'Form placeholder for constraints time formfield',
    },
    constraintsApplyingLabel: {
      id: 'ia.application:applicant.constraints.applying.label',
      defaultMessage: 'Umsóknarkerfi',
      description: 'Form label for constraints other formfield',
    },
    constraintsApplyingPlaceholder: {
      id: 'ia.application:applicant.constraints.applying.placeholder',
      defaultMessage: 'Stutt lýsing',
      description: 'Form placeholder for constraints other formfield',
    },

    constraintsmyPagesLabel: {
      id: 'ia.application:applicant.constraints.myPages.label',
      defaultMessage: 'Mínar síður',
      description: 'Form label for constraints other formfield',
    },
    constraintsmyPagesPlaceholder: {
      id: 'ia.application:applicant.constraints.myPages.placeholder',
      defaultMessage: 'Stutt lýsing',
      description: 'Form placeholder for constraints other formfield',
    },

    constraintsCertLabel: {
      id: 'ia.application:applicant.constraints.cert.label',
      defaultMessage: 'Skírteini',
      description: 'Form label for constraints other formfield',
    },
    constraintsCertPlaceholder: {
      id: 'ia.application:applicant.constraints.cert.placeholder',
      defaultMessage: 'Stutt lýsing',
      description: 'Form placeholder for constraints other formfield',
    },

    constraintsConsultLabel: {
      id: 'ia.application:applicant.constraints.consult.label',
      defaultMessage: 'Ráðgjöf',
      description: 'Form label for constraints other formfield',
    },
    constraintsConsultPlaceholder: {
      id: 'ia.application:applicant.constraints.consult.placeholder',
      defaultMessage: 'Stutt lýsing',
      description: 'Form placeholder for constraints other formfield',
    },
  }),
  stakeholders: defineMessages({
    subSectionLabel: {
      id: 'ia.application:stakeholders.subSection.label',
      defaultMessage: 'Hagsmunaaðilar',
      description: 'Sub section label',
    },
    sectionTitle: {
      id: 'ia.application:stakeholders.section.title',
      defaultMessage: 'Hlutverk og hagsmunaaðilar',
      description: 'Section title',
    },
    stakeholdersLabel: {
      id: 'ia.application:project.stakeholders.label',
      defaultMessage: 'Hagsmunaaðilar',
      description: 'Form label for project stakeholders formfield',
    },
    stakeholdersPlaceholder: {
      id: 'ia.application:project.stakeholders.placeholder',
      defaultMessage:
        'Hagsmunaaðilar geta verið notendur, stjórnendur, fyrirtækið, samfélagið',
      description: 'Placeholder for project stakeholders formfield',
    },
    roleLabel: {
      id: 'ia.application:project.role.label',
      defaultMessage: 'Hlutverk Stafræns Íslands',
      description: 'Form label for project role formfield',
    },
    rolePlaceholder: {
      id: 'ia.application:project.role.placeholder',
      defaultMessage:
        'Hvaða stuðningi er óskað eftir frá Stafrænu Íslandi? - Að hvaða verkhlutum er aðkomu Stafræns Íslands óskað?',
      description: 'Placeholder for project role formfield',
    },
    otherRolesLabel: {
      id: 'ia.application:project.otherRoles.label',
      defaultMessage: 'Önnur skilgreind hlutverk',
      description: 'Form label for project otherRoles formfield',
    },
    otherRolesPlaceholder: {
      id: 'ia.application:project.otherRoles.placeholder',
      defaultMessage:
        'Hvernig er eignarhaldi og ábyrgð á framkvæmd verkefnisins háttað hjá viðkomandi ráðuneyti eða stofnun? Hvaða hlutverki gegnir innsendandi umsóknar?',
      description: 'Placeholder for project role formfield',
    },
  }),
  review: defineMessages({
    sectionLabel: {
      id: 'ia.application:review.section.label',
      defaultMessage: 'Staðfesta upplýsingar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ia.application:review.section.title',
      defaultMessage: 'Verkefnið',
      description: 'Section title',
    },
    sectionDescription: {
      id: 'ia.application:review.section.description',
      defaultMessage:
        'Farðu vel yfir efnið áður en þú sendir inn umsóknina. Það flýtir fyrir afgreiðslu málsins hjá Stafrænu Íslandi ef umsóknin er skýr og hnitmiðuð.',
      description: 'Section description',
    },
    submitButtonLabel: {
      id: 'ia.application:review.submitButtonLabel',
      defaultMessage: 'Staðfesta Umsókn',
      description: 'Button label for submitting application',
    },
    termsOfServiceLabel: {
      id: 'ia.application:review.termsOfServiceLabel',
      defaultMessage: 'Skilmálar',
      description: 'Terms of service label for submitting application',
    },
    termsOfServiceText: {
      id: 'ia.application:review.termsOfServiceText',
      defaultMessage:
        'Þegar þjónustur Stafræns Íslands eru innleiddar og notaðar þá gilda þjónustuskilmálar viðkomandi kerfis/þjónustu',
      description: 'Terms of service for submitting application',
    },
  }),
  confirmation: defineMessages({
    sectionLabel: {
      id: 'ia.application:confirmation.section.label',
      defaultMessage: 'Umsókn staðfest',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ia.application:confirmation.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionInfoBulletFirst: {
      id: 'ia.application:confirmation.section.infoBullet.first',
      defaultMessage:
        'Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.',
      description: 'First information sentence, in bullet list',
    },
    sectionInfoBulletSecond: {
      id: 'ia.application:confirmation.section.infoBullet.second',
      defaultMessage:
        'Við verðum í sambandi ef okkur vantar frekari upplýsingar.',
      description: 'Second information sentence, in bullet list',
    },
    sectionInfoBulletThird: {
      id: 'ia.application:confirmation.section.infoBullet.third',
      defaultMessage:
        'Ef þú þarft frekari upplýsingar þá getur þú sent okkur tölvupóst á netfangið island@island.is',
      description: 'Third information sentence, in bullet list',
    },
  }),
  approved: defineMessages({
    sectionTitle: {
      id: 'ia.application:approved.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionDescription: {
      id: 'ia.application:approved.section.description',
      defaultMessage:
        'Við munum fara yfir umsóknina og sendum á þig svör innan tíðar. Við verðum í sambandi ef okkur vantar frekari upplýsingar. ',
      description: 'Section title',
    },
  }),
}
