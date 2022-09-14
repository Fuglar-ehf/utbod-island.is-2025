import { defineMessages } from 'react-intl'

export const coreMessages = defineMessages({
  buttonNext: {
    id: 'application.system:button.next',
    defaultMessage: 'Halda áfram',
    description: 'Next',
  },
  buttonBack: {
    id: 'application.system:button.back',
    defaultMessage: 'Til baka',
    description: 'Back',
  },
  buttonSubmit: {
    id: 'application.system:button.submit',
    defaultMessage: 'Senda',
    description: 'Submit',
  },
  reviewButtonSubmit: {
    id: 'application.system:reviewButton.submit',
    defaultMessage: 'Vista',
    description: 'Save',
  },
  buttonApprove: {
    id: 'application.system:button.approve',
    defaultMessage: 'Samþykkja',
    description: 'Approve button copy',
  },
  buttonReject: {
    id: 'application.system:button.reject',
    defaultMessage: 'Hafna',
    description: 'Reject button copy',
  },
  buttonEdit: {
    id: 'application.system:button.edit',
    defaultMessage: 'Breyta',
    description: 'Edit button for review screen and so on',
  },
  cardButtonInProgress: {
    id: 'application.system:card.button.inProgress',
    defaultMessage: 'Opna umsókn',
    description: 'Button label when application is in progress',
  },
  cardButtonNotStarted: {
    id: 'application:card.button.notStarted',
    defaultMessage: 'Hefja umsókn',
    description: 'Button label when application is not started',
  },
  cardButtonComplete: {
    id: 'application.system:card.button.complete',
    defaultMessage: 'Skoða yfirlit',
    description: 'Button label when application is complete',
  },
  externalDataTitle: {
    id: 'application.system:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
    description:
      'The following data will be retrieved electronically with your consent',
  },
  externalDataAgreement: {
    id: 'application.system:externalData.agreement',
    defaultMessage: 'Ég samþykki',
    description: 'I agree',
  },
  updateOrSubmitError: {
    id: 'application.system:submit.error',
    defaultMessage: 'Eitthvað fór úrskeiðis: {error}',
    description: 'Error message on submit: {error}',
  },
  globalErrorTitle: {
    id: 'application.system:boundary.error.title',
    defaultMessage: 'Úps! Eitthvað fór úrskeiðis',
    description: 'Oops! Something went wrong',
  },
  globalErrorMessage: {
    id: 'application.system:boundary.error.message',
    defaultMessage:
      'Fyrirgefðu! Eitthvað fór rosalega úrskeiðis og við erum að skoða það',
    description:
      'Sorry! Something went terribly wrong and we are looking into it',
  },
  userRoleError: {
    id: 'application.system:user.role.error',
    defaultMessage:
      'Innskráður notandi hefur ekki hlutverk í þessu umsóknarástandi',
    description:
      'Logged in user does not have a role in this application state',
  },
  notFoundTitle: {
    id: 'application.system:notFound',
    defaultMessage: 'Umsókn finnst ekki',
    description: 'Application not found',
  },
  notFoundSubTitle: {
    id: 'application.system:notFound.message',
    defaultMessage: 'Engin umsókn fannst á þessari slóð.',
    description: 'No application was found at this URL.',
  },
  notFoundApplicationType: {
    id: 'application.system:notFound.application.type',
    defaultMessage: 'Þessi gerð umsókna er ekki til',
    description: 'This type of application does not exist',
  },
  notFoundApplicationTypeMessage: {
    id: 'application.system:notFound.application.message',
    defaultMessage: 'Engin umsókn er til af gerðinni: {type}',
    description: 'There is no application of the type: {type}',
  },
  createErrorApplication: {
    id: 'application.system:create.error.application',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Something went wrong',
  },
  createErrorApplicationMessage: {
    id: 'application.system:create.error.application.message',
    defaultMessage: 'Ekki tókst að búa til umsókn af gerðinni: {type}',
    description: 'Failed to create application of type: {type}',
  },
  applications: {
    id: 'application.system:applications',
    defaultMessage: 'Þínar umsóknir',
    description: 'Your applications',
  },
  newApplication: {
    id: 'application.system:new.application',
    defaultMessage: 'Ný umsókn',
    description: 'New application',
  },
  tagsInProgress: {
    id: 'application.system:tags.inProgress',
    defaultMessage: 'Í ferli',
    description: 'In progress status for an application',
  },
  tagsDone: {
    id: 'application.system:tags.completed',
    defaultMessage: 'Lokið',
    description: 'Done status for an application',
  },
  tagsRejected: {
    id: 'application.system:tags.rejected',
    defaultMessage: 'Hafnað',
    description: 'Rejected status for an application',
  },
  tagsRequiresAction: {
    id: 'application.system:tags.requiresAction',
    defaultMessage: 'Krefst aðgerða',
    description: 'Requires action',
  },
  thanks: {
    id: 'application.system:thanks',
    defaultMessage: 'Takk fyrir',
    description: 'Thank you',
  },
  thanksDescription: {
    id: 'application.system:thanks.description',
    defaultMessage:
      'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
    description:
      'Your application is complete. The application has progressed in the process.',
  },
  notLoggedIn: {
    id: 'application.system:not.logged.id',
    defaultMessage: 'Þú þarft að vera skrá þig inn.',
    description: 'You need to be logged in.',
  },
  notLoggedInDescription: {
    id: 'application.system:not.logged.id.description',
    defaultMessage: 'Til að halda áfram umsóknarferli þarftu að skrá þig inn.',
    description:
      'To continue the application process, you will need to sign in.',
  },
  radioYes: {
    id: 'application.system:radio.option.yes',
    defaultMessage: 'Já',
    description: 'Yes option value',
  },
  radioNo: {
    id: 'application.system:radio.option.no',
    defaultMessage: 'Nei',
    description: 'No option value',
  },
  paymentPollingIndicator: {
    id: 'application.system:core.payment.pollingIndicator',
    defaultMessage: 'Bíð staðfestingar frá greiðsluveitu',
    description:
      'Text indicating we are waiting for confirmation from 3rd party payment gateway',
  },
  deleteApplicationDialogTitle: {
    id: 'application.system:delete.application.dialog.title',
    defaultMessage: 'Eyða umsókn',
    description: 'Delete application dialog title',
  },
  deleteApplicationDialogDescription: {
    id: 'application.system:delete.application.dialog.description',
    defaultMessage: 'Ertu viss um að þú viljir eyða þessari umsókn?',
    description: 'Delete application dialog description',
  },
  deleteApplicationDialogConfirmLabel: {
    id: 'application.system:delete.application.dialog.confirm',
    defaultMessage: 'Já, eyða',
    description: 'Delete application dialog confirm',
  },
  deleteApplicationDialogCancelLabel: {
    id: 'application.system:delete.application.dialog.cancel',
    defaultMessage: 'Hætta við',
    description: 'Delete application dialog cancel',
  },
})

