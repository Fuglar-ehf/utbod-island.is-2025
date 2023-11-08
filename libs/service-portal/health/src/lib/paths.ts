export enum HealthPaths {
  HealthRoot = '/heilsa',
  HealthTherapies = '/heilsa/thjalfun',
  HealthPayments = '/heilsa/greidslur',
  HealthPaymentsWithHash = '/heilsa/greidslur:hash',
  HealthAidsAndNutrition = '/heilsa/hjalpartaeki-og-naering',
  HealthDentists = '/heilsa/tannlaeknar',
  HealthDentistRegistration = '/heilsa/tannlaeknar/skraning',
  HealthCenter = '/heilsa/heilusgaesla',
  HealthMedicine = '/heilsa/lyf',
  HealthMedicineCertificate = '/heilsa/lyf/:name/:id',
  HealthCenterRegistration = '/heilsa/heilsugaesla/skraning',
}
