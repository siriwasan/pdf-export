import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdf from './pdf-report';

const maxNvLength = 6;
const maxGraftLength = 3;
const maxPciLength = 3;
const maxDeviceLength = 10;
const maxFollowUpLength = 2;

export class CathPciReport {
  data: any = null;
  content: pdfMake.Content;

  constructor(data: any) {
    this.data = data;
  }

  public async getDocDefinition(): Promise<pdfMake.TDocumentDefinitions> {
    const doc = {
      info: {
        title: 'BDMS CathPCI Registry v1.0',
        author: 'john doe',
        subject: 'Data Collection Form',
        keywords: 'BDMS CAG PCI'
      },
      header(currentPage, pageCount, pageSize) {
        return [
          { text: 'simple text', fontSize: 4, color: 'white' }
          // { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
        ];
      },
      footer(currentPage, pageCount, pageSize) {
        // return { text: currentPage.toString() + ' of ' + pageCount, alignment: 'center' };
        // return {
        //   table: {
        //     widths: '*',
        //     body: [['test\ntest\ntest\ntest\ntest']]
        //   }
        // };
        return pdf.columns(
          pdf.text('BDMS CathPCI Registry v1.0', { alignment: 'left', margin: [40, 0, 0, 0] }),
          pdf.text(currentPage.toString() + ' of ' + pageCount, { alignment: 'center' }),
          pdf.text('Printed ' + new Date().toLocaleString(), {
            alignment: 'right',
            margin: [0, 0, 35, 0],
            italics: true
          })
        );
      },
      content: await this.getContent(),
      styles: pdf.styles,
      defaultStyle: pdf.defaultStyle
      // userPassword: '123',
      // ownerPassword: '123456'
    };
    // tslint:disable-next-line: no-string-literal
    doc['watermark'] = { text: 'INCOMPLETED', fontSize: 72, angle: 315, color: '#cccccc' };

    return doc;
  }

  private async getContent(): Promise<pdfMake.Content[]> {
    return [
      {
        table: {
          widths: ['*'],
          heights: [30],
          headerRows: 1,
          body: [
            [
              {
                columns: [
                  {
                    image: await pdf.imageToBase64('assets/img/bangkok-hospital.png'),
                    fit: [105, 105],
                    margin: [0, -5, 0, 0],
                    width: 120
                  },
                  { text: 'Data Collection Form', bold: true, alignment: 'center' },
                  { text: 'CathPCI Registry', alignment: 'center', width: 155 }
                ],
                style: 'header'
              }
            ],
            // page 1
            ...this.sectionA(),
            ...this.sectionB(),
            ...this.sectionC(),
            // page 2
            ...this.sectionD(),
            // page 3
            ...this.sectionE(),
            ...this.sectionF(),
            // page 4
            ...this.sectionG(),
            // page 5
            ...this.sectionH(),
            // page 6-7
            ...this.sectionI(),
            // page 8
            ...this.sectionJ(),
            ...this.sectionK(),
            // page 9
            ...this.sectionL(),
            // page 10-12
            ...this.sectionM(),
            // page 12
            ...(await this.appendix())
          ]
        }
      }
      // { text: 'Siriwasan', absolutePosition: { x: 300, y: 300 } },
      // { text: 'Siriwasan', relativePosition: { x: 200, y: 200 } }
    ];
  }