export const coreErrorMessages = defineMessages({
  defaultError: {
    id: 'application.system:core.default.error',
    defaultMessage: 'Ógilt gildi',
    description: 'Generic invalid value error message',
  },
  errorDataProvider: {
    id: 'application.system:core.error.dataProvider',
    defaultMessage: 'Úps! Eitthvað fór úrskeiðis við að sækja gögnin þín',
    description: 'Oops! Something went wrong when fetching your data',
  },
  fileUpload: {
    id: 'application.system:core.error.file.upload',
    defaultMessage: 'Villa kom upp við að hlaða inn einni eða fleiri skrám.',
    description: 'Error message when upload file fails',
  },
  fileRemove: {
    id: 'application.system:core.error.file.remove',
    defaultMessage: 'Villa kom upp við að fjarlægja skrána.',
    description: 'Error message when deleting a file fails',
  },
  fileMaxSizeLimitExceeded: {
    id: 'application.system:core.error.file.maxSizeLimitExceeded',
    defaultMessage:
      'Skráin er of stór. Hægt er að hlaða inn skrám sem eru {maxSizeInMb}MB eða minni.',
    description: 'Error message when file size exceeds max size limit',
  },
  fileInvalidExtension: {
    id: 'application.system:core.error.file.invalidExtension',
    defaultMessage:
      'Skráin er ekki í réttu sniði. Hægt er að hlaða inn skrám með endingunum {accept}.',
    description: 'Error message when file extension is invalid',
  },
  isMissingTokenErrorTitle: {
    id: 'application.system:core.missing.token.error.title',
    defaultMessage: 'Úps! Enginn tóki fannst',
    description: 'Oops! No token found',
  },
  isMissingTokenErrorDescription: {
    id: 'application.system:core.missing.token.error.description',
    defaultMessage: 'Ekki er hægt að tengja umsókn án auðkenningartóka',
    description: 'It is not possible to open an application without a token',
  },
  couldNotAssignApplicationErrorTitle: {
    id: 'application.system:could.not.assign.application.error.title',
    defaultMessage: 'Úps! Ekki tókst að tengjast umsókn',
    description: 'Oops! Could not assign to the application',
  },
  couldNotAssignApplicationErrorDescription: {
    id: 'application.system:could.not.assign.application.error.description',
    defaultMessage:
      'Villa koma upp við að tengjast umsókn og hefur hún verið skráð',
    description:
      'There are errors related to the application and it has been reported',
  },
  missingAnswer: {
    id: 'application.system:missing.answer',
    defaultMessage: 'Svar vantar',
    description: 'Copy when answer is missing',
  },
  failedDataProvider: {
    id: 'application.system:fetch.data.error',
    defaultMessage: 'Villa kom upp við að sækja gögn',
    description: 'Default error when dataprovider fails',
  },
  failedDataProviderSubmit: {
    id: 'application.system:fetch.data.failedDataProviderSubmit',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description:
      'Error message for dataprovider screen when one of the dataproviders fails',
  },
  paymentSubmitFailed: {
    id: 'application.system:core.payment.submitTitle',
    defaultMessage: 'Sending umsóknar mistókst',
    description: 'Message indicating submission after payment failed',
  },
  paymentSubmitRetryButtonCaption: {
    id: 'application.system:core.payment.retryCaption',
    defaultMessage: 'Reyna aftur',
    description: 'Caption for the retry button',
  },
  paymentStatusError: {
    id: 'application.system:core.payment.statusError',
    defaultMessage: 'Tókst ekki að sækja stöðu greiðslu',
    description: 'Message indicating failure to fetch payment status',
  },
  invalidNationalId: {
    id: 'application.system:core.payment.invalidNationalId',
    defaultMessage: 'Ógild kennitala',
    description: 'Message indicating national id is invalid',
  },
  noCompanySearchResultsFoundTitle: {
    id: 'application.system:core.payment.noCompanySearchResultsFoundTitle',
    defaultMessage: 'Engar niðurstöður fundust hjá fyrirtækjaskrá',
    description: 'Title error message when no company search result is found',
  },
  noCompanySearchResultsFoundMessage: {
    id: 'application.system:core.payment.noCompanySearchResultsFoundMessage',
    defaultMessage: 'Vinsamlegast athugaðu hvort að rétt var slegið inn.',
    description: 'Error Message when no company search result is found',
  },
})