  private sectionA(): pdfMake.Content[][] {
    return [
      [pdf.section('A. DEMOGRAPHICS')],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.blockStyle(
              { lineHeight: 1.1 },
              pdf.field('Registry Id'),
              pdf.input(this.data.sectionA.registryId)
            ),
            pdf.blockStyle({ lineHeight: 1.1 }, pdf.field('HN'), pdf.input(this.data.sectionA.HN)),
            pdf.blockStyle({ lineHeight: 1.1 }, pdf.field('AN'), pdf.input(this.data.sectionA.AN))
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Last Name', { annotation: '2000' }),
              pdf.inputThai(this.data.sectionA.LastName)
            ),
            pdf.block(
              pdf.field('First Name', { annotation: '2010' }),
              pdf.inputThai(this.data.sectionA.FirstName)
            ),
            pdf.block(
              pdf.field('Middle Name', { annotation: '2020' }),
              pdf.inputThai(this.data.sectionA.MidName)
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Birth Date', { annotation: '2050' }),
              pdf.date(this.data.sectionA.DOB)
            ),
            pdf.block(pdf.field('Age'), pdf.input(this.data.sectionA.Age), ' years'),
            pdf.block(
              pdf.field('Sex', { annotation: '2060' }),
              pdf.tab(),
              pdf.radio('Male', this.data.sectionA.Sex),
              pdf.tab(),
              pdf.radio('Female', this.data.sectionA.Sex)
            )
          ),
          pdf.block(pdf.field('SSN', { annotation: '2030' }), pdf.input(this.data.sectionA.SSN)),
          pdf.columns(
            pdf.block(
              pdf.field('Race'),
              pdf.tab(),
              pdf.radio('White', this.data.sectionA.Race, { annotation: '2070' }),
              pdf.tab(),
              pdf.radio('Black/African American', this.data.sectionA.Race, {
                annotation: '2071'
              }),
              pdf.tab(),
              pdf.radio('European', this.data.sectionA.Race),
              pdf.tab(),
              pdf.radio('Asian', this.data.sectionA.Race, { annotation: '2072' })
            ),
            pdf.blockStyle(
              { width: 150 },
              pdf.field('Nationality', { width: 150 }),
              pdf.input(this.data.sectionA.PatNation)
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field(`Is This Patient's Permanet Address`),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionA.PermAddr),
              pdf.tab(),
              pdf.radio('No', this.data.sectionA.PermAddr)
            ),
            pdf.block(
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Zip Code'),
              pdf.input(this.data.sectionA.ZipCode)
            )
          )
        )
      ]
    ];
  }

  private sectionB(): pdfMake.Content[][] {
    return [
      [pdf.section('B. EPISODE OF CARE')],
      [
        pdf.stack(
          pdf.block(pdf.field('Hospital Name'), pdf.inputThai(this.data.sectionB.HospName)),
          pdf.block(
            pdf.field('Admission Type'),
            pdf.tab(),
            pdf.radio('Direct', this.data.sectionB.AdmType),
            pdf.tab(),
            pdf.radio('Transfer', this.data.sectionB.AdmType)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Transfer, ',
            pdf.field('form Healthcare Center'),
            pdf.tab(),
            pdf.radio('BDMS Network', this.data.sectionB.TransferHospType),
            ': ',
            pdf.input(this.data.sectionB.BDMSNetwork),
            pdf.tab(5),
            pdf.radio('Non BDMS', this.data.sectionB.TransferHospType),
            pdf.input(this.data.sectionB.NonBDMS)
          ),
          pdf.block(
            pdf.field('Arrival Date/Time', { annotation: '3001' }),
            pdf.date(this.data.sectionB.ArrivalDateTime, 'datetime')
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Admitting Provider', { annotation: '3050,3051' }),
              pdf.inputThai(this.data.sectionB.AdmProvider)
            ),
            pdf.block(
              pdf.field('Attending Provider', { annotation: '3055,3056' }),
              pdf.inputThai(this.data.sectionB.AttProvider)
            )
          ),
          {
            margin: [0, 0, 0, 3],
            table: {
              widths: ['*', '*'],
              headerRows: 2,
              body: [
                [
                  { text: 'Payment Source', style: 'tableHeader', colSpan: 2, alignment: 'center' },
                  {}
                ],
                [
                  { text: 'Primary Payor', style: 'tableHeader' },
                  { text: 'Secondary Payor', style: 'tableHeader' }
                ],
                [
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.block(
                      pdf.radio('Self', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('Corporate', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('Embassy', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('Other', this.data.sectionB.PayorPrim)
                    ),
                    pdf.block(
                      pdf.radio('Private Health Insurance', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('SSO (Social Security Office)', this.data.sectionB.PayorPrim)
                    ),
                    pdf.radio('Charitable care/Foundation Funding', this.data.sectionB.PayorPrim),
                    pdf.radio(`Comptroller General's Department`, this.data.sectionB.PayorPrim),
                    pdf.radio(
                      'NHSO (National Health Security Office)',
                      this.data.sectionB.PayorPrim
                    )
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.block(
                      pdf.radio('None', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('Corporate', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('Embassy', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('Other', this.data.sectionB.PayorSecond)
                    ),
                    pdf.block(
                      pdf.radio('Private Health Insurance', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('SSO (Social Security Office)', this.data.sectionB.PayorSecond)
                    ),
                    pdf.radio('Charitable care/Foundation Funding', this.data.sectionB.PayorSecond),
                    pdf.radio(`Comptroller General's Department`, this.data.sectionB.PayorSecond),
                    pdf.radio(
                      'NHSO (National Health Security Office)',
                      this.data.sectionB.PayorSecond
                    )
                  )
                ]
              ]
            }
          }
        )
      ]
    ];
  }

  private sectionC(): pdfMake.Content[][] {
    // tslint:disable: variable-name
    const col1_1 = 180;
    const col1_2 = 30;
    const col1_3 = 30;
    const col2_1 = 180;
    const col2_2 = 30;
    const col2_3 = 30;
    const col3_1 = 230;
    const col3_2 = 30;
    const col3_3 = 30;
    // tslint:enable: variable-name

    return [
      [
        pdf.blockStyle({ style: 'section' }, pdf.section('C. HISTORY AND RISK FACTORS'), {
          text: ' (Known or Diagnosed Prior to First Cath Lab Visit)',
          bold: false
        })
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.stack(
              pdf.columns(
                pdf.field('Hypertension', { annotation: '4615', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.Hypertension, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.Hypertension, { width: col1_3 })
              ),
              pdf.columns(
                pdf.field('Diabetes Mellitus', { annotation: '4555', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.Diabetes, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.Diabetes, { width: col1_3 })
              ),
              pdf.columns(
                pdf.field('Dyslipidemia', { annotation: '4620', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.Dyslipidemia, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.Dyslipidemia, { width: col1_3 })
              ),
              pdf.columns(
                pdf.field('Prior MI', { annotation: '4291', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.HxMI, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.HxMI, { width: col1_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent MI Date', { annotation: '4296' }),
                pdf.date(this.data.sectionC.HxMIDate)
              ),
              pdf.columns(
                pdf.field('Prior PCI', { annotation: '4495', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.PriorPCI, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.PriorPCI, { width: col1_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent PCI Date', { annotation: '4503' }),
                pdf.date(this.data.sectionC.HxPCIDate)
              ),
              pdf.columns(
                pdf.blockStyle(
                  { width: col1_1 - 55 },
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Left Main PCI', { annotation: '4501' })
                ),
                pdf.radio('Unknown', this.data.sectionC.LMPCI, { width: 55 }),
                pdf.radio('No', this.data.sectionC.LMPCI, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.LMPCI, { width: col1_3 })
              )
            ),
            pdf.stack(
              pdf.columns(
                pdf.block(
                  pdf.field('Height', { annotation: '6000' }),
                  pdf.input(this.data.sectionC.Height),
                  ' cm'
                ),
                pdf.block(
                  pdf.field('Weight', { annotation: '6005' }),
                  pdf.input(this.data.sectionC.Weight),
                  ' kg'
                )
              ),
              pdf.columns(
                pdf.field('Currently on Dialysis', { annotation: '4560', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.CurrentDialysis, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.CurrentDialysis, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Family Hx. of Premature CAD', { annotation: '4287', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.FamilyHxCAD, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.FamilyHxCAD, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Cerebrovascular Disease', { annotation: '4551', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.HxCVD, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.HxCVD, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Peipheral Arterial Disease', { annotation: '4610', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.PriorPAD, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.PriorPAD, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Chronic Lung Disease', { annotation: '4576', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.HxChronicLungDisease, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.HxChronicLungDisease, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Prior CABG', { annotation: '4515', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.PriorCABG, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.PriorCABG, { width: col2_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent CABG Date', { annotation: '4521' }),
                pdf.date(this.data.sectionC.HxCABGDate)
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Tobacco Use', { annotation: '4625', width: 85 }),
            pdf.stack(
              pdf.radio('Never', this.data.sectionC.TobaccoUse),
              pdf.radio('Current - Some Days', this.data.sectionC.TobaccoUse)
            ),
            pdf.stack(
              pdf.radio('Former', this.data.sectionC.TobaccoUse),
              pdf.radio('Current - Every Day', this.data.sectionC.TobaccoUse)
            ),
            pdf.stackStyle(
              { width: 200 },
              pdf.radio('Smoker, Current Status Unknown', this.data.sectionC.TobaccoUse),
              pdf.radio('Unknown if ever Smoked', this.data.sectionC.TobaccoUse)
            )
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' any Current, ',
            pdf.field('Tobacco Type', { annotation: '4626' }),
            '(Select all that apply)',
            pdf.tab(),
            pdf.check('Cigarettes', this.data.sectionC.TobaccoType),
            pdf.tab(),
            pdf.check('Cigars', this.data.sectionC.TobaccoType),
            pdf.tab(),
            pdf.check('Pipe', this.data.sectionC.TobaccoType),
            pdf.tab(),
            pdf.check('Smokeless', this.data.sectionC.TobaccoType)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Current - Every Day and Cigarettes, ',
            pdf.field('Amount', { annotation: '4627' }),
            pdf.tab(),
            pdf.radio('Light tobacco use (<10/day)', this.data.sectionC.SmokeAmount),
            pdf.tab(),
            pdf.radio('Heavy tobacco use (>=10/day)', this.data.sectionC.SmokeAmount)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Cardiac Arrest Out of Healthcare Facility', {
              annotation: '4630',
              width: col3_1
            }),
            pdf.radio('No', this.data.sectionC.CAOutHospital, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CAOutHospital, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Arrest Witnessed', { annotation: '4631' })
            ),
            pdf.radio('No', this.data.sectionC.CAWitness, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CAWitness, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Arrest after Arrival of EMS', { annotation: '4632', width: col3_1 })
            ),
            pdf.radio('No', this.data.sectionC.CAPostEMS, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CAPostEMS, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('First Cardiac Arrest Rhythm', { annotation: '4633', width: col3_1 })
            ),
            pdf.block(
              pdf.radio('Shockable', this.data.sectionC.InitCARhythm),
              pdf.tab(),
              pdf.radio('Not Shockable', this.data.sectionC.InitCARhythm),
              pdf.tab(),
              pdf.radio('Unknown', this.data.sectionC.InitCARhythm)
            )
          ),
          pdf.columns(
            pdf.field('Cardiac Arrest at Trasferring Healthcare Facility', {
              annotation: '4635',
              width: col3_1
            }),
            pdf.radio('No', this.data.sectionC.CATransferFac, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CATransferFac, { width: col3_3 })
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('CSHA Clinical Frailty Scale', { annotation: '4561' }),
            pdf.stack(
              pdf.radio('1: Very Fit', this.data.sectionC.CSHAScale),
              pdf.radio('2: Well', this.data.sectionC.CSHAScale),
              pdf.radio('3: Managing Well', this.data.sectionC.CSHAScale)
            ),
            pdf.stack(
              pdf.radio('4: Vulnerable', this.data.sectionC.CSHAScale),
              pdf.radio('5: Mildly Frail', this.data.sectionC.CSHAScale),
              pdf.radio('6: Moderately Frail', this.data.sectionC.CSHAScale)
            ),
            pdf.stack(
              pdf.radio('7: Severely Frail', this.data.sectionC.CSHAScale),
              pdf.radio('8: Very Severely Frail', this.data.sectionC.CSHAScale),
              pdf.radio('9: Terminally Ill', this.data.sectionC.CSHAScale)
            )
          )
        )
      ]
    ];
  }

  private sectionD(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('D. PRE-PROCEDURE INFORMATION'),
          {
            text: ' (Complete for Each Cath Lab Visit)',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.stackStyle(
              { width: 170 },
              pdf.field('Heart Failure', { annotation: '4001' }),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('NYHA Class', { annotation: '4011' })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Newly Diagnosed', { annotation: '4012' })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Heart Failure Type', { annotation: '4013' })
              )
            ),
            pdf.stack(
              pdf.block(
                pdf.radio('No', this.data.sectionD.HxHF),
                pdf.tab(2),
                pdf.radio('Yes', this.data.sectionD.HxHF)
              ),
              pdf.block(
                pdf.radio('Class I', this.data.sectionD.PriorNYHA),
                pdf.tab(2),
                pdf.radio('Class II', this.data.sectionD.PriorNYHA),
                pdf.tab(2),
                pdf.radio('Class III', this.data.sectionD.PriorNYHA),
                pdf.tab(2),
                pdf.radio('Class IV', this.data.sectionD.PriorNYHA)
              ),
              pdf.block(
                pdf.radio('No', this.data.sectionD.HFNewDiag),
                pdf.tab(2),
                pdf.radio('Yes', this.data.sectionD.HFNewDiag)
              ),
              pdf.block(
                pdf.radio('Diastolic', this.data.sectionD.HFType),
                pdf.tab(2),
                pdf.radio('Systolic', this.data.sectionD.HFType),
                pdf.tab(2),
                pdf.radio('Unknown', this.data.sectionD.HFType)
              )
            )
          )
        )
      ],
      [pdf.subSection('(DIAGNOSTIC TEST)')],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Electrocardiac Assessment Method', { annotation: '5037' }),
            pdf.tab(),
            pdf.radio('ECG', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('Telemetry Monitor', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('Holter Monitor', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('Other', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('None', this.data.sectionD.ECAssessMethod)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' any methods, ',
            pdf.field('Results', { annotation: '5032' }),
            pdf.tab(),
            pdf.radio('Normal', this.data.sectionD.ECGResults),
            pdf.tab(),
            pdf.radio('Abnormal', this.data.sectionD.ECGResults),
            pdf.tab(),
            pdf.radio('Uninterpretable', this.data.sectionD.ECGResults)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Abnormal, ',
            pdf.field('New Antiarrhythmic Therapy Initiated Prior to Cath Lab', {
              annotation: '5033'
            }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.AntiArrhyTherapy),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.AntiArrhyTherapy)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Abnormal, ',
            pdf.field('Electrocardiac Abnormality Type', { annotation: '5034' }),
            '(Select all that apply)'
          ),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stack(
              pdf.check('Ventricular Fibrillation (VF)', this.data.sectionD.ECGFindings),
              pdf.check('Sustained VT', this.data.sectionD.ECGFindings),
              pdf.check('Non Sustained VT', this.data.sectionD.ECGFindings),
              pdf.check('Exercise Induced VT', this.data.sectionD.ECGFindings),
              pdf.check('T wave inversions', this.data.sectionD.ECGFindings),
              pdf.check('ST deviation >= 0.5 mm', this.data.sectionD.ECGFindings)
            ),
            pdf.stack(
              pdf.check('New Left Bundle Branch Block', this.data.sectionD.ECGFindings),
              pdf.check('New Onset Atrial Fib', this.data.sectionD.ECGFindings),
              pdf.check('New Onset Atrial Flutter', this.data.sectionD.ECGFindings),
              pdf.check('PVC – Frequent', this.data.sectionD.ECGFindings),
              pdf.check('PVC – Infrequent', this.data.sectionD.ECGFindings)
            ),
            pdf.stack(
              pdf.check('2nd Degree AV Heart Block Type 1', this.data.sectionD.ECGFindings),
              pdf.check('2nd Degree AV Heart Block Type 2', this.data.sectionD.ECGFindings),
              pdf.check('3rd Degree AV Heart Block', this.data.sectionD.ECGFindings),
              pdf.check('Symptomatic Bradyarrhythmia', this.data.sectionD.ECGFindings),
              pdf.check('Other Electrocardiac Abnormality', this.data.sectionD.ECGFindings)
            )
          ),
          pdf.block(
            pdf.tab(3),
            pdf.arrowIf(),
            ' New Onset Atrial Fib, ',
            pdf.field('Heart Rate', { annotation: '6011' }),
            pdf.input(this.data.sectionD.HR),
            ' bpm'
          ),
          pdf.block(
            pdf.tab(3),
            pdf.arrowIf(),
            ' Non Sustained VT, ',
            pdf.field('Type', { annotation: '5036' }),
            '(Select all that apply)',
            pdf.tab(),
            pdf.check('Symptomatic', this.data.sectionD.NSVTType),
            pdf.tab(),
            pdf.check('Newly Diagnosed', this.data.sectionD.NSVTType),
            pdf.tab(),
            pdf.check('Other', this.data.sectionD.NSVTType)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Stress Test Performed', { annotation: '5200' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.StressPerformed),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.StressPerformed)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 150 },
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Test Type Performed', { annotation: '5201' })
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Stress Echocardiogram', this.data.sectionD.StressTestType),
              pdf.radio('Stress Nuclear', this.data.sectionD.StressTestType)
            ),
            pdf.stack(
              pdf.radio('Exercise Stress Test (w/o imaging)', this.data.sectionD.StressTestType),
              pdf.radio('Stress Imaging w/CMR', this.data.sectionD.StressTestType)
            )
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Date', { annotation: '5204' }),
            pdf.date(this.data.sectionD.StressTestDate)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Test Result', { annotation: '5202' }),
            pdf.tab(),
            pdf.radio('Negative', this.data.sectionD.StressTestResult),
            pdf.tab(),
            pdf.radio('Positive', this.data.sectionD.StressTestResult),
            pdf.tab(),
            pdf.radio('Indeterminate', this.data.sectionD.StressTestResult),
            pdf.tab(),
            pdf.radio('Unavailable', this.data.sectionD.StressTestResult)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Positive, ',
            pdf.field('Risk/Extent of Ischemia', { annotation: '5203' }),
            pdf.tab(),
            pdf.radio('Low', this.data.sectionD.StressTestRisk),
            pdf.tab(),
            pdf.radio('Intermediate', this.data.sectionD.StressTestRisk),
            pdf.tab(),
            pdf.radio('High', this.data.sectionD.StressTestRisk),
            pdf.tab(),
            pdf.radio('Unavailable', this.data.sectionD.StressTestRisk)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Cardiac CTA Performed', { annotation: '5220' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.CardiacCTA),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.CardiacCTA)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Cardiac CTA Date'),
            pdf.date(this.data.sectionD.CardiacCTADate)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 100 },
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Results', { annotation: '5227' })
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Obstructive CAD', this.data.sectionD.CardiacCTAResults),
              pdf.radio('Non-Obstructive CAD', this.data.sectionD.CardiacCTAResults)
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Unclear Severity', this.data.sectionD.CardiacCTAResults),
              pdf.radio('No CAD', this.data.sectionD.CardiacCTAResults)
            ),
            pdf.stack(
              pdf.radio('Structural Disease', this.data.sectionD.CardiacCTAResults),
              pdf.radio('Unknown', this.data.sectionD.CardiacCTAResults)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Agatston Coronary Calcium Score Assessed', { annotation: '5256' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.CalciumScoreAssessed),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.CalciumScoreAssessed)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Agatston Coronary Calcium Score', { annotation: '5255' }),
            pdf.input(this.data.sectionD.CalciumScore)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' any value, ',
            pdf.field('Most Recent Calcium Score Date', { annotation: '5257' }),
            pdf.date(this.data.sectionD.CalciumScoreDate)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('LVEF Assessed', { annotation: '5111' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.PreProcLVEFAssessed),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.PreProcLVEFAssessed),
            pdf.tab(4),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent LVEF', { annotation: '5116' }),
            pdf.input(this.data.sectionD.PreProcLVEF),
            ' %'
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Prior Dx Coronary Angiography Procedure', { annotation: '5263' }),
            '(without intervention)',
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.PriorDxAngioProc),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.PriorDxAngioProc)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Procedure Date', { annotation: '5264' }),
            pdf.date(this.data.sectionD.PriorDxAngioDate)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 100 },
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Results', { annotation: '5265' })
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Obstructive CAD', this.data.sectionD.PriorDxAngioResults),
              pdf.radio('Non-Obstructive CAD', this.data.sectionD.PriorDxAngioResults)
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Unclear Severity', this.data.sectionD.PriorDxAngioResults),
              pdf.radio('No CAD', this.data.sectionD.PriorDxAngioResults)
            ),
            pdf.stack(
              pdf.radio('Structural Disease', this.data.sectionD.PriorDxAngioResults),
              pdf.radio('Unknown', this.data.sectionD.PriorDxAngioResults)
            )
          )
        )
      ],
      [pdf.subSection('PRE-PROCEDURE MEDICATIONS')],
      [
        pdf.stack(pdf.emptyLine(), {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              margin: [0, 0, 0, 3],
              table: {
                widths: [200, 200],
                body: [
                  [
                    pdf.blockStyle(
                      { style: 'tableHeaderWithAnno' },
                      { text: 'Medication', bold: true },
                      `⁶⁹⁸⁶`
                    ),
                    pdf.blockStyle(
                      { style: 'tableHeaderWithAnno' },
                      { text: 'Administered', bold: true },
                      `⁶⁹⁹¹`
                    )
                  ],
                  [
                    pdf.text('Antiplatelet ASA', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedASA),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedASA),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedASA)
                    )
                  ],
                  [
                    pdf.text('Beta Blockers (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedBetaBlocker),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedBetaBlocker),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedBetaBlocker)
                    )
                  ],
                  [
                    pdf.text('Ca Channel Blockers (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedCaBlocker),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedCaBlocker),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedCaBlocker)
                    )
                  ],
                  [
                    pdf.text('Antiarrhythmic Agent Other', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedAntiArrhythmic),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedAntiArrhythmic),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedAntiArrhythmic)
                    )
                  ],
                  [
                    pdf.text('Long Acting Nitrates (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedLongActNitrate),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedLongActNitrate),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedLongActNitrate)
                    )
                  ],
                  [
                    pdf.text('Ranolazine', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedRanolazine),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedRanolazine),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedRanolazine)
                    )
                  ],
                  [
                    pdf.text('Statin (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedStatin),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedStatin),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedStatin)
                    )
                  ],
                  [
                    pdf.text('Non-Statin (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedNonStatin),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedNonStatin),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedNonStatin)
                    )
                  ],
                  [
                    pdf.text('PCSK9 Inhibitors', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data.sectionD.PreProcMedPCSK9),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionD.PreProcMedPCSK9),
                      pdf.tab(),
                      pdf.radio('Contraindicated', this.data.sectionD.PreProcMedPCSK9)
                    )
                  ]
                ]
              },
              layout: {
                fillColor(rowIndex, node, columnIndex) {
                  return rowIndex % 2 === 0 ? '#eeeeee' : null;
                }
              }
            },
            { width: '*', text: '' }
          ]
        })
      ]
    ];
  }

  private sectionE(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('E. PROCEDURE INFORMATION')
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.block(
              pdf.field('Procedure Start Date/Time', { annotation: '7000' }),
              pdf.date(this.data.sectionE.ProcedureStartDateTime, 'datetime')
            ),
            pdf.block(
              pdf.field('Procedure End Date/Time', { annotation: '7005' }),
              pdf.date(this.data.sectionE.ProcedureEndDateTime, 'datetime')
            )
          ),
          pdf.block(
            pdf.field('Diagnostic Coronary Angiography Procedure', { annotation: '7045' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.DiagCorAngio),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.DiagCorAngio)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Diagnostic Cath Operator', { annotation: '7046,7047' }),
            pdf.input(this.data.sectionE.DCathProvider)
          ),
          pdf.block(
            pdf.field('Percutaneous Coronary Intervention (PCI)', { annotation: '7050' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.PCIProc),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.PCIProc)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('PCI Operator', { annotation: '7051,7052' }),
            '1ˢᵗ Operator - ',
            pdf.input(this.data.sectionE.PCIProvider),
            pdf.tab(4),
            '2ⁿᵈ Operator - ',
            pdf.input(this.data.sectionE.PCIProvider2)
          ),
          pdf.block(
            pdf.field('Diagnostic Left Heart Cath', { annotation: '7060' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.LeftHeartCath),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.LeftHeartCath)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('LVEF', { annotation: '7061' }),
            pdf.input(this.data.sectionE.PrePCILVEF),
            ' %',
            pdf.tab(),
            pdf.field('LVEDP', { annotation: '7061' }),
            pdf.input(this.data.sectionE.PrePCILVEDP),
            ' mmHg'
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Concomitant Procedures Performed', { annotation: '7065' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.ConcomProc),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.ConcomProc)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Procedure Type(s)', { annotation: '7066' }),
            '(Select the best option(s))'
          ),
          pdf.columns(
            { text: '', width: 26 },
            pdf.stackStyle(
              { width: 205 },
              pdf.check('Structural Repair', this.data.sectionE.ConcomProcType),
              pdf.check('Left Atrial Appendage Occlusion', this.data.sectionE.ConcomProcType),
              pdf.check('Parachute Device Placement', this.data.sectionE.ConcomProcType),
              pdf.check('Mitral Clip Procedure', this.data.sectionE.ConcomProcType),
              pdf.check(
                'Transcatheter Aortic Valve Replacement (TAVR)',
                this.data.sectionE.ConcomProcType
              ),
              pdf.check(
                'Thoracic Endovascular Aortic Repair (TEVAR)',
                this.data.sectionE.ConcomProcType
              ),
              pdf.check('Endovascular Aortic Repair (EVAR)', this.data.sectionE.ConcomProcType)
            ),
            pdf.stack(
              pdf.check('Right Heart Cath', this.data.sectionE.ConcomProcType),
              pdf.check('EP Study', this.data.sectionE.ConcomProcType),
              pdf.check('Cardioversion', this.data.sectionE.ConcomProcType),
              pdf.check('Temporary Pacemaker Placement', this.data.sectionE.ConcomProcType),
              pdf.check('Permanent Pacemaker Placement', this.data.sectionE.ConcomProcType),
              pdf.check('LIMA (Native Position) Angiography', this.data.sectionE.ConcomProcType)
            ),
            pdf.stackStyle(
              { width: 'auto' },
              pdf.check('Aortography', this.data.sectionE.ConcomProcType),
              pdf.check('Renal Angiography', this.data.sectionE.ConcomProcType),
              pdf.check('Peripheral Intervention', this.data.sectionE.ConcomProcType),
              pdf.check('Peripheral Angiography', this.data.sectionE.ConcomProcType),
              pdf.check('Biopsy of heart', this.data.sectionE.ConcomProcType),
              pdf.check('Procedure Type Not Listed', this.data.sectionE.ConcomProcType)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Access Site', { annotation: '7320' }),
            pdf.stack(
              pdf.radio('Right Femoral', this.data.sectionE.AccessSite),
              pdf.radio('Left Femoral', this.data.sectionE.AccessSite)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data.sectionE.AccessSite),
              pdf.radio('Left Brachial', this.data.sectionE.AccessSite)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data.sectionE.AccessSite),
              pdf.radio('Left Radial', this.data.sectionE.AccessSite)
            ),
            pdf.radio('Other', this.data.sectionE.AccessSite, { width: 75 })
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.field('Access Site - Closure Method', { width: 135 }),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.AccessSiteClosure),
              pdf.radio('Compression Device', this.data.sectionE.AccessSiteClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.AccessSiteClosure),
              pdf.radio('Suturing technique', this.data.sectionE.AccessSiteClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Cross Over', { annotation: '7325' }),
            pdf.stack(
              pdf.radio('Right Femoral', this.data.sectionE.Crossover),
              pdf.radio('Left Femoral', this.data.sectionE.Crossover)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data.sectionE.Crossover),
              pdf.radio('Left Brachial', this.data.sectionE.Crossover)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data.sectionE.Crossover),
              pdf.radio('Left Radial', this.data.sectionE.Crossover)
            ),
            pdf.radio('No', this.data.sectionE.Crossover, { width: 75 })
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 185 },
              pdf.arrowIf(),
              ' not No, ',
              pdf.field('Cross Over - Closure Method')
            ),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.CrossoverClosure),
              pdf.radio('Compression Device', this.data.sectionE.CrossoverClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.CrossoverClosure),
              pdf.radio('Suturing technique', this.data.sectionE.CrossoverClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Simultaneous'),
            pdf.stack(
              pdf.radio('Right Femoral', this.data.sectionE.Simultaneous),
              pdf.radio('Left Femoral', this.data.sectionE.Simultaneous)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data.sectionE.Simultaneous),
              pdf.radio('Left Brachial', this.data.sectionE.Simultaneous)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data.sectionE.Simultaneous),
              pdf.radio('Left Radial', this.data.sectionE.Simultaneous)
            ),
            pdf.radio('No', this.data.sectionE.Simultaneous, { width: 75 })
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 200 },
              pdf.arrowIf(),
              ' not No, ',
              pdf.field('Simultaneous - Closure Method')
            ),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.SimultaneousClosure),
              pdf.radio('Compression Device', this.data.sectionE.SimultaneousClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.SimultaneousClosure),
              pdf.radio('Suturing technique', this.data.sectionE.SimultaneousClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Venous Access', { annotation: '7335' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.VenousAccess),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.VenousAccess)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 175 },
              pdf.arrowIf(),
              ' not No, ',
              pdf.field('Venous - Closure Method')
            ),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.VenousAccessClosure),
              pdf.radio('Compression Device', this.data.sectionE.VenousAccessClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.VenousAccessClosure),
              pdf.radio('Suturing technique', this.data.sectionE.VenousAccessClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Systolic BP', { annotation: '6016' }),
            pdf.input(this.data.sectionE.ProcSystolicBP),
            ' mmHg'
          ),
          pdf.block(
            pdf.field('Cardiac Arrest at this facility', { annotation: '7340' }),
            pdf.radio('No', this.data.sectionE.CAInHosp),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.CAInHosp)
          )
        )
      ],
      [pdf.subSection('RADIATION EXPOSURE AND CONTRAST')],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.block(
              pdf.field('Fluoro Time', { annotation: '7214' }),
              pdf.input(this.data.sectionE.FluoroTime),
              ' miniutes'
            ),
            pdf.block(
              pdf.field('Contrast Volume', { annotation: '7215' }),
              pdf.input(this.data.sectionE.ContrastVol),
              ' ml'
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Cumulative Air Kerma', { annotation: '7210' }),
              pdf.input(this.data.sectionE.FluoroDoseKerm),
              ' mGy'
            ),
            pdf.block(
              pdf.field('Dose Area Product', { annotation: '7220' }),
              pdf.input(this.data.sectionE.FluoroDoseDAP),
              ' mGy/cm²'
            )
          )
        )
      ]
    ];
  }

  private sectionF(): pdfMake.Content[][] {
    // tslint:disable: variable-name
    const col1_1 = 100;
    const col1_2 = 170;
    const col1_3 = 100;
    const col1_4 = '*';
    // tslint:enable: variable-name

    return [
      [pdf.blockStyle(pdf.section('F. LABS'))],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.blockStyle(
              { alignment: 'center' },
              { text: 'PRE-PROCEDURE', bold: true },
              ' (value closest to the procedure)'
            ),
            { text: 'POST-PROCEDURE', bold: true, alignment: 'center' }
          ),
          pdf.columns(
            pdf.field('hsTroponin I', { annotation: '6090', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.PreProcTnILab),
              ' ',
              pdf.input(this.data.sectionF.PreProcTnI),
              ' ng/mL'
            ),
            pdf.field('hsTroponin I', { annotation: '8515', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcTnILab),
              ' ',
              pdf.input(this.data.sectionF.PostProcTnI),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('hsTroponin T', { annotation: '6095', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.PreProcTnTLab),
              ' ',
              pdf.input(this.data.sectionF.PreProcTnT),
              ' ng/mL'
            ),
            pdf.field('hsTroponin T', { annotation: '8520', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcTnTLab),
              ' ',
              pdf.input(this.data.sectionF.PostProcTnT),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('Creatinine', { annotation: '6050', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.PreProcCreatLab),
              ' ',
              pdf.input(this.data.sectionF.PreProcCreat),
              ' ng/mL'
            ),
            pdf.blockStyle(
              { width: col1_3 },
              pdf.field('Creatinine', { annotation: '8510' }),
              pdf.text('(peak)', { fontSize: 8 })
            ),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcCreatLab),
              ' ',
              pdf.input(this.data.sectionF.PostProcCreat),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('Hemoglobin', { annotation: '6030', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.HGBLab),
              ' ',
              pdf.input(this.data.sectionF.HGB),
              ' g/dL'
            ),
            pdf.field('Hemoglobin', { annotation: '8505', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcHgbLab),
              ' ',
              pdf.input(this.data.sectionF.PostProcHgb),
              ' g/dL'
            )
          ),
          pdf.columns(
            pdf.field('Total Cholesterol', { annotation: '6100', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.LipidsTCLab),
              ' ',
              pdf.input(this.data.sectionF.LipidsTC),
              ' mg/dL'
            ),
            pdf.blockStyle(
              { width: col1_3, margin: [0, -5, 0, 0] },
              pdf.tab(),
              pdf.text('(lowest in 72 hr)', { fontSize: 8 })
            )
          ),
          pdf.columns(
            pdf.field('HDL', { annotation: '6105', width: col1_1 }),
            pdf.block(
              pdf.radio('Drawn', this.data.sectionF.LipidsHDLLab),
              ' ',
              pdf.input(this.data.sectionF.LipidsHDL),
              ' mg/dL'
            )
          )
        )
      ]
    ];
  }

  private sectionG(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('G. CATH LAB VISIT'),
          {
            text: ' (Complete for Each Cath Lab Visit)',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Indication(s) for Cath Lab Visit', { annotation: '7400' }),
            ' (Select all that apply)'
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.stackStyle(
              { width: 210 },
              pdf.check('ACS <= 24 hrs', this.data.sectionG.CathLabVisitIndication),
              pdf.check('ACS > 24 hrs', this.data.sectionG.CathLabVisitIndication),
              pdf.check('New Onset Angina <= 2 months', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Worsening Angina', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Resuscitated Cardiac Arrest', this.data.sectionG.CathLabVisitIndication),
              pdf.block(
                pdf.check('Re-CathLab Visit', this.data.sectionG.CathLabVisitIndication),
                ': CathPCI No.',
                pdf.input(this.data.sectionG.PreviousCathLabVisit)
              )
            ),
            pdf.stack(
              pdf.check('Stable Known CAD', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Suspected CAD', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Valvular Disease', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Pericardial Disease', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Cardiac Arrhythmia', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Cardiomyopathy', this.data.sectionG.CathLabVisitIndication)
            ),
            pdf.stackStyle(
              { width: 'auto' },
              pdf.check('LV Dysfunction', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Syncope', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Post Cardiac Transplant', this.data.sectionG.CathLabVisitIndication),
              pdf.check('Pre-operative Evaluation', this.data.sectionG.CathLabVisitIndication),
              pdf.check(
                'Evaluation for Exercise Clearance',
                this.data.sectionG.CathLabVisitIndication
              ),
              pdf.check('Other', this.data.sectionG.CathLabVisitIndication)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Chest Pain Symptom Assessment', { annotation: '7405' }),
            pdf.tab(),
            pdf.radio('Typical Angina', this.data.sectionG.CPSxAssess),
            pdf.tab(),
            pdf.radio('Atypical Angina', this.data.sectionG.CPSxAssess),
            pdf.tab(),
            pdf.radio('Non-anginal Chest Pain', this.data.sectionG.CPSxAssess),
            pdf.tab(),
            pdf.radio('Asymptomatic', this.data.sectionG.CPSxAssess)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Cardiovascular Instability', { annotation: '7410' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionG.CVInstability),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionG.CVInstability)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Cardiovascular Instability Type', { annotation: '7415' }),
            '(Select all that apply)'
          ),
          pdf.columns(
            { text: '', width: 26 },
            pdf.stack(
              pdf.check(
                'Persistent Ischemic Symptoms (chest pain, STE)',
                this.data.sectionG.CVInstabilityType
              ),
              pdf.check(
                'Hemodynamic Instability (not cardiogenic shock)',
                this.data.sectionG.CVInstabilityType
              ),
              pdf.check('Ventricular Arrhythmias', this.data.sectionG.CVInstabilityType)
            ),
            pdf.stack(
              pdf.check('Cardiogenic Shock', this.data.sectionG.CVInstabilityType),
              pdf.check('Acute Heart Failure Symptoms', this.data.sectionG.CVInstabilityType),
              pdf.check('Refractory Cardiogenic Shock', this.data.sectionG.CVInstabilityType)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Ventricular Support', { annotation: '7420' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionG.VSupport),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionG.VSupport)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Pharmacologic Vasopressor Support', { annotation: '7421' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionG.PharmVasoSupp),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionG.PharmVasoSupp)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Mechanical Ventricular Support', { annotation: '7422' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionG.MechVentSupp),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionG.MechVentSupp)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Device', { annotation: '7423' })
          ),
          pdf.columns(
            { text: '', width: 26 },
            pdf.stack(
              pdf.radio('Intra-aortic balloon pump (IABP)', this.data.sectionG.MVSupportDevice),
              pdf.radio(
                'Extracorporeal membrane oxygenation (ECMO)',
                this.data.sectionG.MVSupportDevice
              ),
              pdf.radio('Cardiopulmonary Support (CPS)', this.data.sectionG.MVSupportDevice),
              pdf.radio('Impella: Left Ventricular Support', this.data.sectionG.MVSupportDevice),
              pdf.radio('Impella: Right Ventricular Support', this.data.sectionG.MVSupportDevice)
            ),
            pdf.stack(
              pdf.radio(
                'Left ventricular assist device (LVAD)',
                this.data.sectionG.MVSupportDevice
              ),
              pdf.radio(
                'Right Ventricular Assist Device (RVAD)',
                this.data.sectionG.MVSupportDevice
              ),
              pdf.radio('Percutaneous Heart Pump (PHP)', this.data.sectionG.MVSupportDevice),
              pdf.radio('TandemHeart', this.data.sectionG.MVSupportDevice)
            )
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Timing', { annotation: '7424' })
          ),
          pdf.columns(
            { text: '', width: 26 },
            pdf.stack(
              pdf.radio('In place at start of procedure', this.data.sectionG.MVSupportTiming),
              pdf.radio(
                'Inserted during procedure and prior to intervention',
                this.data.sectionG.MVSupportTiming
              ),
              pdf.radio('Inserted after intervention has begun', this.data.sectionG.MVSupportTiming)
            )
          )
        )
      ],
      [
        pdf.blockStyle({ style: 'subSection' }, pdf.tab(), pdf.arrowIf(), {
          text: ` Indication(s) for Cath Lab Visit = 'Valvular Disease'`
        })
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                margin: [0, 0, 0, 5],
                table: {
                  widths: [145, 50, 50, 50, 50, 50, 50],
                  headerRows: 2,
                  body: [
                    [
                      pdf.blockStyle(
                        { style: 'tableHeaderWithAnno', rowSpan: 2, margin: [0, 3, 0, 0] },
                        { text: 'Valvular Disease\nStenosis Type', bold: true },
                        `⁷⁴⁵⁰`
                      ),
                      pdf.blockStyle(
                        { style: 'tableHeaderWithAnno', colSpan: 6 },
                        { text: 'Stenosis Severity', bold: true },
                        `⁷⁴⁵¹`
                      ),
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      '',
                      pdf.text('No', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Trivial', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Mild', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Moderate', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Severe', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Unknown', { style: 'tableHeaderWithAnno' })
                    ],
                    [
                      pdf.text('Aortic Stenosis', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.ASSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.ASSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.ASSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.ASSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.ASSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.ASSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Mitral Stenosis', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.MSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.MSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.MSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.MSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.MSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.MSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Pulmonic Stenosis', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.PSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.PSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.PSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.PSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.PSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.PSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Tricuspid Stenosis', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.TSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.TSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.TSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.TSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.TSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.TSSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ]
                  ]
                }
              },
              { width: '*', text: '' }
            ]
          },
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                margin: [0, 0, 0, 3],
                table: {
                  widths: [110, 30, 40, 65, 100, 50, 50],
                  headerRows: 2,
                  body: [
                    [
                      pdf.blockStyle(
                        { style: 'tableHeaderWithAnno', rowSpan: 2, margin: [0, 3, 0, 0] },
                        { text: 'Valvular Disease\nRegurgitaton Type', bold: true },
                        `⁷⁴⁵⁵`
                      ),
                      pdf.blockStyle(
                        { style: 'tableHeaderWithAnno', colSpan: 6 },
                        { text: 'Regurgitaton Severity', bold: true },
                        `⁷⁴⁵⁶`
                      ),
                      '',
                      '',
                      '',
                      '',
                      ''
                    ],
                    [
                      '',
                      pdf.text('No (0)', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Mild (1+)', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Moderate (2+)', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Moderately Severe (3+)', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Severe (4+)', { style: 'tableHeaderWithAnno' }),
                      pdf.text('Unknown', { style: 'tableHeaderWithAnno' })
                    ],
                    [
                      pdf.text('Aortic Regurgitation', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.ARSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.ARSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.ARSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.ARSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.ARSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.ARSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Mitral Regurgitation', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.MRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.MRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.MRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.MRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.MRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.MRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Pulmonic Regurgitation', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.PRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.PRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.PRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.PRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.PRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.PRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Tricuspid Regurgitation', { style: 'tableCell' }),
                      pdf.radio('No', this.data.sectionG.TRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data.sectionG.TRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data.sectionG.TRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data.sectionG.TRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data.sectionG.TRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data.sectionG.TRSeverity, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ]
                  ]
                }
              },
              { width: '*', text: '' }
            ]
          }
        )
      ],
      [
        pdf.blockStyle({ style: 'subSection' }, pdf.tab(), pdf.arrowIf(), {
          text: ` Indication(s) for Cath Lab Visit = 'Pre-operative Evaluation'`
        })
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Evaluation for Surgery Type', { annotation: '7465' }),
            pdf.tab(),
            pdf.radio('Cardiac Surgery', this.data.sectionG.PreOPEval),
            pdf.tab(),
            pdf.radio('Non-Cardiac Surgery', this.data.sectionG.PreOPEval)
          ),
          pdf.block(
            pdf.field('Functional Capacity', { annotation: '7466' }),
            pdf.tab(),
            pdf.radio('< 4 METS', this.data.sectionG.FuncCapacity),
            pdf.tab(),
            pdf.radio('>= 4 METS without Symptoms', this.data.sectionG.FuncCapacity),
            pdf.tab(),
            pdf.radio('>= 4 METS with Symptoms', this.data.sectionG.FuncCapacity),
            pdf.tab(),
            pdf.radio('Unknown', this.data.sectionG.FuncCapacity)
          ),
          pdf.block(
            pdf.field('Surgical Risk', { annotation: '7468' }),
            pdf.tab(),
            pdf.radio('Low', this.data.sectionG.SurgRisk),
            pdf.tab(),
            pdf.radio('Intermediate', this.data.sectionG.SurgRisk),
            pdf.tab(),
            pdf.radio('High Risk: Vascular', this.data.sectionG.SurgRisk),
            pdf.tab(),
            pdf.radio('High Risk: Non-Vascular', this.data.sectionG.SurgRisk)
          ),
          pdf.block(
            pdf.field('Solid Organ Transplant Surgery', { annotation: '7469' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionG.OrganTransplantSurg),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionG.OrganTransplantSurg)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transplant Donor', { annotation: '7470' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionG.OrganTransplantSurg),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionG.OrganTransplantSurg)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transplant Type', { annotation: '7471' }),
            pdf.tab(),
            pdf.check('Heart', this.data.sectionG.OrganTransplantType),
            pdf.tab(),
            pdf.check('Kidney', this.data.sectionG.OrganTransplantType),
            pdf.tab(),
            pdf.check('Liver', this.data.sectionG.OrganTransplantType),
            pdf.tab(),
            pdf.check('Lung', this.data.sectionG.OrganTransplantType),
            pdf.tab(),
            pdf.check('Pancreas', this.data.sectionG.OrganTransplantType),
            pdf.tab(),
            pdf.check('Other Organ', this.data.sectionG.OrganTransplantType)
          )
        )
      ]
    ];
  }

  private sectionH(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('H. CORONARY ANATOMY')
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Dominance', { annotation: '7500' }),
            pdf.tab(),
            pdf.radio('Left', this.data.sectionH.Dominance),
            pdf.tab(),
            pdf.radio('Right', this.data.sectionH.Dominance),
            pdf.tab(),
            pdf.radio('Co-dominant', this.data.sectionH.Dominance)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Native Vessel with Stenosis >= 50%', { annotation: '7505' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionH.NVStenosis),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionH.NVStenosis),
            pdf.tab(4),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Specify Segment(s)')
          ),
          {
            margin: [0, 0, 0, 3],
            table: {
              // headerRows: 1,
              widths: [95, '*'],
              dontBreakRows: true,
              body: [
                [
                  pdf.blockStyle(
                    { lineHeight: 1, alignment: 'center' },
                    { text: 'SEGMENT NUMBER', bold: true },
                    '⁷⁵⁰⁷'
                  ),
                  { text: 'MEASUREMENT', style: 'tableHeader' }
                ],
                ...this.getNvAnatomy()
              ]
            }
          },
          pdf.emptyLine(),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Graft Vessel with Stenosis >= 50%', { annotation: '7505' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionH.GraftStenosis),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionH.GraftStenosis),
            pdf.tab(4),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Specify Segment(s)')
          ),
          {
            margin: [0, 0, 0, 3],
            table: {
              // headerRows: 1,
              widths: [95, '*'],
              dontBreakRows: true,
              body: [
                [
                  pdf.blockStyle(
                    { lineHeight: 1, alignment: 'center' },
                    { text: 'SEGMENT NUMBER', bold: true },
                    '⁷⁵²⁷'
                  ),
                  { text: 'MEASUREMENT', style: 'tableHeader' }
                ],
                ...this.getGraftAnatomy()
              ]
            }
          }
        )
      ]
    ];
  }

  private getNvAnatomy() {
    const output = [];
    const nvLength = this.data.sectionH.NativeLesions.length;
    const maxLength = nvLength < maxNvLength ? maxNvLength : nvLength;

    for (let index = 0; index < maxLength; index++) {
      let vessel = null;
      if (index < nvLength) {
        vessel = this.data.sectionH.NativeLesions[index];
      }
      output.push(this.nativeVesselStenosis(vessel));
    }
    return output;
  }

  private nativeVesselStenosis(data: any) {
    return [
      pdf.stack(
        pdf.input(data ? data.NVSegmentID : null, {
          alignment: 'center',
          margin: [0, 25, 0, 0]
        })
      ),
      pdf.stack(
        pdf.emptyLine(),
        pdf.block(
          pdf.field('Native Stenosis', { annotation: '7508' }),
          pdf.input(data ? data.NVCoroVesselStenosis : null, { blank: 5 }),
          ' %'
        ),
        pdf.block(
          pdf.field('Adjunctive Measurements Obtained', { annotation: '7511' }),
          pdf.tab(),
          pdf.radio('No', data ? data.NVAdjuncMeasObtained : null),
          pdf.tab(),
          pdf.radio('Yes', data ? data.NVAdjuncMeasObtained : null)
        ),
        pdf.columns(
          pdf.blockStyle({ width: 47 }, pdf.tab(), pdf.arrowIf(), ' Yes,'),
          pdf.blockStyle(
            { width: 105 },
            pdf.check('FFR', data ? data.NV_MeasurementType : null, { alias: ' ' }),
            pdf.field('FFR Ratio', { annotation: '7512' }),
            pdf.input(data ? data.NV_FFR : null, { blank: 6 })
          ),
          pdf.blockStyle(
            { width: 75 },
            pdf.radio('IC', data ? data.NV_FFR_Type : null),
            pdf.tab(),
            pdf.radio('IV', data ? data.NV_FFR_Type : null)
          ),
          pdf.block(
            pdf.check('IVUS', data ? data.NV_MeasurementType : null, { alias: ' ' }),
            pdf.field('IVUS MLA', { annotation: '7514' }),
            pdf.input(data ? data.NV_IVUS : null, { blank: 6 }),
            ' mm²'
          )
        ),
        pdf.columns(
          { text: '', width: 47 },
          pdf.blockStyle(
            { width: 180 },
            pdf.check('iFR', data ? data.NV_MeasurementType : null, { alias: ' ' }),
            pdf.field('iFR Ratio', { annotation: '7513' }),
            pdf.input(data ? data.NV_IFR : null, { blank: 6 })
          ),
          pdf.block(
            pdf.check('OCT', data ? data.NV_MeasurementType : null, { alias: ' ' }),
            pdf.field('OCT MLA', { annotation: '7515' }),
            pdf.input(data ? data.NV_OCT : null, { blank: 6 }),
            ' mm²'
          )
        )
      )
    ];
  }

  private getGraftAnatomy() {
    const output = [];
    const nvLength = this.data.sectionH.GraftLesions.length;
    const maxLength = nvLength < maxGraftLength ? maxGraftLength : nvLength;

    for (let index = 0; index < maxLength; index++) {
      let vessel = null;
      if (index < nvLength) {
        vessel = this.data.sectionH.GraftLesions[index];
      }
      output.push(this.graftVesselStenosis(vessel));
    }
    return output;
  }

  private graftVesselStenosis(data: any) {
    return [
      pdf.stack(
        pdf.input(data ? data.GraftSegmentID : null, {
          alignment: 'center',
          margin: [0, 25, 0, 0]
        })
      ),
      pdf.stack(
        pdf.emptyLine(),
        pdf.block(
          pdf.field('Graft Stenosis', { annotation: '7508' }),
          pdf.input(data ? data.GraftCoroVesselStenosis : null, { blank: 5 }),
          ' %',
          pdf.tab(),
          pdf.field('Graft Vessel', { annotation: '7529' }),
          pdf.radio('LIMA', data ? data.CABGGraftVessel : null),
          pdf.space(2),
          pdf.radio('RIMA', data ? data.CABGGraftVessel : null),
          pdf.space(2),
          pdf.radio('SVG', data ? data.CABGGraftVessel : null),
          pdf.space(2),
          pdf.radio('Radial', data ? data.CABGGraftVessel : null),
          pdf.space(2),
          pdf.radio('Unknown', data ? data.CABGGraftVessel : null)
        ),
        pdf.block(
          pdf.field('Adjunctive Measurements Obtained', { annotation: '7511' }),
          pdf.tab(),
          pdf.radio('No', data ? data.GraftAdjuncMeasObtained : null),
          pdf.tab(),
          pdf.radio('Yes', data ? data.GraftAdjuncMeasObtained : null)
        ),
        pdf.columns(
          pdf.blockStyle({ width: 47 }, pdf.tab(), pdf.arrowIf(), ' Yes,'),
          pdf.blockStyle(
            { width: 105 },
            pdf.check('FFR', data ? data.Graft_MeasurementType : null, { alias: ' ' }),
            pdf.field('FFR Ratio', { annotation: '7512' }),
            pdf.input(data ? data.Graft_FFR : null, { blank: 6 })
          ),
          pdf.blockStyle(
            { width: 75 },
            pdf.radio('IC', data ? data.Graft_FFR_Type : null),
            pdf.tab(),
            pdf.radio('IV', data ? data.Graft_FFR_Type : null)
          ),
          pdf.block(
            pdf.check('IVUS', data ? data.Graft_MeasurementType : null, { alias: ' ' }),
            pdf.field('IVUS MLA', { annotation: '7514' }),
            pdf.input(data ? data.Graft_IVUS : null, { blank: 6 }),
            ' mm²'
          )
        ),
        pdf.columns(
          { text: '', width: 47 },
          pdf.blockStyle(
            { width: 180 },
            pdf.check('iFR', data ? data.Graft_MeasurementType : null, { alias: ' ' }),
            pdf.field('iFR Ratio', { annotation: '7513' }),
            pdf.input(data ? data.Graft_IFR : null, { blank: 6 })
          ),
          pdf.block(
            pdf.check('OCT', data ? data.Graft_MeasurementType : null, { alias: ' ' }),
            pdf.field('OCT MLA', { annotation: '7515' }),
            pdf.input(data ? data.Graft_OCT : null, { blank: 6 }),
            ' mm²'
          )
        )
      )
    ];
  }

  private sectionI(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('I. PCI PROCEDURE'),
          {
            text: ' (Complete for Each Cath Lab Visit in which a PCI was Attempted or Performed)',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.block(
            pdf.field('PCI Status', { annotation: '7600' }),
            pdf.tab(),
            pdf.radio('Elective', this.data.sectionI.PCIStatus),
            pdf.tab(),
            pdf.radio('Urgent', this.data.sectionI.PCIStatus),
            pdf.tab(),
            pdf.radio('Emergency', this.data.sectionI.PCIStatus),
            pdf.tab(),
            pdf.radio('Salvage', this.data.sectionI.PCIStatus)
          ),
          {
            margin: [0, 0, 0, 5],
            table: {
              widths: [130, '*'],
              body: [
                [
                  pdf.stackStyle(
                    { fillColor: '#dddddd' },
                    pdf.emptyLine(),
                    pdf.block(
                      { text: 'Cardiac Arrest Out of Healthcare Facility', bold: true },
                      `⁴⁶³⁰ = 'Yes'`,
                      { text: ' or', bold: true }
                    ),
                    pdf.block(
                      { text: 'Cardiac Arrest at Transferring Healthcare Facility', bold: true },
                      `⁴⁶³⁵ = 'Yes'`,
                      { text: ' or', bold: true }
                    ),
                    pdf.block(
                      { text: 'Cardiac Arrest at This Facility', bold: true },
                      `⁷³⁴⁰ = 'Yes'`
                    )
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.block(
                      pdf.field('Hypothermia Induced', { annotation: '7806' }),
                      pdf.tab(),
                      pdf.radio('No', this.data.sectionI.HypothermiaInduced),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionI.HypothermiaInduced)
                    ),
                    pdf.columns(
                      pdf.stackStyle(
                        { width: 160 },
                        pdf.block(
                          pdf.space(2),
                          pdf.arrowIf(),
                          ' Yes, ',
                          pdf.field('Timing of Hypothermia', { annotation: '7807' })
                        ),
                        pdf.block(
                          pdf.tab(12),
                          pdf.radio('Post PCI', this.data.sectionI.HypothermiaInducedTiming)
                        )
                      ),
                      pdf.stack(
                        pdf.radio(
                          'Initiated Pre-PCI, <= 6 hrs post cardiac arrest',
                          this.data.sectionI.HypothermiaInducedTiming
                        ),
                        pdf.radio(
                          'Initiated Pre-PCI, > 6 hrs post cardiac arrest',
                          this.data.sectionI.HypothermiaInducedTiming
                        )
                      )
                    ),
                    pdf.block(
                      pdf.field('Level of Consciousness', { annotation: '7810' }),
                      '(at start of PCI s/p cardiac arrest)'
                    ),
                    pdf.columns(
                      { text: '', width: 25 },
                      pdf.stack(
                        pdf.radio('(A) Alert', this.data.sectionI.LOCProc),
                        pdf.radio('(V) Verbal', this.data.sectionI.LOCProc)
                      ),
                      pdf.stack(
                        pdf.radio('(P) Pain', this.data.sectionI.LOCProc),
                        pdf.radio('(U) Unresponsive', this.data.sectionI.LOCProc)
                      ),
                      pdf.radio('Unable to Assess', this.data.sectionI.LOCProc)
                    )
                  )
                ]
              ]
            }
          },
          pdf.columns(
            pdf.field('Indicated Procedure Risk', { width: 180 }),
            pdf.stack(
              pdf.radio(
                'Simple Low Risk Indicated Procedure (SLIP)',
                this.data.sectionI.PCIProcedureRisk
              ),
              pdf.radio(
                'Complex High Risk Indicated Procedure (CHIP)',
                this.data.sectionI.PCIProcedureRisk
              ),
              pdf.block(pdf.tab(2), pdf.check('Chronic Total Occlusion', this.data.sectionI.CHIP)),
              pdf.block(pdf.tab(2), pdf.check('Bifurcation Lesion', this.data.sectionI.CHIP)),
              pdf.block(
                pdf.tab(2),
                pdf.check('Poor LV function with Device support', this.data.sectionI.CHIP)
              ),
              pdf.block(pdf.tab(2), pdf.check('Left Main Disease ≥ 50%', this.data.sectionI.CHIP)),
              pdf.block(pdf.tab(2), pdf.check('Severe Calcification', this.data.sectionI.CHIP))
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Decision for PCI with Surgical Consult', { annotation: '7815', width: 180 }),
            pdf.block(
              pdf.radio('No', this.data.sectionI.PCIDecision),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionI.PCIDecision)
            )
          ),
          {
            canvas: [
              { type: 'line', x1: 180, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, color: 'gray' }
            ]
          },
          pdf.emptyLine(),
          pdf.columns(
            pdf.blockStyle(
              { width: 180 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('CV Treatment Decision', { annotation: '7816' })
            ),
            pdf.stack(
              pdf.radio('Surgery NOT Recommended', this.data.sectionI.CVTxDecision),
              pdf.radio(
                'Surgery Recommended, Patient/Family Declined',
                this.data.sectionI.CVTxDecision
              ),
              pdf.radio(
                'Surgery Recommended, Patient/Family Accepted (Hybrid procedure)',
                this.data.sectionI.CVTxDecision
              )
            )
          ),
          {
            canvas: [
              { type: 'line', x1: 180, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, color: 'gray' }
            ]
          },
          pdf.emptyLine(),
          pdf.columns(
            pdf.blockStyle(
              { width: 180 },
              pdf.tab(),
              pdf.arrowIf(),
              ' No, ',
              pdf.field('CV Treatment Decision', { annotation: '7816' })
            ),
            pdf.stack(
              pdf.radio('Surgical information sheet provided', this.data.sectionI.CVSheetDecision),
              pdf.radio(
                'Surgical information sheet NOT provided',
                this.data.sectionI.CVSheetDecision
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('PCI for Multi-vessel Disease', { annotation: '7820' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionI.MultiVesselDz),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionI.MultiVesselDz)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Multi-vessel Procedure Type', { annotation: '7820' }),
            '(in this lab visit)',
            pdf.tab(),
            pdf.radio('Initial PCI', this.data.sectionI.MultiVessProcType),
            pdf.tab(),
            pdf.radio('Staged PCI', this.data.sectionI.MultiVessProcType)
          ),
          pdf.block(
            pdf.field('Stage PCI Planned'),
            pdf.tab(),
            pdf.radio('No', this.data.sectionI.StagePCIPlanned),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionI.StagePCIPlanned)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('PCI Indication', { annotation: '7825', width: 90 }),
            pdf.stack(
              pdf.radio('STEMI - Immediate PCI for Acute STEMI', this.data.sectionI.PCIIndication),
              pdf.radio('STEMI - Stable (<= 12 hrs from Sx)', this.data.sectionI.PCIIndication),
              pdf.radio('STEMI - Stable (> 12 hrs from Sx)', this.data.sectionI.PCIIndication),
              pdf.radio('STEMI - Unstable (> 12 hrs from Sx)', this.data.sectionI.PCIIndication),
              pdf.radio(
                'STEMI (after successful lytics) <= 24 hrs',
                this.data.sectionI.PCIIndication
              ),
              pdf.radio(
                'STEMI (after successful lytics) > 24 hrs - 7 days',
                this.data.sectionI.PCIIndication
              ),
              pdf.radio(
                'STEMI - Rescue (after unsuccessful lytics)',
                this.data.sectionI.PCIIndication
              )
            ),
            pdf.stack(
              pdf.radio('New Onset Angina <= 2 months', this.data.sectionI.PCIIndication),
              pdf.radio('NSTE-ACS', this.data.sectionI.PCIIndication),
              pdf.radio('Stable Angina', this.data.sectionI.PCIIndication),
              pdf.radio('CAD (without ischemic Sx)', this.data.sectionI.PCIIndication),
              pdf.radio('Other', this.data.sectionI.PCIIndication)
            )
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: 280 },
              pdf.tab(),
              pdf.arrowIf(),
              ' any STEMI, ',
              pdf.field('Symptom Date/Time'),
              pdf.date(
                this.data.sectionI.SymptomDateTime,
                this.data.sectionI.SymptomOnset === 'Unknown' ? 'date' : 'datetime'
              )
            ),
            pdf.block(
              pdf.field('Symptom Onset'),
              pdf.space(2),
              pdf.radio('Exacted', this.data.sectionI.SymptomOnset),
              pdf.space(2),
              pdf.radio('Estimated', this.data.sectionI.SymptomOnset),
              pdf.space(2),
              pdf.radio('Unknown', this.data.sectionI.SymptomOnset)
            )
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: 195 },
              pdf.tab(),
              pdf.arrowIf(),
              ' any STEMI (lytics), ',
              pdf.field('Thrombolytics', { annotation: '7829' })
            ),
            pdf.stackStyle(
              { width: 110 },
              pdf.radio('No', this.data.sectionI.ThromTherapy),
              pdf.radio('Streptokinase (SK)', this.data.sectionI.ThromTherapy)
            ),
            pdf.stack(
              pdf.radio('Tissue Plasminogen Activators (tPA)', this.data.sectionI.ThromTherapy),
              pdf.block(
                pdf.radio('Tenecteplase (TNK-tPA)', this.data.sectionI.ThromTherapy),
                pdf.tab(3),
                pdf.radio('Other', this.data.sectionI.ThromTherapy)
              )
            )
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' any Thrombolytics, ',
            pdf.field('Start Date/Time', { annotation: '7830' }),
            pdf.date(this.data.sectionI.ThromDateTime, 'datetime')
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' not STEMI, ',
            pdf.field('Syntax Score', { annotation: '7831' }),
            pdf.tab(),
            pdf.radio('Low', this.data.sectionI.SyntaxScore),
            pdf.tab(),
            pdf.radio('Intermediate', this.data.sectionI.SyntaxScore),
            pdf.tab(),
            pdf.radio('High', this.data.sectionI.SyntaxScore),
            pdf.tab(),
            pdf.radio('Unknown', this.data.sectionI.SyntaxScore),
            pdf.tab(2),
            pdf.field('Syntax Score Value'),
            pdf.input(this.data.sectionI.SyntaxScoreValue)
          ),
          {
            margin: [0, 0, 0, 3],
            table: {
              widths: [70, '*'],
              body: [
                [
                  pdf.stackStyle(
                    { fillColor: '#dddddd', margin: [0, 50, 0, 0] },
                    pdf.block(
                      pdf.arrowIf(),
                      { text: ' PCI Indication', bold: true },
                      `⁷⁸²⁵ = 'STEMI – Immediate PCI for Acute STEMI'`
                    )
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.block(
                      pdf.field('STEMI or STEMI Equivalent First Noted', { annotation: '7835' }),
                      pdf.tab(),
                      pdf.radio('First ECG', this.data.sectionI.StemiFirstNoted),
                      pdf.tab(),
                      pdf.radio('Subsequent ECG', this.data.sectionI.StemiFirstNoted)
                    ),
                    pdf.block(
                      pdf.tab(),
                      pdf.arrowIf(),
                      ' Subsequent ECG, ',
                      pdf.field('ECG with STEMI/ STEMI Equivalent Date & Time', {
                        annotation: '7836'
                      }),
                      pdf.date(this.data.sectionI.SubECGDateTime, 'datetime')
                    ),
                    pdf.block(
                      pdf.tab(),
                      pdf.arrowIf(),
                      ' Subsequent ECG, ',
                      pdf.field('ECG obtained in Emergency Department', { annotation: '7840' }),
                      pdf.tab(),
                      pdf.radio('No', this.data.sectionI.SubECGED),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionI.SubECGED)
                    ),
                    pdf.block(
                      pdf.field('Transferred In For Immediate PCI for STEMI', {
                        annotation: '7841'
                      }),
                      pdf.tab(),
                      pdf.radio('No', this.data.sectionI.PatientTransPCI),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionI.PatientTransPCI)
                    ),
                    pdf.block(
                      pdf.tab(),
                      pdf.arrowIf(),
                      ' Yes, ',
                      pdf.field('Date & Time ED Presentation at Referring Facility', {
                        annotation: '7842'
                      }),
                      pdf.date(this.data.sectionI.EDPresentDateTime, 'datetime')
                    ),
                    pdf.block(
                      pdf.field('First Device Activation Date & Time', { annotation: '7845' }),
                      pdf.date(this.data.sectionI.FirstDevActiDateTime, 'datetime')
                    ),
                    pdf.block(
                      pdf.field('Patient Centered Reason for Delay in PCI', { annotation: '7850' }),
                      pdf.tab(),
                      pdf.radio('No', this.data.sectionIPtPCIDelayReason),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionIPtPCIDelayReason)
                    ),
                    pdf.columns(
                      pdf.blockStyle(
                        { width: 110 },
                        pdf.tab(),
                        pdf.arrowIf(),
                        ' Yes, ',
                        pdf.field('Reason', { annotation: '7851' })
                      ),
                      pdf.stack(
                        pdf.columns(
                          pdf.prop(
                            pdf.radio(
                              'Difficult Vascular Access',
                              this.data.sectionI.PCIDelayReason
                            ),
                            { width: 250 }
                          ),
                          pdf.radio('Other', this.data.sectionI.PCIDelayReason)
                        ),
                        pdf.radio(
                          'Difficulty crossing the culprit lesion',
                          this.data.sectionI.PCIDelayReason
                        ),
                        pdf.radio(
                          'Cardiac Arrest and/or need for intubation before PCI',
                          this.data.sectionI.PCIDelayReason
                        ),
                        pdf.radio(
                          'Patient delays in providing consent for PCI',
                          this.data.sectionI.PCIDelayReason
                        ),
                        pdf.radio(
                          'Emergent placement of LV support device before PCI',
                          this.data.sectionI.PCIDelayReason
                        )
                      )
                    )
                  )
                ]
              ]
            }
          }
        )
      ],
      [
        pdf.text(
          'PCI PROCEDURE MEDICATONS (Administered within 24 hours prior to and during the PCI procedure)',
          { style: 'subSection', pageBreak: 'before' }
        )
      ],
      [
        pdf.stack(pdf.emptyLine(), {
          margin: [0, 0, 0, 3],
          table: {
            widths: '*',
            body: [
              [
                pdf.blockStyle(
                  { alignment: 'center', fillColor: '#dddddd', lineHeight: 1.0, colSpan: 2 },
                  { text: 'Medication', bold: true },
                  '⁷⁹⁹⁰'
                ),
                '',
                pdf.blockStyle(
                  { alignment: 'center', fillColor: '#dddddd', lineHeight: 1.0 },
                  { text: 'Administered', bold: true },
                  '⁷⁹⁹⁵'
                )
              ],
              [
                { text: 'Anticoagulant', bold: true, margin: [0, 40, 0, 0] },
                pdf.stack(
                  pdf.emptyLine(),
                  'Argatroban',
                  'Bivalirudin',
                  'Fondaparinux',
                  'Heparin Derivative',
                  'Low Molecular Weight Heparin',
                  'Unfractionated Heparin',
                  'Warfarin'
                ),
                pdf.stack(
                  pdf.emptyLine(),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Argatroban),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Argatroban)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Bivalirudin),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Bivalirudin)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Fondaparinux),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Fondaparinux)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.HeparinDerivative),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.HeparinDerivative)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.LMWH),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.LMWH)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.UFH),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.UFH)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Warfarin),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Warfarin)
                  )
                )
              ],
              [
                { text: 'Antiplatelet', bold: true, margin: [0, 5, 0, 0] },
                pdf.text('Vorapaxar', { margin: [0, 5, 0, 0] }),
                pdf.blockStyle(
                  { alignment: 'center', margin: [0, 5, 0, 0] },
                  pdf.radio('No', this.data.sectionI.Vorapaxar),
                  pdf.tab(),
                  pdf.radio('Yes', this.data.sectionI.Vorapaxar)
                )
              ],
              [
                {
                  text: 'Glycoprotein (GP) IIb/IIIa Inhibitors',
                  bold: true,
                  margin: [0, 5, 0, 0]
                },
                pdf.text('GP IIb/IIIa Inhibitors (Any)', { margin: [0, 5, 0, 0] }),
                pdf.blockStyle(
                  { alignment: 'center', margin: [0, 5, 0, 0] },
                  pdf.radio('No', this.data.sectionI.GPIIbIIIa),
                  pdf.tab(),
                  pdf.radio('Yes', this.data.sectionI.GPIIbIIIa)
                )
              ],
              [
                {
                  text: 'Non-Vitamin K Dependent Oral Anticoangulant',
                  bold: true,
                  margin: [0, 17, 0, 0]
                },
                pdf.stack(pdf.emptyLine(), 'Apixaban', 'Dabigatran', 'Edoxaban', 'Rivaroxaban'),
                pdf.stack(
                  pdf.emptyLine(),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Apixaban),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Apixaban)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Dabigatran),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Dabigatran)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Edoxaban),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Edoxaban)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Rivaroxaban),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Rivaroxaban)
                  )
                )
              ],
              [
                { text: 'P2Y12 Inhibitors', bold: true, margin: [0, 23, 0, 0] },
                pdf.stack(pdf.emptyLine(), 'Cangrelor', 'Clopidogrel', 'Prasugrel', 'Ticagrelor'),
                pdf.stack(
                  pdf.emptyLine(),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Cangrelor),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Cangrelor)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Clopidogrel),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Clopidogrel)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Prasugrel),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Prasugrel)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data.sectionI.Ticagrelor),
                    pdf.tab(),
                    pdf.radio('Yes', this.data.sectionI.Ticagrelor)
                  )
                )
              ]
            ]
          }
        })
      ]
    ];
  }

  private sectionJ(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('J. LESIONS AND DEVICES'),
          {
            text: ' (Complete for Each PCI Attempted or Performed)',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          ...this.getPci(),
          {
            margin: [0, 3, 0, 5],
            table: {
              widths: [200, 110, '*', 40, 40],
              body: [
                [
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', margin: [0, 8, 0, 0] },
                    { text: 'Intracoronary Device(s) Used', bold: true },
                    `⁸⁰²⁷'⁸⁰²⁸`
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', margin: [0, 3, 0, 0] },
                    { text: 'Unique Device Identifier (UDI)', bold: true },
                    `⁸⁰²⁹`
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', margin: [0, 3, 0, 0] },
                    { text: 'Associated Lesion(s)', bold: true },
                    `⁸⁰³⁰`
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', margin: [0, 5, 0, 0] },
                    { text: 'Diameter', bold: true },
                    `\n⁸⁰³¹`
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', margin: [0, 5, 0, 0] },
                    { text: 'Length', bold: true },
                    `\n⁸⁰³²`
                  )
                ],
                ...this.getDevice()
              ]
            }
          },
          pdf.block(
            pdf.field('PCI Result'),
            pdf.tab(),
            pdf.radio('Angiographic Success', this.data.sectionJ.PCIResult),
            pdf.tab(),
            pdf.radio('Angiographic Failure', this.data.sectionJ.PCIResult)
          )
        )
      ]
    ];
  }

  private getPci() {
    const output = [];
    const pciLength = this.data.sectionJ.PciLesions.length;
    const maxLength = pciLength < maxPciLength ? maxPciLength : pciLength;

    for (let index = 0; index < maxLength; index++) {
      let pci = null;
      if (index < pciLength) {
        pci = this.data.sectionJ.PciLesions[index];
      }
      output.push(this.pciLesion(pci));
      output.push({ text: '', pageBreak: 'after' });
    }
    return output;
  }

  private pciLesion(data: any) {
    return [
      pdf.emptyLine(),
      {
        margin: [0, 0, 0, 3],
        table: {
          widths: '*',
          body: [
            [
              pdf.blockStyle(
                { alignment: 'center', fillColor: '#dddddd', lineHeight: 1.0, colSpan: 2 },
                pdf.field('Lesion Counter', { annotation: '8000' }),
                pdf.input(data ? data.LesionCounter : null, { blank: 6 })
              ),
              ''
            ],
            [
              pdf.stackStyle(
                { colSpan: 2 },
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Segment Number(s)', { annotation: '8001' }),
                  pdf.inputArray(data ? data.SegmentID : null)
                )
              ),
              ''
            ],
            [
              pdf.stack(
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Stenosis Immediately Prior to Rx', { annotation: '8004' }),
                  pdf.input(data ? data.StenosisPriorTreat : null),
                  ' %'
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' 100%, ',
                  pdf.field('Chronic Total Occlusion', { annotation: '8005' })
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.radio('No', data ? data.ChronicOcclusion : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.ChronicOcclusion : null),
                  pdf.tab(),
                  pdf.radio('Unknown', data ? data.ChronicOcclusion : null)
                ),
                pdf.field('TIMI Flow (Pre-Intervention)', { annotation: '8007' }),
                pdf.block(
                  pdf.tab(3),
                  pdf.radio('TIMI-0', data ? data.PreProcTIMI : null),
                  pdf.tab(),
                  pdf.radio('TIMI-1', data ? data.PreProcTIMI : null),
                  pdf.tab(),
                  pdf.radio('TIMI-2', data ? data.PreProcTIMI : null),
                  pdf.tab(),
                  pdf.radio('TIMI-3', data ? data.PreProcTIMI : null)
                ),
                pdf.lineHalf(),
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Previously Treated Lesion', { annotation: '8008' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.PrevTreatedLesion : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.PrevTreatedLesion : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Date', { annotation: '8009' }),
                  pdf.date(data ? data.PrevTreatedLesionDate : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Treated with Stent', { annotation: '8010' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.PreviousStent : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.PreviousStent : null)
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('In-stent Restenosis', { annotation: '8011' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.InRestenosis : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.InRestenosis : null)
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('In-stent Thrombosis', { annotation: '8012' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.InThrombosis : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.InThrombosis : null)
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Stent Type', { annotation: '8013' })
                ),
                pdf.columns(
                  { text: '', width: 35 },
                  pdf.stackStyle(
                    { width: 115 },
                    pdf.radio('Bare Metal Stent (BMS)', data ? data.StentType : null),
                    pdf.radio('Drug-Eluting Stent (DES)', data ? data.StentType : null)
                  ),
                  pdf.stack(
                    pdf.radio('Bioabsorbable Stent', data ? data.StentType : null),
                    pdf.radio('Unknown', data ? data.StentType : null)
                  )
                ),
                pdf.lineHalf(),
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Lesion in Graft', { annotation: '8015' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.LesionGraft : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.LesionGraft : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Type of CABG Graft', { annotation: '8016' })
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.radio('LIMA', data ? data.LesionGraftType : null),
                  pdf.tab(),
                  pdf.radio('Vein', data ? data.LesionGraftType : null),
                  pdf.tab(),
                  pdf.radio('Other Artery', data ? data.LesionGraftType : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Location in Graft', { annotation: '8017' })
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.radio('Aortic', data ? data.LocGraft : null),
                  pdf.tab(),
                  pdf.radio('Body', data ? data.LocGraft : null),
                  pdf.tab(),
                  pdf.radio('Distal', data ? data.LocGraft : null)
                ),
                pdf.block(
                  pdf.field('Navigate through Graft to Native Lesion', { annotation: '8018' }),
                  pdf.space(),
                  pdf.radio('No', data ? data.NavGraftNatLes : null),
                  pdf.space(2),
                  pdf.radio('Yes', data ? data.NavGraftNatLes : null)
                ),
                pdf.lineHalf(),
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Bifurcation Lesion'),
                  pdf.tab(),
                  pdf.radio('No', data ? data.BifurcationLesion : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.BifurcationLesion : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Bifurcation Classification')
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.radio('1,1,1', data ? data.BifurcationClassification : null),
                  pdf.tab(),
                  pdf.radio('1,1,0', data ? data.BifurcationClassification : null),
                  pdf.tab(),
                  pdf.radio('1,0,1', data ? data.BifurcationClassification : null),
                  pdf.tab(),
                  pdf.radio('0,1,1', data ? data.BifurcationClassification : null)
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.radio('1,0,0', data ? data.BifurcationClassification : null),
                  pdf.tab(),
                  pdf.radio('0,1,0', data ? data.BifurcationClassification : null),
                  pdf.tab(),
                  pdf.radio('0,0,1', data ? data.BifurcationClassification : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Bifurcation Stenting'),
                  pdf.tab(),
                  pdf.radio('No', data ? data.BifurcationStenting : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.BifurcationStenting : null)
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Stent Technique Strategy')
                ),
                pdf.block(
                  pdf.tab(4),
                  pdf.radio(
                    'Provisional MB stenting (stent MB first)',
                    data ? data.StentTechniqueStrategy : null
                  )
                ),
                pdf.block(
                  pdf.tab(4),
                  pdf.radio(
                    'Provisional SB stenting (stent SB first)',
                    data ? data.StentTechniqueStrategy : null
                  )
                ),
                pdf.block(pdf.tab(2), pdf.arrowIf(), ' Yes, ', pdf.field('Stent Technique')),
                pdf.block(
                  pdf.tab(4),
                  pdf.radio('DK Crush (Double Kissing Crush)', data ? data.StentTechnique : null)
                ),
                pdf.columns(
                  { text: '', width: 36 },
                  pdf.radio('Culotte', data ? data.StentTechnique : null),
                  pdf.radio('V stenting', data ? data.StentTechnique : null)
                ),
                pdf.columns(
                  { text: '', width: 36 },
                  pdf.radio('Modified T stenting', data ? data.StentTechnique : null),
                  pdf.radio('T and Protusion', data ? data.StentTechnique : null)
                ),
                pdf.columns(
                  { text: '', width: 36 },
                  pdf.radio('Kissing stenting', data ? data.StentTechnique : null),
                  pdf.radio('Dedicated stenting', data ? data.StentTechnique : null)
                )
              ),
              pdf.stack(
                pdf.emptyLine(),
                pdf.block(pdf.arrowIf(), ' PCI Indication⁷⁸²⁵ is STEMI or NSTE-ACS,'),
                pdf.block(
                  pdf.tab(2),
                  pdf.field('Culprit Stenosis', { annotation: '8002' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.CulpritArtery : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.CulpritArtery : null),
                  pdf.tab(),
                  pdf.radio('Unknown', data ? data.CulpritArtery : null)
                ),
                pdf.lineHalf(),
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Lesion Complexity', { annotation: '8019' }),
                  pdf.tab(),
                  pdf.radio('Non-High/Non-C', data ? data.LesionComplexity : null),
                  pdf.tab(),
                  pdf.radio('High/C', data ? data.LesionComplexity : null)
                ),
                pdf.block(
                  pdf.field('Lesion Length', { annotation: '8020' }),
                  pdf.input(data ? data.LesionLength : null),
                  ' mm'
                ),
                pdf.block(
                  pdf.field('Severe Calcification', { annotation: '8021' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.SevereCalcification : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.SevereCalcification : null)
                ),
                pdf.lineHalf(),
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Guidewire Across Lesion', { annotation: '8023' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.GuidewireLesion : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.GuidewireLesion : null)
                ),
                pdf.block(pdf.tab(), pdf.arrowIf(), ' Yes, ', pdf.field('Guidewire Across')),
                pdf.block(
                  pdf.tab(3),
                  pdf.check('Main branch', data ? data.GuidewireAcross : null),
                  pdf.tab(),
                  pdf.check('Side branch', data ? data.GuidewireAcross : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Device(s) Deployed', { annotation: '8024' }),
                  pdf.tab(),
                  pdf.radio('No', data ? data.DeviceDeployed : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.DeviceDeployed : null)
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Intracoronary Measurement Study')
                ),
                pdf.block(
                  pdf.tab(4),
                  pdf.radio('No', data ? data.InThroIntraCoroMeasurementmbosis : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.IntraCoroMeasurement : null)
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Intracoronary Measurement Site')
                ),
                pdf.block(
                  pdf.tab(5),
                  pdf.check('Main branch', data ? data.IntraCoroMeasurementSite : null),
                  pdf.tab(),
                  pdf.check('Side branch', data ? data.IntraCoroMeasurementSite : null)
                ),
                pdf.block(
                  pdf.tab(4),
                  pdf.arrowIf(),
                  ' Main branch, ',
                  pdf.field('Measurement Type')
                ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.blockStyle(
                    { width: 115 },
                    pdf.check('FFR', data ? data.MB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('FFR Ratio'),
                    pdf.input(data ? data.MB_FFR : null, { blank: 6 })
                  ),
                  pdf.block(
                    pdf.field('Type'),
                    pdf.radio('IC', data ? data.MB_FFR_Type : null),
                    pdf.space(2),
                    pdf.radio('IV', data ? data.MB_FFR_Type : null)
                  )
                ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.block(
                    pdf.check('iFR', data ? data.MB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('iFR Ratio'),
                    pdf.input(data ? data.MB_IFR : null, { blank: 6 })
                  )
                ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.blockStyle(
                    { width: 115 },
                    pdf.check('IVUS', data ? data.MB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('IVUS Pre MLA'),
                    pdf.input(data ? data.MB_IVUS_Pre : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  ),
                  pdf.block(
                    pdf.field('Post MLA'),
                    pdf.input(data ? data.MB_IVUS_Post : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  )
                ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.blockStyle(
                    { width: 115 },
                    pdf.check('OCT', data ? data.MB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('OCT Pre MLA'),
                    pdf.input(data ? data.MB_OCT_Pre : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  ),
                  pdf.block(
                    pdf.field('Post MLA'),
                    pdf.input(data ? data.MB_OCT_Post : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  )
                ),
                pdf.block(
                  pdf.tab(4),
                  pdf.arrowIf(),
                  ' Side branch, ',
                  pdf.field('Measurement Type')
                ),
                // pdf.columns(
                //   { text: '', width: 55 },
                //   pdf.block(
                //     pdf.field('FFR Ratio'),
                //     pdf.input(data ? data.SB_FFR : null, { blank: 6 })
                //   ),
                //   pdf.block(
                //     pdf.field('FFR Type'),
                //     pdf.radio('IC', data ? data.SB_FFR_Type : null),
                //     pdf.space(2),
                //     pdf.radio('IV', data ? data.SB_FFR_Type : null)
                //   )
                // ),
                // pdf.block(
                //   pdf.tab(6),
                //   pdf.field('iFR Ratio'),
                //   pdf.input(data ? data.SB_IFR : null, { blank: 6 })
                // ),
                // pdf.columns(
                //   { text: '', width: 55 },
                //   pdf.block(
                //     pdf.field('IVUS Pre MLA'),
                //     pdf.input(data ? data.SB_IVUS_Pre : null, { blank: 5 })
                //   ),
                //   pdf.block(
                //     pdf.field('IVUS Post MLA'),
                //     pdf.input(data ? data.SB_IVUS_Post : null, { blank: 5 })
                //   )
                // ),
                // pdf.columns(
                //   { text: '', width: 55 },
                //   pdf.block(
                //     pdf.field('OCT Pre MLA'),
                //     pdf.input(data ? data.SB_OCT_Pre : null, { blank: 5 })
                //   ),
                //   pdf.block(
                //     pdf.field('OCT Post MLA'),
                //     pdf.input(data ? data.SB_OCT_Post : null, { blank: 5 })
                //   )
                // ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.blockStyle(
                    { width: 115 },
                    pdf.check('FFR', data ? data.SB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('FFR Ratio'),
                    pdf.input(data ? data.SB_FFR : null, { blank: 6 })
                  ),
                  pdf.block(
                    pdf.field('Type'),
                    pdf.radio('IC', data ? data.SB_FFR_Type : null),
                    pdf.space(2),
                    pdf.radio('IV', data ? data.SB_FFR_Type : null)
                  )
                ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.block(
                    pdf.check('iFR', data ? data.SB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('iFR Ratio'),
                    pdf.input(data ? data.SB_IFR : null, { blank: 6 })
                  )
                ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.blockStyle(
                    { width: 115 },
                    pdf.check('IVUS', data ? data.SB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('IVUS Pre MLA'),
                    pdf.input(data ? data.SB_IVUS_Pre : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  ),
                  pdf.block(
                    pdf.field('Post MLA'),
                    pdf.input(data ? data.SB_IVUS_Post : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  )
                ),
                pdf.columns(
                  { text: '', width: 45 },
                  pdf.blockStyle(
                    { width: 115 },
                    pdf.check('OCT', data ? data.SB_MeasurementType : null, { alias: ' ' }),
                    pdf.field('OCT Pre MLA'),
                    pdf.input(data ? data.SB_OCT_Pre : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  ),
                  pdf.block(
                    pdf.field('Post MLA'),
                    pdf.input(data ? data.SB_OCT_Post : null, { blank: 5 }),
                    pdf.text(' mm²', { fontSize: 6 })
                  )
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Stent(s) Deployed'),
                  pdf.tab(),
                  pdf.radio('No', data ? data.StentDeployed : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.StentDeployed : null)
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Number of Stent Used'),
                  pdf.input(data ? data.NumberStentUsed : null)
                ),
                pdf.block(
                  pdf.tab(3),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Stent Deployed Strategy'),
                  pdf.check('Direct stenting', data ? data.StentDeployedStrategy : null)
                ),
                pdf.block(
                  pdf.tab(5),
                  pdf.check('Elective stenting', data ? data.StentDeployedStrategy : null),
                  pdf.tab(),
                  pdf.check('Bailout stenting', data ? data.StentDeployedStrategy : null)
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Stenosis (Post-Intervention)', { annotation: '8025' }),
                  pdf.input(data ? data.StenosisPostProc : null, { blank: 6 }),
                  ' %'
                ),
                pdf.block(
                  pdf.tab(2),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('TIMI Flow (Post-Intervention)')
                ),
                pdf.block(
                  pdf.tab(4),
                  pdf.radio('TIMI-0', data ? data.PostProcTIMI : null),
                  pdf.tab(),
                  pdf.radio('TIMI-1', data ? data.PostProcTIMI : null),
                  pdf.tab(),
                  pdf.radio('TIMI-2', data ? data.PostProcTIMI : null),
                  pdf.tab(),
                  pdf.radio('TIMI-3', data ? data.PostProcTIMI : null)
                ),
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 18,
                      y1: -290,
                      x2: 18,
                      y2: -23,
                      lineWidth: 0.5,
                      color: 'gray'
                    }
                  ]
                },
                pdf.lineHalf(),
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Final Adjuctive Balloon Angioplasty'),
                  pdf.tab(),
                  pdf.radio('No', data ? data.FinalAdjBalAngioplasty : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.FinalAdjBalAngioplasty : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Proximal Optimization'),
                  pdf.tab(),
                  pdf.radio('No', data ? data.ProxOptimize : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.ProxOptimize : null)
                ),
                pdf.block(
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Final Kissing Balloon Inflation'),
                  pdf.tab(),
                  pdf.radio('No', data ? data.FinalKissBalloon : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.FinalKissBalloon : null)
                )
              )
            ],
            [
              pdf.stackStyle(
                { colSpan: 2 },
                pdf.emptyLine(),
                pdf.block(
                  pdf.field('Complication During PCI'),
                  pdf.tab(),
                  pdf.radio('No', data ? data.ComplicationPCI : null),
                  pdf.tab(),
                  pdf.radio('Yes', data ? data.ComplicationPCI : null),
                  pdf.tab(4),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Detail of Complication')
                ),
                pdf.stack(
                  pdf.columns(
                    { text: '', width: 9 },
                    pdf.stack(
                      pdf.check('Abrupt Vessel Closure', data ? data.ComplicationPCIDetail : null),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Re-established flow', data ? data.AbruptVesselClosure : null)
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Observation', data ? data.AbruptVesselClosure : null)
                      ),
                      pdf.check(
                        'Coronary Artery Perforation',
                        data ? data.ComplicationPCIDetail : null
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Stent grafting', data ? data.CoronaryArteryPerforation : null)
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio(
                          'Prolong ballon inflation',
                          data ? data.CoronaryArteryPerforation : null
                        )
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio(
                          'Distal embolization (Coil)',
                          data ? data.CoronaryArteryPerforation : null
                        )
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio(
                          'Distal embolization (Fat)',
                          data ? data.CoronaryArteryPerforation : null
                        )
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio(
                          'Distal embolization (Clot)',
                          data ? data.CoronaryArteryPerforation : null
                        )
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Observation', data ? data.CoronaryArteryPerforation : null)
                      )
                    ),
                    pdf.stack(
                      pdf.check(
                        'Coronary Artery Dissection',
                        data ? data.ComplicationPCIDetail : null
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Stenting', data ? data.CoronaryArteryDissection : null)
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio(
                          'Prolong ballon inflation',
                          data ? data.CoronaryArteryDissection : null
                        )
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Observation', data ? data.CoronaryArteryDissection : null)
                      ),
                      pdf.check(
                        'Longitudinal Stent Deformation',
                        data ? data.ComplicationPCIDetail : null
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio(
                          'Re-ballon inflation',
                          data ? data.LongitudinalStentDeformation : null
                        )
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio(
                          'Repeat stent implantation',
                          data ? data.LongitudinalStentDeformation : null
                        )
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Observation', data ? data.LongitudinalStentDeformation : null)
                      ),
                      pdf.check('Thrombus Embolization', data ? data.ComplicationPCIDetail : null),
                      pdf.check(
                        'Disruption of Collateral flow',
                        data ? data.ComplicationPCIDetail : null
                      )
                    ),
                    pdf.stack(
                      pdf.check('Burr Entrapment', data ? data.ComplicationPCIDetail : null),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Success manual pullback', data ? data.BurrEntrapment : null)
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Coronary artery bypass graft', data ? data.BurrEntrapment : null)
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Observation', data ? data.BurrEntrapment : null)
                      ),
                      pdf.check('Device Embolization', data ? data.ComplicationPCIDetail : null),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Retrieve', data ? data.DeviceEmbolization : null)
                      ),
                      pdf.block(
                        pdf.tab(2),
                        pdf.radio('Retain', data ? data.DeviceEmbolization : null)
                      ),
                      pdf.check(
                        'Persistent Slow flow or No flow',
                        data ? data.ComplicationPCIDetail : null
                      ),
                      pdf.check('Intramural Hematoma', data ? data.ComplicationPCIDetail : null)
                    )
                  )
                ),
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 160,
                      y1: -140,
                      x2: 160,
                      y2: 0,
                      lineWidth: 0.5,
                      color: 'gray'
                    }
                  ]
                },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 323,
                      y1: -140,
                      x2: 323,
                      y2: 0,
                      lineWidth: 0.5,
                      color: 'gray'
                    }
                  ]
                }
              ),
              ''
            ]
          ]
        }
      }
    ];
  }

  private getDevice() {
    const output = [];
    const deviceLength = this.data.sectionJ.PciDevices.length;
    const maxLength = deviceLength < maxDeviceLength ? maxDeviceLength : deviceLength;

    for (let index = 0; index < maxLength; index++) {
      let device = null;
      if (index < deviceLength) {
        device = this.data.sectionJ.PciDevices[index];
      }
      output.push(this.deviceLesion(device));
    }
    return output;
  }

  private deviceLesion(data: any) {
    return [
      data
        ? pdf.blockStyle(
            { style: 'deviceCell' },
            pdf.input(data.ICDevCounter),
            '. ',
            pdf.input(data.ICDevID)
          )
        : { text: ' ', style: 'deviceCell' },
      data
        ? pdf.blockStyle({ style: 'deviceCell' }, pdf.input(data.ICDevUDI))
        : { text: ' ', style: 'deviceCell' },
      data
        ? pdf.blockStyle({ style: 'deviceCell' }, pdf.inputArray(data.ICDevCounterAssn))
        : { text: ' ', style: 'deviceCell' },
      data
        ? pdf.blockStyle(
            { style: 'deviceCell', alignment: 'right' },
            pdf.input(data.DeviceDiameter, { blank: 4 }),
            ' mm'
          )
        : { text: ' ', style: 'deviceCell' },
      data
        ? pdf.blockStyle(
            { style: 'deviceCell', alignment: 'right' },
            pdf.input(data.DeviceLength, { blank: 4 }),
            ' mm'
          )
        : { text: ' ', style: 'deviceCell' }
    ];
  }

  private sectionK(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          // { style: 'section', pageBreak: 'before' },
          { style: 'section' },
          pdf.section('K. INTRA AND POST-PROCEDURE EVENTS'),
          {
            text: ' (Complete for Each Cath Lab Visit)',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          {
            margin: [0, 0, 0, 5],
            table: {
              widths: '*',
              body: [
                [
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno' },
                    { text: 'Event(s)', bold: true },
                    `⁹⁰⁰¹`
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno' },
                    { text: 'Event(s) Occured', bold: true },
                    `⁹⁰⁰²`
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno' },
                    pdf.arrowIf(),
                    ' Yes, ',
                    { text: 'Event Date/Time', bold: true },
                    `⁹⁰⁰³`
                  )
                ],
                [
                  pdf.stack(
                    pdf.emptyLine(),
                    { text: 'Bleeding – Access Site', style: 'field' },
                    { text: 'Bleeding – Gastrointestinal', style: 'field' },
                    { text: 'Bleeding – Genitourinary', style: 'field' },
                    { text: 'Bleeding – Hematoma at Access Site', style: 'field' },
                    { text: 'Bleeding – Other', style: 'field' },
                    { text: 'Bleeding – Retroperitoneal', style: 'field' },
                    { text: 'Cardiac Arrest', style: 'field' },
                    { text: 'Cardiac Tamponade', style: 'field' },
                    { text: 'Cardiogenic Shock', style: 'field' },
                    { text: 'Heart Failure', style: 'field' },
                    { text: 'New Requirement for Dialysis', style: 'field' },
                    { text: 'Other Vascular Complications Req Tx', style: 'field' },
                    { text: 'Stroke – Hemorrhagic', style: 'field' },
                    { text: 'Stroke – Ischemic', style: 'field' },
                    { text: 'Stroke – Undetermined', style: 'field' },
                    { text: 'Myocardial Infarction', style: 'field' }
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_BleedingAccessSite),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_BleedingAccessSite)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_BleedingGI),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_BleedingGI)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_BleedingGU),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_BleedingGU)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_BleedingHematoma),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_BleedingHematoma)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_BleedingOther),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_BleedingOther)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_BleedingRetro),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_BleedingRetro)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_CardiacArrest),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_CardiacArrest)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_CardiacTamponade),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_CardiacTamponade)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_CardiogenicShock),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_CardiogenicShock)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_HeartFailure),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_HeartFailure)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_NewDialysis),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_NewDialysis)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_OtherVascular),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_OtherVascular)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_StrokeHemorrhage),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_StrokeHemorrhage)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_StrokeIschemic),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_StrokeIschemic)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_StrokeUndetermined),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_StrokeUndetermined)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data.sectionK.K_MyocardialInfarction),
                      pdf.tab(),
                      pdf.radio('Yes', this.data.sectionK.K_MyocardialInfarction)
                    )
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.prop(pdf.date(this.data.sectionK.K_BleedingAccessSiteDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_BleedingGIDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_BleedingGUDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_BleedingHematomaDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_BleedingOtherDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_BleedingRetroDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_CardiacArrestDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_CardiacTamponadeDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_CardiogenicShockDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_HeartFailureDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_NewDialysisDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_OtherVascularDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_StrokeHemorrhageDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_StrokeIschemicDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_StrokeUndeterminedDT, 'datetime'), {
                      alignment: 'center'
                    }),
                    pdf.prop(pdf.date(this.data.sectionK.K_MyocardialInfarctionDT, 'datetime'), {
                      alignment: 'center'
                    })
                  )
                ]
              ]
            }
          },
          pdf.block(
            pdf.arrowIf(),
            ` Myocardial Infarction = 'Yes', `,
            pdf.field('Myocardial Infarction Criteria')
          ),
          pdf.block(
            pdf.tab(2),
            pdf.radio(
              'Absolute rise in cTn (form baseline) >= 35x(URL)',
              this.data.sectionK.K_MyocardialInfarctionCriteria
            )
          ),
          pdf.block(
            pdf.tab(2),
            pdf.radio(
              'Absolute rise in cTn (form baseline) >= 70x(URL)',
              this.data.sectionK.K_MyocardialInfarctionCriteria
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('RBC Transfusion', { annotation: '9275' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionK.PostTransfusion),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionK.PostTransfusion)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Number of Units Transfused', { annotation: '7026' }),
            pdf.input(this.data.sectionK.PRBCUnits)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transfusion PCI', { annotation: '9277' }),
            '(within 72 hours)',
            pdf.tab(),
            pdf.radio('No', this.data.sectionK.TransfusPostPCI),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionK.TransfusPostPCI)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transfusion Surgical', { annotation: '9278' }),
            '(within 72 hours)',
            pdf.tab(),
            pdf.radio('No', this.data.sectionK.TransfusionPostSurg),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionK.TransfusionPostSurg)
          )
        )
      ]
    ];
  }

  private sectionL(): pdfMake.Content[][] {
    return [
      [pdf.blockStyle({ style: 'section', pageBreak: 'before' }, pdf.section('L. DISCHARGE'))],
      [
        pdf.stackStyle(
          { border: [true, true, true, false] },
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Intervention(s) this Hospitalization', { annotation: '10030' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionL.HospIntervention),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionL.HospIntervention)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Intervention Type', { annotation: '10031' }),
            '(Select all that apply)'
          ),
          pdf.columns(
            { text: '', width: 26 },
            pdf.stack(
              pdf.check('CABG', this.data.sectionL.HospInterventionType),
              pdf.check('Valvular Intervention', this.data.sectionL.HospInterventionType),
              pdf.check('Cardiac Surgery (non CABG)', this.data.sectionL.HospInterventionType),
              pdf.check(
                'Structural Heart Intervention (non-valvular)',
                this.data.sectionL.HospInterventionType
              )
            ),
            pdf.stack(
              pdf.check('Surgery (Non Cardiac)', this.data.sectionL.HospInterventionType),
              pdf.check('EP Study', this.data.sectionL.HospInterventionType),
              pdf.check('Other', this.data.sectionL.HospInterventionType)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.blockStyle(
              { margin: [0, 22, 0, 0], width: 100 },
              pdf.tab(),
              pdf.arrowIf(),
              ` CAGB = 'Yes'`
            ),
            pdf.stack(
              pdf.emptyLine(),
              pdf.columns(
                pdf.field('CABG Status', { annotation: '10035', width: 100 }),
                pdf.block(
                  pdf.radio('Elective', this.data.sectionL.CABGStatus),
                  pdf.tab(),
                  pdf.radio('Urgent', this.data.sectionL.CABGStatus),
                  pdf.tab(),
                  pdf.radio('Emergency', this.data.sectionL.CABGStatus),
                  pdf.tab(),
                  pdf.radio('Salvage', this.data.sectionL.CABGStatus)
                )
              ),
              pdf.columns(
                pdf.field('CABG Indication', { annotation: '10036', width: 100 }),
                pdf.stackStyle(
                  { width: 220 },
                  pdf.radio('PCI/CABG Hybrid Procedure', this.data.sectionL.CABGIndication),
                  pdf.radio(
                    'Recommendation from Dx Cath (instead of PCI)',
                    this.data.sectionL.CABGIndication
                  )
                ),
                pdf.stack(
                  pdf.radio('PCI Failure', this.data.sectionL.CABGIndication),
                  pdf.radio('PCI Complication', this.data.sectionL.CABGIndication)
                )
              ),
              pdf.columns(
                pdf.field('CABG Date/Time', { annotation: '10011', width: 100 }),
                pdf.date(this.data.sectionL.CABGDateTime, 'datetime')
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.block(
              pdf.field('Discharge Date/Time', { annotation: '10101' }),
              pdf.date(this.data.sectionL.DCDateTime, 'datetime')
            ),
            pdf.block(
              pdf.field('Discharge Provider', { annotation: '10070,10071' }),
              pdf.input(this.data.sectionL.DCProvider)
            )
          ),
          pdf.block(
            pdf.field('Comfort Measures Only', { annotation: '10075' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionL.DC_Comfort),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionL.DC_Comfort)
          ),
          pdf.block(
            pdf.field('Discharge Status', { annotation: '10105' }),
            pdf.tab(),
            pdf.radio('Alive', this.data.sectionL.DCStatus),
            pdf.tab(),
            pdf.radio('Deceased', this.data.sectionL.DCStatus)
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: 165 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Alive, ',
              pdf.field('Discharge Location', { annotation: '10110' })
            ),
            pdf.stackStyle(
              { width: 150 },
              pdf.radio('Home', this.data.sectionL.DCLocation),
              pdf.radio('Extended care/TCU/rehab', this.data.sectionL.DCLocation),
              pdf.radio('Other acute care hospital', this.data.sectionL.DCLocation)
            ),
            pdf.stack(
              pdf.radio('Skilled Nursing facility', this.data.sectionL.DCLocation),
              pdf.radio('Other', this.data.sectionL.DCLocation),
              pdf.radio('Left against medical advice (AMA)', this.data.sectionL.DCLocation)
            )
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Other acute care hospital, ',
            pdf.field('Transferred for CABG', { annotation: '10111' }),
            pdf.radio('No', this.data.sectionL.CABGTransfer),
            pdf.space(2),
            pdf.radio('Yes', this.data.sectionL.CABGTransfer)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' NOT Left against medical advice (AMA) OR Other acute care hospital, ',
            pdf.field('CABG Planned after Discharge', { annotation: '10112' }),
            pdf.radio('No', this.data.sectionL.CABGPlannedDC),
            pdf.space(),
            pdf.radio('Yes', this.data.sectionL.CABGPlannedDC)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Alive, ',
            pdf.field('Hospice Care', { annotation: '10115' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionL.DCHospice),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionL.DCHospice)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Alive, ',
            pdf.field('Cardiac Rehabilitation Referral', { annotation: '10116' })
          ),
          pdf.columns(
            { text: '', width: 26 },
            pdf.stack(
              pdf.radio('No - Reason Not Documented', this.data.sectionL.DC_CardRehab),
              pdf.radio('No - Medical Reason Documented', this.data.sectionL.DC_CardRehab)
            ),
            pdf.stack(
              pdf.radio(
                'No - Health Care System Reason Documented',
                this.data.sectionL.DC_CardRehab
              ),
              pdf.radio('Yes', this.data.sectionL.DC_CardRehab)
            )
          )
        )
      ],
      [
        pdf.stackStyle(
          { border: [true, false, true, false], fillColor: '#eeeeee' },
          pdf.emptyLine(),
          pdf.columns(
            { text: '', width: 9 },
            pdf.prop(pdf.arrowIf(), { width: 19 }),
            pdf.block(
              'Deceased ',
              { text: 'AND ', bold: true },
              'any ',
              {
                text: '(CARDIAC ARREST OUT OF HEALTHCARE FACILITY',
                bold: true
              },
              `⁴⁶³⁰ = 'Yes' OR `,
              {
                text: 'CARDIAC ARREST AT TRANSFERRING HEALTHCARE FACILITY',
                bold: true
              },
              `⁴⁶³⁵ = 'Yes' OR `,
              {
                text: 'CARDIAC ARREST AT THIS FACILITY',
                bold: true
              },
              `⁷³⁴⁰ = 'Yes'), `,
              pdf.field('Level of Consciousness', { annotation: '10117' }),
              '(highest s/p cardiac arrest)'
            )
          ),
          pdf.block(
            pdf.tab(4),
            pdf.radio('(A) Alert', this.data.sectionL.DC_LOC),
            pdf.tab(),
            pdf.radio('(V) Verbal', this.data.sectionL.DC_LOC),
            pdf.tab(),
            pdf.radio('(P) Pain', this.data.sectionL.DC_LOC),
            pdf.tab(),
            pdf.radio('(U) Unresponsive', this.data.sectionL.DC_LOC),
            pdf.tab(),
            pdf.radio('Unable to Assess', this.data.sectionL.DC_LOC)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Deceased, ',
            pdf.field('Death During the Procedure', { annotation: '10120' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionL.DeathProcedure),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionL.DeathProcedure)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Deceased, ',
            pdf.field('Cause of Death', { annotation: '10125' })
          ),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 200 },
              pdf.radio('Acute myocardial infarction', this.data.sectionL.DeathCause),
              pdf.radio('Sudden cardiac death', this.data.sectionL.DeathCause),
              pdf.radio('Heart failure', this.data.sectionL.DeathCause),
              pdf.radio('Cardiovascular procedure', this.data.sectionL.DeathCause),
              pdf.radio('Cardiovascular hemorrhage', this.data.sectionL.DeathCause),
              pdf.radio('Other cardiovascular reason', this.data.sectionL.DeathCause),
              pdf.radio('Non-cardiovascular procedure or surgery', this.data.sectionL.DeathCause)
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Pulmonary', this.data.sectionL.DeathCause),
              pdf.radio('Neurological', this.data.sectionL.DeathCause),
              pdf.radio('Hepatobiliary', this.data.sectionL.DeathCause),
              pdf.radio('Pancreatic', this.data.sectionL.DeathCause),
              pdf.radio('Renal', this.data.sectionL.DeathCause),
              pdf.radio('Gastrointestinal', this.data.sectionL.DeathCause),
              pdf.radio('Suicide', this.data.sectionL.DeathCause)
            ),
            pdf.stack(
              pdf.radio('Trauma', this.data.sectionL.DeathCause),
              pdf.radio('Stroke', this.data.sectionL.DeathCause),
              pdf.radio('Malignancy', this.data.sectionL.DeathCause),
              pdf.radio('Hemorrhage', this.data.sectionL.DeathCause),
              pdf.radio('Infection', this.data.sectionL.DeathCause),
              pdf.radio('Inflammatory/Immunologic', this.data.sectionL.DeathCause),
              pdf.radio('Other non-cardiovascular reason', this.data.sectionL.DeathCause)
            )
          )
        )
      ],
      // [{ text: 'art', border: [true, false, true, true] }]
      [
        pdf.stackStyle(
          { border: [true, false, true, true] },
          pdf.emptyLine(),
          pdf.field('Device-oriented Composite End Point'),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 150 },
              pdf.radio('None', this.data.sectionL.L_DeviceCompositeEP),
              pdf.radio('Cardiac death', this.data.sectionL.L_DeviceCompositeEP)
            ),
            pdf.stack(
              pdf.radio(
                'MI (not clearly attribute to a non-target vessel)',
                this.data.sectionL.L_DeviceCompositeEP
              ),
              pdf.radio(
                'TLR - Target Lesion Revascularization',
                this.data.sectionL.L_DeviceCompositeEP
              )
            )
          ),
          pdf.field('Patient-oriented Composite End Point'),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 150 },
              pdf.radio('None', this.data.sectionL.L_PatientCompositeEP),
              pdf.radio('All-cause mortality', this.data.sectionL.L_PatientCompositeEP)
            ),
            pdf.stack(
              pdf.radio(
                'Any MI (included non-target vessel territory)',
                this.data.sectionL.L_PatientCompositeEP
              ),
              pdf.radio(
                'Any repeat revascularization (includes all target and non-target vessels)',
                this.data.sectionL.L_PatientCompositeEP
              )
            )
          )
        )
      ],
      [
        pdf.stackStyle(
          { style: 'subSection', pageBreak: 'before' },
          pdf.block(
            pdf.text('DISCHARGE MEDICATIONS', { bold: true }),
            pdf.text(
              ' (Prescrived at Discharge - Complete for Each Episode of Care in which a PCI was Attemped or Performed)',
              { fontSize: 9 }
            )
          )
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.text(
            `Medications prescribed at discharge are not required for patients who expired, ` +
              `discharged to "Other acute care Hospital", "AMA" or are receiving "Hospice Care".`
          ),
          {
            table: {
              widths: ['*', 90, 40, 40, 40, 40, 40, 40, 40],
              headerRows: 2,
              body: [
                [
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', colSpan: 2, rowSpan: 2, margin: [0, 22, 0, 0] },
                    pdf.text('Medication', { bold: true }),
                    pdf.text('¹⁰²⁰⁰')
                  ),
                  '',
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', colSpan: 4, margin: [0, 5, 0, 0] },
                    pdf.text('Prescribed', { bold: true }),
                    pdf.text('¹⁰²⁰⁵')
                  ),
                  '',
                  '',
                  '',
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', colSpan: 3 },
                    pdf.arrowIf(),
                    ' No - Patient Reason, ',
                    pdf.text('Rationale', { bold: true })
                  ),
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  pdf.text('Yes - Prescribed', { style: 'medTableHeader', margin: [0, 5, 0, 0] }),
                  pdf.text('No - \nNo Reason', { style: 'medTableHeader', margin: [0, 5, 0, 0] }),
                  pdf.text('No - Medical Reason', { style: 'medTableHeader' }),
                  pdf.text('No - Patient Reason', { style: 'medTableHeader' }),
                  pdf.text('Cost', { style: 'medTableHeader', margin: [0, 10, 0, 0] }),
                  pdf.text('Alternative Therapy Preferred', { style: 'medTableHeader' }),
                  pdf.text('Negative Side Effect', {
                    style: 'medTableHeader',
                    margin: [0, 5, 0, 0]
                  })
                ],
                [
                  pdf.text('Antiplatelet', { style: 'medCell', rowSpan: 2, margin: [0, 7, 0, 0] }),
                  pdf.text('Aspirin', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Aspirin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Aspirin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Aspirin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Aspirin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_AspirinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_AspirinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_AspirinRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Vorapaxar', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Vorapaxar, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Vorapaxar, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Vorapaxar, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Vorapaxar, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_VorapaxarRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_VorapaxarRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_VorapaxarRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('P2Y12 Inhibitors', {
                    style: 'medCell',
                    rowSpan: 4,
                    margin: [0, 18, 0, 0]
                  }),
                  pdf.text('Clopidogrel', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Clopidogrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Clopidogrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Clopidogrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Clopidogrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_ClopidogrelRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_ClopidogrelRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_ClopidogrelRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Prasugrel', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Prasugrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Prasugrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Prasugrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Prasugrel, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_PrasugrelRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_PrasugrelRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_PrasugrelRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Ticagrelor', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Ticagrelor, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Ticagrelor, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Ticagrelor, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Ticagrelor, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_TicagrelorRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_TicagrelorRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_TicagrelorRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Ticlopidine', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Ticlopidine, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Ticlopidine, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Ticlopidine, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Ticlopidine, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_TiclopidineRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_TiclopidineRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_TiclopidineRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Statin', { style: 'medCell' }),
                  pdf.text('Statin (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Statin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Statin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Statin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Statin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_StatinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_StatinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_StatinRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Non-Statin', { style: 'medCell' }),
                  pdf.text('Non-Statin (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_NonStatin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_NonStatin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_NonStatin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_NonStatin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_NonStatinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_NonStatinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_NonStatinRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('PCSK9 Inhibitors', {
                    style: 'medCell',
                    rowSpan: 2,
                    margin: [0, 3, 0, 0]
                  }),
                  pdf.text('Alirocumab', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Alirocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Alirocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Alirocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Alirocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_AlirocumabRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_AlirocumabRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_AlirocumabRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Evolocumab', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Evolocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Evolocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Evolocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Evolocumab, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_EvolocumabRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_EvolocumabRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_EvolocumabRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Beta Blockers', { style: 'medCell' }),
                  pdf.text('Beta Blocker (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_BetaBlocker, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_BetaBlocker, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_BetaBlocker, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_BetaBlocker, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_BetaBlockerRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_BetaBlockerRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_BetaBlockerRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('ACE Inhibitors', { style: 'medCell' }),
                  pdf.text('ACE Inhibitors (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_ACEI, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_ACEI, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_ACEI, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_ACEI, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_ACEIRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_ACEIRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_ACEIRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('ARB', { style: 'medCell' }),
                  pdf.text('ARB (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_ARB, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_ARB, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_ARB, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_ARB, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_ARBRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_ARBRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_ARBRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Anticoagulant', { style: 'medCell' }),
                  pdf.text('Warfarin', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Warfarin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Warfarin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Warfarin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Warfarin, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_WarfarinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_WarfarinRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_WarfarinRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Non-Vitamin K Dependent Oral Anticoagulant', {
                    style: 'medCell',
                    rowSpan: 4,
                    margin: [0, 12, 0, 0]
                  }),
                  pdf.text('Apixaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Apixaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Apixaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Apixaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Apixaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_ApixabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_ApixabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_ApixabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Dabigatran', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Dabigatran, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Dabigatran, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Dabigatran, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Dabigatran, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_DabigatranRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_DabigatranRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_DabigatranRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Edoxaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Edoxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Edoxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Edoxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Edoxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_EdoxabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_EdoxabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_EdoxabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Rivaroxaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data.sectionL.DC_Rivaroxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data.sectionL.DC_Rivaroxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data.sectionL.DC_Rivaroxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data.sectionL.DC_Rivaroxaban, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data.sectionL.DC_RivaroxabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', this.data.sectionL.DC_RivaroxabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', this.data.sectionL.DC_RivaroxabanRN, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ]
              ]
            },
            layout: {
              fillColor(rowIndex, node, columnIndex) {
                return rowIndex % 2 === 1 && columnIndex !== 0 ? '#eeeeee' : null;
              },
              vLineWidth(i, node) {
                return [3, 4, 5, 7, 8].includes(i) ? 0.3 : 1;
              },
              vLineColor(i, node) {
                return [3, 4, 5, 7, 8].includes(i) ? 'gray' : 'black';
              }
            },
            margin: [0, 0, 0, 5]
          },
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ` Statin (Any) = 'Yes - Prescribed', `,
            pdf.field('Dose', { annotation: '10207' })
          ),
          pdf.columns(
            pdf.text('', { width: 26 }),
            pdf.stack(
              pdf.radio('Low Intensity Dose', this.data.sectionL.DC_StatinDose),
              pdf.radio('Moderate Intensity Dose', this.data.sectionL.DC_StatinDose),
              pdf.radio('High Intensity Dose', this.data.sectionL.DC_StatinDose)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Discharge Medication Reconciliation Completed', { annotation: '10220' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionL.DC_MedReconCompleted),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionL.DC_MedReconCompleted)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ` Yes, `,
            pdf.field('Reconciled Medications', { annotation: '10221' })
          ),
          pdf.columns(
            pdf.text('', { width: 26 }),
            pdf.stack(
              pdf.check('Prescriptions: Cardiac', this.data.sectionL.DC_MedReconciled),
              pdf.check('Prescriptions: Non-Cardiac', this.data.sectionL.DC_MedReconciled),
              pdf.check('Over the Counter (OTC) Medications', this.data.sectionL.DC_MedReconciled),
              pdf.check('Vitamins/Minerals', this.data.sectionL.DC_MedReconciled),
              pdf.check('Herbal Supplements', this.data.sectionL.DC_MedReconciled)
            )
          )
        )
      ]
    ];
  }

  private sectionM(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('M. FOLLOW-UP'),
          pdf.text(
            ' (30 Days Post Index PCI Procedure: -7+14 days AND 1 Year Post Index PCI Procedure: +/-60 days)',
            { bold: false }
          )
        )
      ],
      ...this.getFollowUp()
    ];
  }

  private getFollowUp() {
    const output = [];
    const followUpLength = this.data.sectionM.FollowUps.length;
    const maxLength = followUpLength < maxFollowUpLength ? maxFollowUpLength : followUpLength;

    for (let index = 0; index < maxLength; index++) {
      let fu = null;
      if (index < followUpLength) {
        fu = this.data.sectionM.FollowUps[index];
      }
      output.push(...this.followUp(fu, index === 0));
    }
    return output;
  }

  private followUp(data: any, fistPage: boolean) {
    return [
      [
        pdf.text('FOLLOW UP PERIOD: __________', {
          style: 'subSection',
          pageBreak: fistPage ? null : 'before'
        })
      ],
      [
        pdf.stackStyle(
          { border: [true, true, true, false] },
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Assessment Date', { annotation: '11000' }),
            pdf.date(data ? data.FU_AssessmentDate : null)
          ),
          pdf.field('Method(s) to Determine Status', { annotation: '11003' }),
          pdf.columns(
            pdf.text('', { width: 26 }),
            pdf.stackStyle(
              { width: 100 },
              pdf.check('Office Visit', data ? data.FU_Method : null),
              pdf.check('Phone Call', data ? data.FU_Method : null)
            ),
            pdf.stack(
              pdf.check('Medical Records', data ? data.FU_Method : null),
              pdf.check('Social Security Death Master File', data ? data.FU_Method : null)
            ),
            pdf.stack(
              pdf.check('Letter from Medical Provider', data ? data.FU_Method : null),
              pdf.block(
                pdf.check('Hospitalized', data ? data.FU_Method : null),
                pdf.tab(4),
                pdf.check('Other', data ? data.FU_Method : null)
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Follow-Up Status', { annotation: '11004' }),
            pdf.tab(),
            pdf.radio('Alive', data ? data.FU_Status : null),
            pdf.tab(),
            pdf.radio('Deceased', data ? data.FU_Status : null),
            pdf.tab(),
            pdf.radio('Lost to Follow-up', data ? data.FU_Status : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Alive, ',
            pdf.field('Chest Pain Symptom Assessment', { annotation: '11005' })
          ),
          pdf.block(
            pdf.tab(4),
            pdf.radio('Typical Angina', data ? data.FU_CPSxAssess : null),
            pdf.tab(2),
            pdf.radio('Atypical angina', data ? data.FU_CPSxAssess : null),
            pdf.tab(2),
            pdf.radio('Non-anginal Chest Pain', data ? data.FU_CPSxAssess : null),
            pdf.tab(2),
            pdf.radio('Asymptomatic', data ? data.FU_CPSxAssess : null)
          )
        )
      ],
      [
        pdf.stackStyle(
          { border: [true, false, true, false], fillColor: '#eeeeee' },
          pdf.emptyLine(),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Deceased, ',
            pdf.field('Date of Death', { annotation: '11006' }),
            pdf.date(data ? data.FU_DeathDate : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Deceased, ',
            pdf.field('Primary Cause of Death', { annotation: '11007' })
          ),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 200 },
              pdf.radio('Acute myocardial infarction', data ? data.FU_DeathCause : null),
              pdf.radio('Sudden cardiac death', data ? data.FU_DeathCause : null),
              pdf.radio('Heart failure', data ? data.FU_DeathCause : null),
              pdf.radio('Cardiovascular procedure', data ? data.FU_DeathCause : null),
              pdf.radio('Cardiovascular hemorrhage', data ? data.FU_DeathCause : null),
              pdf.radio('Other cardiovascular reason', data ? data.FU_DeathCause : null),
              pdf.radio('Non-cardiovascular procedure or surgery', data ? data.FU_DeathCause : null)
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Pulmonary', data ? data.FU_DeathCause : null),
              pdf.radio('Neurological', data ? data.FU_DeathCause : null),
              pdf.radio('Hepatobiliary', data ? data.FU_DeathCause : null),
              pdf.radio('Pancreatic', data ? data.FU_DeathCause : null),
              pdf.radio('Renal', data ? data.FU_DeathCause : null),
              pdf.radio('Gastrointestinal', data ? data.FU_DeathCause : null),
              pdf.radio('Suicide', data ? data.FU_DeathCause : null)
            ),
            pdf.stack(
              pdf.radio('Trauma', data ? data.FU_DeathCause : null),
              pdf.radio('Stroke', data ? data.FU_DeathCause : null),
              pdf.radio('Malignancy', data ? data.FU_DeathCause : null),
              pdf.radio('Hemorrhage', data ? data.FU_DeathCause : null),
              pdf.radio('Infection', data ? data.FU_DeathCause : null),
              pdf.radio('Inflammatory/Immunologic', data ? data.FU_DeathCause : null),
              pdf.radio('Other non-cardiovascular reason', data ? data.FU_DeathCause : null)
            )
          )
        )
      ],
      [
        pdf.stackStyle(
          { border: [true, false, true, true] },
          pdf.emptyLine(),
          pdf.line(),
          pdf.emptyLine(),
          pdf.text('EVENT, INTERVENTIONS AND/OR SURGICAL PROCEDURES', { bold: true }),
          pdf.text(
            '(Any occurence between discharge (or previous follow-up) AND the current follow-up assessment)'
          ),
          pdf.emptyLine(),
          {
            table: {
              margin: [0, 0, 0, 5],
              widths: [165, 75, '*', 100],
              body: [
                [
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', margin: [0, 5, 0, 0] },
                    pdf.text('Event(s)', { bold: true }),
                    pdf.text('¹¹⁰¹¹')
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno' },
                    pdf.text('Event(s) Occured', { bold: true }),
                    pdf.text('¹¹⁰¹²')
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno' },
                    pdf.arrowIf(),
                    ' Yes, ',
                    pdf.ln(),
                    pdf.text('Device Event Occured In', { bold: true }),
                    pdf.text('¹¹⁰¹³')
                  ),
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno' },
                    pdf.arrowIf(),
                    ' Yes,',
                    pdf.ln(),
                    pdf.text('Event Date/Time', { bold: true }),
                    pdf.text('¹¹⁰¹⁴')
                  )
                ],
                [
                  pdf.text('Bleeding Event', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_BleedingEvent : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_BleedingEvent : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_BleedingEventDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('CABG: Bypass of stented lesion', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_CABGStent : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_CABGStent : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_CABGStentDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('CABG: Bypass of non-stented lesion', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_CABGNonStent : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_CABGNonStent : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_CABGNonStentDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Myocardial Infarction: NSTEMI', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_NSTEMI : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_NSTEMI : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_NSTEMIDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Myocardial Infarction: Q-wave', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_Qwave : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_Qwave : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_QwaveDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Myocardial Infarction: STEMI', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_STEMI : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_STEMI : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_STEMIDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Myocardial Infarction: Type Unknown', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_MIUnknown : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_MIUnknown : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_MIUnknownDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('PCI of non-stented lesion', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_PCINonStent : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_PCINonStent : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_PCINonStentDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('PCI of stented lesion', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_PCIStent : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_PCIStent : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_PCIStentDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Readmission: Non-PCI Related', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_Readmission : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_Readmission : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_Readmission : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Stroke – Hemorrhagic', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_StrokeHemorrhage : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_StrokeHemorrhage : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_StrokeHemorrhageDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Stroke – Ischemic', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_StrokeIschemic : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_StrokeIschemic : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_StrokeIschemicDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Stroke – Undetermined', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_StrokeUndetermined : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_StrokeUndetermined : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_StrokeUndeterminedDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Thrombosis in stented lesion', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_ThrombosisStent : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_ThrombosisStent : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_ThrombosisStentDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ],
                [
                  pdf.text('Thrombosis in non-stented lesion', { style: 'tableCell' }),
                  pdf.blockStyle(
                    { style: 'tableCell', alignment: 'center' },
                    pdf.radio('No', data ? data.M_ThrombosisNonStent : null),
                    pdf.tab(),
                    pdf.radio('Yes', data ? data.M_ThrombosisNonStent : null)
                  ),
                  '',
                  pdf.prop(pdf.date(data ? data.M_ThrombosisNonStentDT : null), {
                    style: 'tableCell',
                    alignment: 'center'
                  })
                ]
              ]
            },
            layout: {
              fillColor(rowIndex, node, columnIndex) {
                return rowIndex % 2 === 0 ? '#eeeeee' : null;
              }
            }
          },
          pdf.line(),
          pdf.emptyLine(),
          pdf.field('Device-oriented Composite End Point'),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 150 },
              pdf.radio('None', this.data.sectionL.M_DeviceCompositeEP),
              pdf.radio('Cardiac death', this.data.sectionL.M_DeviceCompositeEP)
            ),
            pdf.stack(
              pdf.radio(
                'MI (not clearly attribute to a non-target vessel)',
                this.data.sectionL.M_DeviceCompositeEP
              ),
              pdf.radio(
                'TLR - Target Lesion Revascularization',
                this.data.sectionL.M_DeviceCompositeEP
              )
            )
          ),
          pdf.field('Patient-oriented Composite End Point'),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 150 },
              pdf.radio('None', this.data.sectionL.M_PatientCompositeEP),
              pdf.radio('All-cause mortality', this.data.sectionL.M_PatientCompositeEP)
            ),
            pdf.stack(
              pdf.radio(
                'Any MI (included non-target vessel territory)',
                this.data.sectionL.M_PatientCompositeEP
              ),
              pdf.radio(
                'Any repeat revascularization (includes all target and non-target vessels)',
                this.data.sectionL.M_PatientCompositeEP
              )
            )
          ),
          pdf.text('FOLLOW-UP MEDICATIONS', { bold: true, pageBreak: 'before' }),
          {
            table: {
              widths: ['*', 90, 40, 40, 40, 40, 40, 40, 40],
              headerRows: 2,
              body: [
                [
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', colSpan: 2, rowSpan: 2, margin: [0, 22, 0, 0] },
                    pdf.text('Medication', { bold: true }),
                    pdf.text('¹¹⁹⁹⁰')
                  ),
                  '',
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', colSpan: 4, margin: [0, 5, 0, 0] },
                    pdf.text('Prescribed', { bold: true }),
                    pdf.text('¹¹⁹⁹⁵')
                  ),
                  '',
                  '',
                  '',
                  pdf.blockStyle(
                    { style: 'tableHeaderWithAnno', colSpan: 3 },
                    pdf.arrowIf(),
                    ' No - Patient Reason, ',
                    pdf.text('Rationale', { bold: true })
                  ),
                  '',
                  ''
                ],
                [
                  '',
                  '',
                  pdf.text('Yes - Prescribed', { style: 'medTableHeader', margin: [0, 5, 0, 0] }),
                  pdf.text('No - \nNo Reason', { style: 'medTableHeader', margin: [0, 5, 0, 0] }),
                  pdf.text('No - Medical Reason', { style: 'medTableHeader' }),
                  pdf.text('No - Patient Reason', { style: 'medTableHeader' }),
                  pdf.text('Cost', { style: 'medTableHeader', margin: [0, 10, 0, 0] }),
                  pdf.text('Alternative Therapy Preferred', { style: 'medTableHeader' }),
                  pdf.text('Negative Side Effect', {
                    style: 'medTableHeader',
                    margin: [0, 5, 0, 0]
                  })
                ],
                [
                  pdf.text('Antiplatelet', { style: 'medCell', rowSpan: 2, margin: [0, 7, 0, 0] }),
                  pdf.text('Aspirin', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Aspirin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Aspirin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Aspirin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Aspirin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_AspirinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_AspirinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_AspirinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Vorapaxar', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Vorapaxar : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Vorapaxar : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Vorapaxar : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Vorapaxar : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_VorapaxarRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_VorapaxarRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_VorapaxarRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('P2Y12 Inhibitors', {
                    style: 'medCell',
                    rowSpan: 4,
                    margin: [0, 18, 0, 0]
                  }),
                  pdf.text('Clopidogrel', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Clopidogrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Clopidogrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Clopidogrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Clopidogrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_ClopidogrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_ClopidogrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_ClopidogrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Prasugrel', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Prasugrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Prasugrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Prasugrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Prasugrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_PrasugrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_PrasugrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_PrasugrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Ticagrelor', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Ticagrelor : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Ticagrelor : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Ticagrelor : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Ticagrelor : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_TicagrelorRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_TicagrelorRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_TicagrelorRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Ticlopidine', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Ticlopidine : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Ticlopidine : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Ticlopidine : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Ticlopidine : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_TiclopidineRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_TiclopidineRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_TiclopidineRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Statin', { style: 'medCell' }),
                  pdf.text('Statin (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Statin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Statin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Statin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Statin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_StatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_StatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_StatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Non-Statin', { style: 'medCell' }),
                  pdf.text('Non-Statin (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_NonStatin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_NonStatin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_NonStatin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_NonStatin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_NonStatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_NonStatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_NonStatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('PCSK9 Inhibitors', {
                    style: 'medCell',
                    rowSpan: 2,
                    margin: [0, 3, 0, 0]
                  }),
                  pdf.text('Alirocumab', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Alirocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Alirocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Alirocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Alirocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_AlirocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_AlirocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_AlirocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Evolocumab', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Evolocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Evolocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Evolocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Evolocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_EvolocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_EvolocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_EvolocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Beta Blockers', { style: 'medCell' }),
                  pdf.text('Beta Blocker (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_BetaBlocker : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_BetaBlocker : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_BetaBlocker : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_BetaBlocker : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_BetaBlockerRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_BetaBlockerRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_BetaBlockerRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('ACE Inhibitors', { style: 'medCell' }),
                  pdf.text('ACE Inhibitors (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_ACEIRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_ACEIRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_ACEIRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('ARB', { style: 'medCell' }),
                  pdf.text('ARB (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_ARBRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_ARBRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_ARBRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Anticoagulant', { style: 'medCell' }),
                  pdf.text('Warfarin', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Warfarin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Warfarin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Warfarin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Warfarin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_WarfarinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_WarfarinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_WarfarinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  pdf.text('Non-Vitamin K Dependent Oral Anticoagulant', {
                    style: 'medCell',
                    rowSpan: 4,
                    margin: [0, 12, 0, 0]
                  }),
                  pdf.text('Apixaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Apixaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Apixaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Apixaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Apixaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_ApixabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_ApixabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_ApixabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Dabigatran', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Dabigatran : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Dabigatran : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Dabigatran : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Dabigatran : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_DabigatranRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_DabigatranRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_DabigatranRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Edoxaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Edoxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Edoxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Edoxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Edoxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_EdoxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_EdoxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_EdoxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ],
                [
                  '',
                  pdf.text('Rivaroxaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', data ? data.FU_Rivaroxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', data ? data.FU_Rivaroxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', data ? data.FU_Rivaroxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', data ? data.FU_Rivaroxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', data ? data.FU_RivaroxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Alternative Therapy Preferred', data ? data.FU_RivaroxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Negative Side Effect', data ? data.FU_RivaroxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  })
                ]
              ]
            },
            layout: {
              fillColor(rowIndex, node, columnIndex) {
                return rowIndex % 2 === 1 && columnIndex !== 0 ? '#eeeeee' : null;
              },
              vLineWidth(i, node) {
                return [3, 4, 5, 7, 8].includes(i) ? 0.3 : 1;
              },
              vLineColor(i, node) {
                return [3, 4, 5, 7, 8].includes(i) ? 'gray' : 'black';
              }
            },
            margin: [0, 0, 0, 5]
          },
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ` Statin (Any) = 'Yes - Prescribed', `,
            pdf.field('Dose', { annotation: '11996' })
          ),
          pdf.columns(
            pdf.text('', { width: 26 }),
            pdf.stack(
              pdf.radio('Low Intensity Dose', data ? data.FU_StatinDose : null),
              pdf.radio('Moderate Intensity Dose', data ? data.FU_StatinDose : null),
              pdf.radio('High Intensity Dose', data ? data.FU_StatinDose : null)
            )
          )
        )
      ]
    ];
  }

  private async appendix(): Promise<pdfMake.Content[][]> {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('APPENDIX')
        )
      ],
      [
        pdf.stack(
          {
            image: await pdf.imageToBase64('assets/img/coronary-artery-segment.png'),
            fit: [450, 450],
            alignment: 'center',
            margin: [0, 0, 0, 3]
          },
          pdf.line(),
          { text: '', margin: [0, 5, 0, 0] },
          pdf.columns(
            {
              image: await pdf.imageToBase64('assets/img/csha-frailty-scale.png'),
              fit: [210, 400],
              alignment: 'center'
            },
            pdf.stack(
              pdf.text('Medina Classification', {
                bold: true,
                decoration: 'underline',
                alignment: 'center',
                fontSize: 12,
                margin: [0, 70, 0, 0]
              }),
              {
                image: await pdf.imageToBase64('assets/img/medina-classification.png'),
                fit: [200, 400],
                alignment: 'center'
              }
            )
          )
        )
      ]
    ];
  }
}