export const coreDelegationsMessages = defineMessages({
  delegationScreenTitle: {
    id: 'application.system:core.delegations.delegationScreenTitle',
    defaultMessage: 'Umsóknaraðili',
    description: 'Delegations screen title',
  },
  delegationScreenSubtitle: {
    id: 'application.system:core.delegations.delegationScreenSubtitle',
    defaultMessage:
      'Hér getur þú valið fyrir hvaða einstakling þú vilt hefja umsókn fyrir.',
    description: 'Delegations screen subtitle for new application',
  },
  delegationActionCardText: {
    id: 'application.system:core.delegations.delegationActionCardText',
    defaultMessage: 'Kennitala: ',
    description: 'Delegations Screen Card Text',
  },
  delegationActionCardButton: {
    id: 'application.system:core.delegations.delegationActionCardButton',
    defaultMessage: 'Hefja umsókn',
    description: 'Delegations Screen Card Button/Link',
  },
  delegationScreenTitleForOngoingApplication: {
    id:
      'application.system:core.delegations.delegationScreenTitleForOngoingApplication',
    defaultMessage: 'Umsókn um stæðiskort',
    description: 'Delegations screen title for ongoing application',
  },
  delegationScreenSubtitleForOngoingApplication: {
    id:
      'application.system:core.delegations.delegationScreenSubtitleForOngoingApplication',
    defaultMessage:
      'Hér getur þú haldið áfram umsókn fyrir viðkomandi aðila. Ef þú þarft að breyta umsóknaraðila skaltu hefja nýja umsókn.',
    description: 'Delegations screen subtitle for ongoing application',
  },
  delegationScreenNationalId: {
    id: 'application.system:core.delegations.delegationScreenNationalId',
    defaultMessage: 'Kennitala: ',
    description: 'Delegations screen national Id',
  },
  delegationScreenTitleApplicationNoDelegationSupport: {
    id:
      'application.system:core.delegations.delegationScreenTitleApplicationNoDelegationSupport',
    defaultMessage: 'Umsókn styður ekki umboð',
    description:
      'Delegations error application does not support delegations title',
  },
  delegationScreenSubtitleApplicationNoDelegationSupport: {
    id:
      'application.system:core.delegations.delegationScreenSubtitleApplicationNoDelegationSupport',
    defaultMessage: 'Vinsamlegast skiptu um notanda til að halda áfram.',
    description:
      'Delegations error application does not support delegations title',
  },
  delegationErrorButton: {
    id: 'application.system:core.delegations.delegationErrorButton',
    defaultMessage: 'Skipta um notanda',
    description: 'Delegations Screen Card Button/Link',
  },
})
