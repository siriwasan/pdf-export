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
    // doc['watermark'] = { text: 'INCOMPLETED', fontSize: 72, angle: 315, color: '#cccccc' };

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
              pdf.input(this.data ? this.data.sectionA.registryId : null)
            ),
            pdf.blockStyle(
              { lineHeight: 1.1 },
              pdf.field('HN'),
              pdf.input(this.data ? this.data.sectionA.HN : null)
            ),
            pdf.blockStyle(
              { lineHeight: 1.1 },
              pdf.field('AN'),
              pdf.input(this.data ? this.data.sectionA.AN : null)
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Last Name', { annotation: '2000' }),
              pdf.inputThai(this.data ? this.data.sectionA.LastName : null)
            ),
            pdf.block(
              pdf.field('First Name', { annotation: '2010' }),
              pdf.inputThai(this.data ? this.data.sectionA.FirstName : null)
            ),
            pdf.block(
              pdf.field('Middle Name', { annotation: '2020' }),
              pdf.inputThai(this.data ? this.data.sectionA.MidName : null)
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Birth Date', { annotation: '2050' }),
              pdf.date(this.data ? this.data.sectionA.DOB : null)
            ),
            pdf.block(
              pdf.field('Age'),
              pdf.input(this.data ? this.data.sectionA.Age : null),
              ' years'
            ),
            pdf.block(
              pdf.field('Sex', { annotation: '2060' }),
              pdf.tab(),
              pdf.radio('Male', this.data ? this.data.sectionA.Sex : null),
              pdf.tab(),
              pdf.radio('Female', this.data ? this.data.sectionA.Sex : null)
            )
          ),
          pdf.block(
            pdf.field('SSN', { annotation: '2030' }),
            pdf.input(this.data ? this.data.sectionA.SSN : null)
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Race'),
              pdf.tab(),
              pdf.radio('White', this.data ? this.data.sectionA.Race : null, {
                annotation: '2070'
              }),
              pdf.tab(),
              pdf.radio('Black/African American', this.data ? this.data.sectionA.Race : null, {
                annotation: '2071'
              }),
              pdf.tab(),
              pdf.radio('European', this.data ? this.data.sectionA.Race : null),
              pdf.tab(),
              pdf.radio('Asian', this.data ? this.data.sectionA.Race : null, { annotation: '2072' })
            ),
            pdf.blockStyle(
              { width: 150 },
              pdf.field('Nationality', { width: 150 }),
              pdf.input(this.data ? this.data.sectionA.PatNation : null)
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field(`Is This Patient's Permanet Address`),
              pdf.tab(),
              pdf.radio('Yes', this.data ? this.data.sectionA.PermAddr : null),
              pdf.tab(),
              pdf.radio('No', this.data ? this.data.sectionA.PermAddr : null)
            ),
            pdf.block(
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Zip Code'),
              pdf.input(this.data ? this.data.sectionA.ZipCode : null)
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
          pdf.block(
            pdf.field('Hospital Name'),
            pdf.inputThai(this.data ? this.data.sectionB.HospName : null)
          ),
          pdf.block(
            pdf.field('Admission Type'),
            pdf.tab(),
            pdf.radio('Direct', this.data ? this.data.sectionB.AdmType : null),
            pdf.tab(),
            pdf.radio('Transfer', this.data ? this.data.sectionB.AdmType : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Transfer, ',
            pdf.field('form Healthcare Center'),
            pdf.tab(),
            pdf.radio('BDMS Network', this.data ? this.data.sectionB.TransferHospType : null),
            ': ',
            pdf.input(this.data ? this.data.sectionB.BDMSNetwork : null),
            pdf.tab(5),
            pdf.radio('Non BDMS', this.data ? this.data.sectionB.TransferHospType : null),
            pdf.input(this.data ? this.data.sectionB.NonBDMS : null)
          ),
          pdf.block(
            pdf.field('Arrival Date/Time', { annotation: '3001' }),
            pdf.date(this.data ? this.data.sectionB.ArrivalDateTime : null, 'datetime')
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Admitting Provider', { annotation: '3050,3051' }),
              pdf.inputThai(this.data ? this.data.sectionB.AdmProvider : null)
            ),
            pdf.block(
              pdf.field('Attending Provider', { annotation: '3055,3056' }),
              pdf.inputThai(this.data ? this.data.sectionB.AttProvider : null)
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
                      pdf.radio('Self', this.data ? this.data.sectionB.PayorPrim : null),
                      pdf.tab(),
                      pdf.radio('Corporate', this.data ? this.data.sectionB.PayorPrim : null),
                      pdf.tab(),
                      pdf.radio('Embassy', this.data ? this.data.sectionB.PayorPrim : null),
                      pdf.tab(),
                      pdf.radio('Other', this.data ? this.data.sectionB.PayorPrim : null)
                    ),
                    pdf.block(
                      pdf.radio(
                        'Private Health Insurance',
                        this.data ? this.data.sectionB.PayorPrim : null
                      ),
                      pdf.tab(),
                      pdf.radio(
                        'SSO (Social Security Office)',
                        this.data ? this.data.sectionB.PayorPrim : null
                      )
                    ),
                    pdf.radio(
                      'Charitable care/Foundation Funding',
                      this.data ? this.data.sectionB.PayorPrim : null
                    ),
                    pdf.radio(
                      `Comptroller General's Department`,
                      this.data ? this.data.sectionB.PayorPrim : null
                    ),
                    pdf.radio(
                      'NHSO (National Health Security Office)',
                      this.data ? this.data.sectionB.PayorPrim : null
                    )
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.block(
                      pdf.radio('None', this.data ? this.data.sectionB.PayorSecond : null),
                      pdf.tab(),
                      pdf.radio('Corporate', this.data ? this.data.sectionB.PayorSecond : null),
                      pdf.tab(),
                      pdf.radio('Embassy', this.data ? this.data.sectionB.PayorSecond : null),
                      pdf.tab(),
                      pdf.radio('Other', this.data ? this.data.sectionB.PayorSecond : null)
                    ),
                    pdf.block(
                      pdf.radio(
                        'Private Health Insurance',
                        this.data ? this.data.sectionB.PayorSecond : null
                      ),
                      pdf.tab(),
                      pdf.radio(
                        'SSO (Social Security Office)',
                        this.data ? this.data.sectionB.PayorSecond : null
                      )
                    ),
                    pdf.radio(
                      'Charitable care/Foundation Funding',
                      this.data ? this.data.sectionB.PayorSecond : null
                    ),
                    pdf.radio(
                      `Comptroller General's Department`,
                      this.data ? this.data.sectionB.PayorSecond : null
                    ),
                    pdf.radio(
                      'NHSO (National Health Security Office)',
                      this.data ? this.data.sectionB.PayorSecond : null
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
                pdf.radio('No', this.data ? this.data.sectionC.Hypertension : null, {
                  width: col1_2
                }),
                pdf.radio('Yes', this.data ? this.data.sectionC.Hypertension : null, {
                  width: col1_3
                })
              ),
              pdf.columns(
                pdf.field('Diabetes Mellitus', { annotation: '4555', width: col1_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.Diabetes : null, { width: col1_2 }),
                pdf.radio('Yes', this.data ? this.data.sectionC.Diabetes : null, { width: col1_3 })
              ),
              pdf.columns(
                pdf.field('Dyslipidemia', { annotation: '4620', width: col1_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.Dyslipidemia : null, {
                  width: col1_2
                }),
                pdf.radio('Yes', this.data ? this.data.sectionC.Dyslipidemia : null, {
                  width: col1_3
                })
              ),
              pdf.columns(
                pdf.field('Prior MI', { annotation: '4291', width: col1_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.HxMI : null, { width: col1_2 }),
                pdf.radio('Yes', this.data ? this.data.sectionC.HxMI : null, { width: col1_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent MI Date', { annotation: '4296' }),
                pdf.date(this.data ? this.data.sectionC.HxMIDate : null)
              ),
              pdf.columns(
                pdf.field('Prior PCI', { annotation: '4495', width: col1_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.PriorPCI : null, { width: col1_2 }),
                pdf.radio('Yes', this.data ? this.data.sectionC.PriorPCI : null, { width: col1_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent PCI Date', { annotation: '4503' }),
                pdf.date(this.data ? this.data.sectionC.HxPCIDate : null)
              ),
              pdf.columns(
                pdf.blockStyle(
                  { width: col1_1 - 55 },
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Left Main PCI', { annotation: '4501' })
                ),
                pdf.radio('Unknown', this.data ? this.data.sectionC.LMPCI : null, { width: 55 }),
                pdf.radio('No', this.data ? this.data.sectionC.LMPCI : null, { width: col1_2 }),
                pdf.radio('Yes', this.data ? this.data.sectionC.LMPCI : null, { width: col1_3 })
              )
            ),
            pdf.stack(
              pdf.columns(
                pdf.block(
                  pdf.field('Height', { annotation: '6000' }),
                  pdf.input(this.data ? this.data.sectionC.Height : null, { blank: 6 }),
                  ' cm'
                ),
                pdf.block(
                  pdf.field('Weight', { annotation: '6005' }),
                  pdf.input(this.data ? this.data.sectionC.Weight : null, { blank: 6 }),
                  ' kg'
                )
              ),
              pdf.columns(
                pdf.field('Currently on Dialysis', { annotation: '4560', width: col2_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.CurrentDialysis : null, {
                  width: col2_2
                }),
                pdf.radio('Yes', this.data ? this.data.sectionC.CurrentDialysis : null, {
                  width: col2_3
                })
              ),
              pdf.columns(
                pdf.field('Family Hx. of Premature CAD', { annotation: '4287', width: col2_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.FamilyHxCAD : null, {
                  width: col2_2
                }),
                pdf.radio('Yes', this.data ? this.data.sectionC.FamilyHxCAD : null, {
                  width: col2_3
                })
              ),
              pdf.columns(
                pdf.field('Cerebrovascular Disease', { annotation: '4551', width: col2_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.HxCVD : null, { width: col2_2 }),
                pdf.radio('Yes', this.data ? this.data.sectionC.HxCVD : null, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Peipheral Arterial Disease', { annotation: '4610', width: col2_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.PriorPAD : null, { width: col2_2 }),
                pdf.radio('Yes', this.data ? this.data.sectionC.PriorPAD : null, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Chronic Lung Disease', { annotation: '4576', width: col2_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.HxChronicLungDisease : null, {
                  width: col2_2
                }),
                pdf.radio('Yes', this.data ? this.data.sectionC.HxChronicLungDisease : null, {
                  width: col2_3
                })
              ),
              pdf.columns(
                pdf.field('Prior CABG', { annotation: '4515', width: col2_1 }),
                pdf.radio('No', this.data ? this.data.sectionC.PriorCABG : null, { width: col2_2 }),
                pdf.radio('Yes', this.data ? this.data.sectionC.PriorCABG : null, { width: col2_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent CABG Date', { annotation: '4521' }),
                pdf.date(this.data ? this.data.sectionC.HxCABGDate : null)
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Tobacco Use', { annotation: '4625', width: 85 }),
            pdf.stack(
              pdf.radio('Never', this.data ? this.data.sectionC.TobaccoUse : null),
              pdf.radio('Current - Some Days', this.data ? this.data.sectionC.TobaccoUse : null)
            ),
            pdf.stack(
              pdf.radio('Former', this.data ? this.data.sectionC.TobaccoUse : null),
              pdf.radio('Current - Every Day', this.data ? this.data.sectionC.TobaccoUse : null)
            ),
            pdf.stackStyle(
              { width: 200 },
              pdf.radio(
                'Smoker, Current Status Unknown',
                this.data ? this.data.sectionC.TobaccoUse : null
              ),
              pdf.radio('Unknown if ever Smoked', this.data ? this.data.sectionC.TobaccoUse : null)
            )
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' any Current, ',
            pdf.field('Tobacco Type', { annotation: '4626' }),
            '(Select all that apply)',
            pdf.tab(),
            pdf.check('Cigarettes', this.data ? this.data.sectionC.TobaccoType : null),
            pdf.tab(),
            pdf.check('Cigars', this.data ? this.data.sectionC.TobaccoType : null),
            pdf.tab(),
            pdf.check('Pipe', this.data ? this.data.sectionC.TobaccoType : null),
            pdf.tab(),
            pdf.check('Smokeless', this.data ? this.data.sectionC.TobaccoType : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Current - Every Day and Cigarettes, ',
            pdf.field('Amount', { annotation: '4627' }),
            pdf.tab(),
            pdf.radio(
              'Light tobacco use (<10/day)',
              this.data ? this.data.sectionC.SmokeAmount : null
            ),
            pdf.tab(),
            pdf.radio(
              'Heavy tobacco use (>=10/day)',
              this.data ? this.data.sectionC.SmokeAmount : null
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Cardiac Arrest Out of Healthcare Facility', {
              annotation: '4630',
              width: col3_1
            }),
            pdf.radio('No', this.data ? this.data.sectionC.CAOutHospital : null, { width: col3_2 }),
            pdf.radio('Yes', this.data ? this.data.sectionC.CAOutHospital : null, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Arrest Witnessed', { annotation: '4631' })
            ),
            pdf.radio('No', this.data ? this.data.sectionC.CAWitness : null, { width: col3_2 }),
            pdf.radio('Yes', this.data ? this.data.sectionC.CAWitness : null, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Arrest after Arrival of EMS', { annotation: '4632', width: col3_1 })
            ),
            pdf.radio('No', this.data ? this.data.sectionC.CAPostEMS : null, { width: col3_2 }),
            pdf.radio('Yes', this.data ? this.data.sectionC.CAPostEMS : null, { width: col3_3 })
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
              pdf.radio('Shockable', this.data ? this.data.sectionC.InitCARhythm : null),
              pdf.tab(),
              pdf.radio('Not Shockable', this.data ? this.data.sectionC.InitCARhythm : null),
              pdf.tab(),
              pdf.radio('Unknown', this.data ? this.data.sectionC.InitCARhythm : null)
            )
          ),
          pdf.columns(
            pdf.field('Cardiac Arrest at Trasferring Healthcare Facility', {
              annotation: '4635',
              width: col3_1
            }),
            pdf.radio('No', this.data ? this.data.sectionC.CATransferFac : null, { width: col3_2 }),
            pdf.radio('Yes', this.data ? this.data.sectionC.CATransferFac : null, { width: col3_3 })
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.stack(
              pdf.field('CSHA Clinical Frailty Scale', { annotation: '4561' }),
              pdf.text('(See in Appendix)', {
                italics: true,
                fontSize: 8,
                margin: [0, -2, 0, 0],
                alignment: 'center'
              })
            ),
            pdf.stack(
              pdf.radio('1: Very Fit', this.data ? this.data.sectionC.CSHAScale : null),
              pdf.radio('2: Well', this.data ? this.data.sectionC.CSHAScale : null),
              pdf.radio('3: Managing Well', this.data ? this.data.sectionC.CSHAScale : null)
            ),
            pdf.stack(
              pdf.radio('4: Vulnerable', this.data ? this.data.sectionC.CSHAScale : null),
              pdf.radio('5: Mildly Frail', this.data ? this.data.sectionC.CSHAScale : null),
              pdf.radio('6: Moderately Frail', this.data ? this.data.sectionC.CSHAScale : null)
            ),
            pdf.stack(
              pdf.radio('7: Severely Frail', this.data ? this.data.sectionC.CSHAScale : null),
              pdf.radio('8: Very Severely Frail', this.data ? this.data.sectionC.CSHAScale : null),
              pdf.radio('9: Terminally Ill', this.data ? this.data.sectionC.CSHAScale : null)
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
                pdf.radio('No', this.data ? this.data.sectionD.HxHF : null),
                pdf.tab(2),
                pdf.radio('Yes', this.data ? this.data.sectionD.HxHF : null)
              ),
              pdf.block(
                pdf.radio('Class I', this.data ? this.data.sectionD.PriorNYHA : null),
                pdf.tab(2),
                pdf.radio('Class II', this.data ? this.data.sectionD.PriorNYHA : null),
                pdf.tab(2),
                pdf.radio('Class III', this.data ? this.data.sectionD.PriorNYHA : null),
                pdf.tab(2),
                pdf.radio('Class IV', this.data ? this.data.sectionD.PriorNYHA : null)
              ),
              pdf.block(
                pdf.radio('No', this.data ? this.data.sectionD.HFNewDiag : null),
                pdf.tab(2),
                pdf.radio('Yes', this.data ? this.data.sectionD.HFNewDiag : null)
              ),
              pdf.block(
                pdf.radio('Diastolic', this.data ? this.data.sectionD.HFType : null),
                pdf.tab(2),
                pdf.radio('Systolic', this.data ? this.data.sectionD.HFType : null),
                pdf.tab(2),
                pdf.radio('Unknown', this.data ? this.data.sectionD.HFType : null)
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
            pdf.radio('ECG', this.data ? this.data.sectionD.ECAssessMethod : null),
            pdf.tab(),
            pdf.radio('Telemetry Monitor', this.data ? this.data.sectionD.ECAssessMethod : null),
            pdf.tab(),
            pdf.radio('Holter Monitor', this.data ? this.data.sectionD.ECAssessMethod : null),
            pdf.tab(),
            pdf.radio('Other', this.data ? this.data.sectionD.ECAssessMethod : null),
            pdf.tab(),
            pdf.radio('None', this.data ? this.data.sectionD.ECAssessMethod : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' any methods, ',
            pdf.field('Results', { annotation: '5032' }),
            pdf.tab(),
            pdf.radio('Normal', this.data ? this.data.sectionD.ECGResults : null),
            pdf.tab(),
            pdf.radio('Abnormal', this.data ? this.data.sectionD.ECGResults : null),
            pdf.tab(),
            pdf.radio('Uninterpretable', this.data ? this.data.sectionD.ECGResults : null)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Abnormal, ',
            pdf.field('New Antiarrhythmic Therapy Initiated Prior to Cath Lab', {
              annotation: '5033'
            }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionD.AntiArrhyTherapy : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionD.AntiArrhyTherapy : null)
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
              pdf.check(
                'Ventricular Fibrillation (VF)',
                this.data ? this.data.sectionD.ECGFindings : null
              ),
              pdf.check('Sustained VT', this.data ? this.data.sectionD.ECGFindings : null),
              pdf.check('Non Sustained VT', this.data ? this.data.sectionD.ECGFindings : null),
              pdf.check('Exercise Induced VT', this.data ? this.data.sectionD.ECGFindings : null),
              pdf.check('T wave inversions', this.data ? this.data.sectionD.ECGFindings : null),
              pdf.check('ST deviation >= 0.5 mm', this.data ? this.data.sectionD.ECGFindings : null)
            ),
            pdf.stack(
              pdf.check(
                'New Left Bundle Branch Block',
                this.data ? this.data.sectionD.ECGFindings : null
              ),
              pdf.check('New Onset Atrial Fib', this.data ? this.data.sectionD.ECGFindings : null),
              pdf.check(
                'New Onset Atrial Flutter',
                this.data ? this.data.sectionD.ECGFindings : null
              ),
              pdf.check('PVC – Frequent', this.data ? this.data.sectionD.ECGFindings : null),
              pdf.check('PVC – Infrequent', this.data ? this.data.sectionD.ECGFindings : null)
            ),
            pdf.stack(
              pdf.check(
                '2nd Degree AV Heart Block Type 1',
                this.data ? this.data.sectionD.ECGFindings : null
              ),
              pdf.check(
                '2nd Degree AV Heart Block Type 2',
                this.data ? this.data.sectionD.ECGFindings : null
              ),
              pdf.check(
                '3rd Degree AV Heart Block',
                this.data ? this.data.sectionD.ECGFindings : null
              ),
              pdf.check(
                'Symptomatic Bradyarrhythmia',
                this.data ? this.data.sectionD.ECGFindings : null
              ),
              pdf.check(
                'Other Electrocardiac Abnormality',
                this.data ? this.data.sectionD.ECGFindings : null
              )
            )
          ),
          pdf.block(
            pdf.tab(3),
            pdf.arrowIf(),
            ' New Onset Atrial Fib, ',
            pdf.field('Heart Rate', { annotation: '6011' }),
            pdf.input(this.data ? this.data.sectionD.HR : null),
            ' bpm'
          ),
          pdf.block(
            pdf.tab(3),
            pdf.arrowIf(),
            ' Non Sustained VT, ',
            pdf.field('Type', { annotation: '5036' }),
            '(Select all that apply)',
            pdf.tab(),
            pdf.check('Symptomatic', this.data ? this.data.sectionD.NSVTType : null),
            pdf.tab(),
            pdf.check('Newly Diagnosed', this.data ? this.data.sectionD.NSVTType : null),
            pdf.tab(),
            pdf.check('Other', this.data ? this.data.sectionD.NSVTType : null)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Stress Test Performed', { annotation: '5200' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionD.StressPerformed : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionD.StressPerformed : null)
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
              pdf.radio(
                'Stress Echocardiogram',
                this.data ? this.data.sectionD.StressTestType : null
              ),
              pdf.radio('Stress Nuclear', this.data ? this.data.sectionD.StressTestType : null)
            ),
            pdf.stack(
              pdf.radio(
                'Exercise Stress Test (w/o imaging)',
                this.data ? this.data.sectionD.StressTestType : null
              ),
              pdf.radio(
                'Stress Imaging w/CMR',
                this.data ? this.data.sectionD.StressTestType : null
              )
            )
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Date', { annotation: '5204' }),
            pdf.date(this.data ? this.data.sectionD.StressTestDate : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Test Result', { annotation: '5202' }),
            pdf.tab(),
            pdf.radio('Negative', this.data ? this.data.sectionD.StressTestResult : null),
            pdf.tab(),
            pdf.radio('Positive', this.data ? this.data.sectionD.StressTestResult : null),
            pdf.tab(),
            pdf.radio('Indeterminate', this.data ? this.data.sectionD.StressTestResult : null),
            pdf.tab(),
            pdf.radio('Unavailable', this.data ? this.data.sectionD.StressTestResult : null)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Positive, ',
            pdf.field('Risk/Extent of Ischemia', { annotation: '5203' }),
            pdf.tab(),
            pdf.radio('Low', this.data ? this.data.sectionD.StressTestRisk : null),
            pdf.tab(),
            pdf.radio('Intermediate', this.data ? this.data.sectionD.StressTestRisk : null),
            pdf.tab(),
            pdf.radio('High', this.data ? this.data.sectionD.StressTestRisk : null),
            pdf.tab(),
            pdf.radio('Unavailable', this.data ? this.data.sectionD.StressTestRisk : null)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Cardiac CTA Performed', { annotation: '5220' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionD.CardiacCTA : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionD.CardiacCTA : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Cardiac CTA Date'),
            pdf.date(this.data ? this.data.sectionD.CardiacCTADate : null)
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
              pdf.radio('Obstructive CAD', this.data ? this.data.sectionD.CardiacCTAResults : null),
              pdf.radio(
                'Non-Obstructive CAD',
                this.data ? this.data.sectionD.CardiacCTAResults : null
              )
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio(
                'Unclear Severity',
                this.data ? this.data.sectionD.CardiacCTAResults : null
              ),
              pdf.radio('No CAD', this.data ? this.data.sectionD.CardiacCTAResults : null)
            ),
            pdf.stack(
              pdf.radio(
                'Structural Disease',
                this.data ? this.data.sectionD.CardiacCTAResults : null
              ),
              pdf.radio('Unknown', this.data ? this.data.sectionD.CardiacCTAResults : null)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Agatston Coronary Calcium Score Assessed', { annotation: '5256' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionD.CalciumScoreAssessed : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionD.CalciumScoreAssessed : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Agatston Coronary Calcium Score', { annotation: '5255' }),
            pdf.input(this.data ? this.data.sectionD.CalciumScore : null)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' any value, ',
            pdf.field('Most Recent Calcium Score Date', { annotation: '5257' }),
            pdf.date(this.data ? this.data.sectionD.CalciumScoreDate : null)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('LVEF Assessed', { annotation: '5111' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionD.PreProcLVEFAssessed : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionD.PreProcLVEFAssessed : null),
            pdf.tab(4),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent LVEF', { annotation: '5116' }),
            pdf.input(this.data ? this.data.sectionD.PreProcLVEF : null),
            ' %'
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Prior Dx Coronary Angiography Procedure', { annotation: '5263' }),
            '(without intervention)',
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionD.PriorDxAngioProc : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionD.PriorDxAngioProc : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Procedure Date', { annotation: '5264' }),
            pdf.date(this.data ? this.data.sectionD.PriorDxAngioDate : null)
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
              pdf.radio(
                'Obstructive CAD',
                this.data ? this.data.sectionD.PriorDxAngioResults : null
              ),
              pdf.radio(
                'Non-Obstructive CAD',
                this.data ? this.data.sectionD.PriorDxAngioResults : null
              )
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio(
                'Unclear Severity',
                this.data ? this.data.sectionD.PriorDxAngioResults : null
              ),
              pdf.radio('No CAD', this.data ? this.data.sectionD.PriorDxAngioResults : null)
            ),
            pdf.stack(
              pdf.radio(
                'Structural Disease',
                this.data ? this.data.sectionD.PriorDxAngioResults : null
              ),
              pdf.radio('Unknown', this.data ? this.data.sectionD.PriorDxAngioResults : null)
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
                      pdf.radio('No', this.data ? this.data.sectionD.PreProcMedASA : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionD.PreProcMedASA : null),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedASA : null
                      )
                    )
                  ],
                  [
                    pdf.text('Beta Blockers (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data ? this.data.sectionD.PreProcMedBetaBlocker : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionD.PreProcMedBetaBlocker : null),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedBetaBlocker : null
                      )
                    )
                  ],
                  [
                    pdf.text('Ca Channel Blockers (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data ? this.data.sectionD.PreProcMedCaBlocker : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionD.PreProcMedCaBlocker : null),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedCaBlocker : null
                      )
                    )
                  ],
                  [
                    pdf.text('Antiarrhythmic Agent Other', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio(
                        'No',
                        this.data ? this.data.sectionD.PreProcMedAntiArrhythmic : null
                      ),
                      pdf.tab(),
                      pdf.radio(
                        'Yes',
                        this.data ? this.data.sectionD.PreProcMedAntiArrhythmic : null
                      ),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedAntiArrhythmic : null
                      )
                    )
                  ],
                  [
                    pdf.text('Long Acting Nitrates (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio(
                        'No',
                        this.data ? this.data.sectionD.PreProcMedLongActNitrate : null
                      ),
                      pdf.tab(),
                      pdf.radio(
                        'Yes',
                        this.data ? this.data.sectionD.PreProcMedLongActNitrate : null
                      ),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedLongActNitrate : null
                      )
                    )
                  ],
                  [
                    pdf.text('Ranolazine', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data ? this.data.sectionD.PreProcMedRanolazine : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionD.PreProcMedRanolazine : null),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedRanolazine : null
                      )
                    )
                  ],
                  [
                    pdf.text('Statin (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data ? this.data.sectionD.PreProcMedStatin : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionD.PreProcMedStatin : null),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedStatin : null
                      )
                    )
                  ],
                  [
                    pdf.text('Non-Statin (Any)', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data ? this.data.sectionD.PreProcMedNonStatin : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionD.PreProcMedNonStatin : null),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedNonStatin : null
                      )
                    )
                  ],
                  [
                    pdf.text('PCSK9 Inhibitors', { style: 'tableCell' }),
                    pdf.blockStyle(
                      { style: 'tableCellCenter' },
                      pdf.radio('No', this.data ? this.data.sectionD.PreProcMedPCSK9 : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionD.PreProcMedPCSK9 : null),
                      pdf.tab(),
                      pdf.radio(
                        'Contraindicated',
                        this.data ? this.data.sectionD.PreProcMedPCSK9 : null
                      )
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
              pdf.date(this.data ? this.data.sectionE.ProcedureStartDateTime : null, 'datetime')
            ),
            pdf.block(
              pdf.field('Procedure End Date/Time', { annotation: '7005' }),
              pdf.date(this.data ? this.data.sectionE.ProcedureEndDateTime : null, 'datetime')
            )
          ),
          pdf.block(
            pdf.field('Diagnostic Coronary Angiography Procedure', { annotation: '7045' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionE.DiagCorAngio : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionE.DiagCorAngio : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Diagnostic Cath Operator', { annotation: '7046,7047' }),
            pdf.input(this.data ? this.data.sectionE.DCathProvider : null)
          ),
          pdf.block(
            pdf.field('Percutaneous Coronary Intervention (PCI)', { annotation: '7050' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionE.PCIProc : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionE.PCIProc : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('PCI Operator', { annotation: '7051,7052' }),
            '1ˢᵗ Operator - ',
            pdf.input(this.data ? this.data.sectionE.PCIProvider : null),
            pdf.tab(4),
            '2ⁿᵈ Operator - ',
            pdf.input(this.data ? this.data.sectionE.PCIProvider2 : null)
          ),
          pdf.block(
            pdf.field('Diagnostic Left Heart Cath', { annotation: '7060' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionE.LeftHeartCath : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionE.LeftHeartCath : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('LVEF', { annotation: '7061' }),
            pdf.input(this.data ? this.data.sectionE.PrePCILVEF : null),
            ' %',
            pdf.tab(),
            pdf.field('LVEDP', { annotation: '7061' }),
            pdf.input(this.data ? this.data.sectionE.PrePCILVEDP : null),
            ' mmHg'
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Concomitant Procedures Performed', { annotation: '7065' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionE.ConcomProc : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionE.ConcomProc : null)
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
              pdf.check('Structural Repair', this.data ? this.data.sectionE.ConcomProcType : null),
              pdf.check(
                'Left Atrial Appendage Occlusion',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'Parachute Device Placement',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'Mitral Clip Procedure',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'Transcatheter Aortic Valve Replacement (TAVR)',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'Thoracic Endovascular Aortic Repair (TEVAR)',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'Endovascular Aortic Repair (EVAR)',
                this.data ? this.data.sectionE.ConcomProcType : null
              )
            ),
            pdf.stack(
              pdf.check('Right Heart Cath', this.data ? this.data.sectionE.ConcomProcType : null),
              pdf.check('EP Study', this.data ? this.data.sectionE.ConcomProcType : null),
              pdf.check('Cardioversion', this.data ? this.data.sectionE.ConcomProcType : null),
              pdf.check(
                'Temporary Pacemaker Placement',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'Permanent Pacemaker Placement',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'LIMA (Native Position) Angiography',
                this.data ? this.data.sectionE.ConcomProcType : null
              )
            ),
            pdf.stackStyle(
              { width: 'auto' },
              pdf.check('Aortography', this.data ? this.data.sectionE.ConcomProcType : null),
              pdf.check('Renal Angiography', this.data ? this.data.sectionE.ConcomProcType : null),
              pdf.check(
                'Peripheral Intervention',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check(
                'Peripheral Angiography',
                this.data ? this.data.sectionE.ConcomProcType : null
              ),
              pdf.check('Biopsy of heart', this.data ? this.data.sectionE.ConcomProcType : null),
              pdf.check(
                'Procedure Type Not Listed',
                this.data ? this.data.sectionE.ConcomProcType : null
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Access Site', { annotation: '7320' }),
            pdf.stack(
              pdf.radio('Right Femoral', this.data ? this.data.sectionE.AccessSite : null),
              pdf.radio('Left Femoral', this.data ? this.data.sectionE.AccessSite : null)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data ? this.data.sectionE.AccessSite : null),
              pdf.radio('Left Brachial', this.data ? this.data.sectionE.AccessSite : null)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data ? this.data.sectionE.AccessSite : null),
              pdf.radio('Left Radial', this.data ? this.data.sectionE.AccessSite : null)
            ),
            pdf.radio('Other', this.data ? this.data.sectionE.AccessSite : null, { width: 75 })
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.field('Access Site - Closure Method', { width: 135 }),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio(
                'Manual Compression',
                this.data ? this.data.sectionE.AccessSiteClosure : null
              ),
              pdf.radio(
                'Compression Device',
                this.data ? this.data.sectionE.AccessSiteClosure : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Sealing technique',
                this.data ? this.data.sectionE.AccessSiteClosure : null
              ),
              pdf.radio(
                'Suturing technique',
                this.data ? this.data.sectionE.AccessSiteClosure : null
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Cross Over', { annotation: '7325' }),
            pdf.stack(
              pdf.radio('Right Femoral', this.data ? this.data.sectionE.Crossover : null),
              pdf.radio('Left Femoral', this.data ? this.data.sectionE.Crossover : null)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data ? this.data.sectionE.Crossover : null),
              pdf.radio('Left Brachial', this.data ? this.data.sectionE.Crossover : null)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data ? this.data.sectionE.Crossover : null),
              pdf.radio('Left Radial', this.data ? this.data.sectionE.Crossover : null)
            ),
            pdf.radio('No', this.data ? this.data.sectionE.Crossover : null, { width: 75 })
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
              pdf.radio(
                'Manual Compression',
                this.data ? this.data.sectionE.CrossoverClosure : null
              ),
              pdf.radio(
                'Compression Device',
                this.data ? this.data.sectionE.CrossoverClosure : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Sealing technique',
                this.data ? this.data.sectionE.CrossoverClosure : null
              ),
              pdf.radio(
                'Suturing technique',
                this.data ? this.data.sectionE.CrossoverClosure : null
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Simultaneous'),
            pdf.stack(
              pdf.radio('Right Femoral', this.data ? this.data.sectionE.Simultaneous : null),
              pdf.radio('Left Femoral', this.data ? this.data.sectionE.Simultaneous : null)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data ? this.data.sectionE.Simultaneous : null),
              pdf.radio('Left Brachial', this.data ? this.data.sectionE.Simultaneous : null)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data ? this.data.sectionE.Simultaneous : null),
              pdf.radio('Left Radial', this.data ? this.data.sectionE.Simultaneous : null)
            ),
            pdf.radio('No', this.data ? this.data.sectionE.Simultaneous : null, { width: 75 })
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
              pdf.radio(
                'Manual Compression',
                this.data ? this.data.sectionE.SimultaneousClosure : null
              ),
              pdf.radio(
                'Compression Device',
                this.data ? this.data.sectionE.SimultaneousClosure : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Sealing technique',
                this.data ? this.data.sectionE.SimultaneousClosure : null
              ),
              pdf.radio(
                'Suturing technique',
                this.data ? this.data.sectionE.SimultaneousClosure : null
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Venous Access', { annotation: '7335' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionE.VenousAccess : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionE.VenousAccess : null)
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
              pdf.radio(
                'Manual Compression',
                this.data ? this.data.sectionE.VenousAccessClosure : null
              ),
              pdf.radio(
                'Compression Device',
                this.data ? this.data.sectionE.VenousAccessClosure : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Sealing technique',
                this.data ? this.data.sectionE.VenousAccessClosure : null
              ),
              pdf.radio(
                'Suturing technique',
                this.data ? this.data.sectionE.VenousAccessClosure : null
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Systolic BP', { annotation: '6016' }),
            pdf.input(this.data ? this.data.sectionE.ProcSystolicBP : null),
            ' mmHg'
          ),
          pdf.block(
            pdf.field('Cardiac Arrest at this facility', { annotation: '7340' }),
            pdf.radio('No', this.data ? this.data.sectionE.CAInHosp : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionE.CAInHosp : null)
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
              pdf.input(this.data ? this.data.sectionE.FluoroTime : null),
              ' miniutes'
            ),
            pdf.block(
              pdf.field('Contrast Volume', { annotation: '7215' }),
              pdf.input(this.data ? this.data.sectionE.ContrastVol : null),
              ' ml'
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Cumulative Air Kerma', { annotation: '7210' }),
              pdf.input(this.data ? this.data.sectionE.FluoroDoseKerm : null),
              ' mGy'
            ),
            pdf.block(
              pdf.field('Dose Area Product', { annotation: '7220' }),
              pdf.input(this.data ? this.data.sectionE.FluoroDoseDAP : null),
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
              pdf.radio('Drawn', this.data ? this.data.sectionF.PreProcTnILab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.PreProcTnI : null),
              ' ng/mL'
            ),
            pdf.field('hsTroponin I', { annotation: '8515', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.PostProcTnILab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.PostProcTnI : null),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('hsTroponin T', { annotation: '6095', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.PreProcTnTLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.PreProcTnT : null),
              ' ng/mL'
            ),
            pdf.field('hsTroponin T', { annotation: '8520', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.PostProcTnTLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.PostProcTnT : null),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('Creatinine', { annotation: '6050', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.PreProcCreatLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.PreProcCreat : null),
              ' ng/mL'
            ),
            pdf.blockStyle(
              { width: col1_3 },
              pdf.field('Creatinine', { annotation: '8510' }),
              pdf.text('(peak)', { fontSize: 8 })
            ),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.PostProcCreatLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.PostProcCreat : null),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('Hemoglobin', { annotation: '6030', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.HGBLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.HGB : null),
              ' g/dL'
            ),
            pdf.field('Hemoglobin', { annotation: '8505', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.PostProcHgbLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.PostProcHgb : null),
              ' g/dL'
            )
          ),
          pdf.columns(
            pdf.field('Total Cholesterol', { annotation: '6100', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data ? this.data.sectionF.LipidsTCLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.LipidsTC : null),
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
              pdf.radio('Drawn', this.data ? this.data.sectionF.LipidsHDLLab : null),
              ' ',
              pdf.input(this.data ? this.data.sectionF.LipidsHDL : null),
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
              pdf.check(
                'ACS <= 24 hrs',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'ACS > 24 hrs',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'New Onset Angina <= 2 months',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Worsening Angina',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Resuscitated Cardiac Arrest',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.block(
                pdf.check(
                  'Re-CathLab Visit',
                  this.data ? this.data.sectionG.CathLabVisitIndication : null
                ),
                ': CathPCI No.',
                pdf.input(this.data ? this.data.sectionG.PreviousCathLabVisit : null)
              )
            ),
            pdf.stack(
              pdf.check(
                'Stable Known CAD',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Suspected CAD',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Valvular Disease',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Pericardial Disease',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Cardiac Arrhythmia',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Cardiomyopathy',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              )
            ),
            pdf.stackStyle(
              { width: 'auto' },
              pdf.check(
                'LV Dysfunction',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check('Syncope', this.data ? this.data.sectionG.CathLabVisitIndication : null),
              pdf.check(
                'Post Cardiac Transplant',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Pre-operative Evaluation',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check(
                'Evaluation for Exercise Clearance',
                this.data ? this.data.sectionG.CathLabVisitIndication : null
              ),
              pdf.check('Other', this.data ? this.data.sectionG.CathLabVisitIndication : null)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Chest Pain Symptom Assessment', { annotation: '7405' }),
            pdf.tab(),
            pdf.radio('Typical Angina', this.data ? this.data.sectionG.CPSxAssess : null),
            pdf.tab(),
            pdf.radio('Atypical Angina', this.data ? this.data.sectionG.CPSxAssess : null),
            pdf.tab(),
            pdf.radio('Non-anginal Chest Pain', this.data ? this.data.sectionG.CPSxAssess : null),
            pdf.tab(),
            pdf.radio('Asymptomatic', this.data ? this.data.sectionG.CPSxAssess : null)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Cardiovascular Instability', { annotation: '7410' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionG.CVInstability : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionG.CVInstability : null)
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
                this.data ? this.data.sectionG.CVInstabilityType : null
              ),
              pdf.check(
                'Hemodynamic Instability (not cardiogenic shock)',
                this.data ? this.data.sectionG.CVInstabilityType : null
              ),
              pdf.check(
                'Ventricular Arrhythmias',
                this.data ? this.data.sectionG.CVInstabilityType : null
              )
            ),
            pdf.stack(
              pdf.check(
                'Cardiogenic Shock',
                this.data ? this.data.sectionG.CVInstabilityType : null
              ),
              pdf.check(
                'Acute Heart Failure Symptoms',
                this.data ? this.data.sectionG.CVInstabilityType : null
              ),
              pdf.check(
                'Refractory Cardiogenic Shock',
                this.data ? this.data.sectionG.CVInstabilityType : null
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Ventricular Support', { annotation: '7420' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionG.VSupport : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionG.VSupport : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Pharmacologic Vasopressor Support', { annotation: '7421' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionG.PharmVasoSupp : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionG.PharmVasoSupp : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Mechanical Ventricular Support', { annotation: '7422' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionG.MechVentSupp : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionG.MechVentSupp : null)
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
              pdf.radio(
                'Intra-aortic balloon pump (IABP)',
                this.data ? this.data.sectionG.MVSupportDevice : null
              ),
              pdf.radio(
                'Extracorporeal membrane oxygenation (ECMO)',
                this.data ? this.data.sectionG.MVSupportDevice : null
              ),
              pdf.radio(
                'Cardiopulmonary Support (CPS)',
                this.data ? this.data.sectionG.MVSupportDevice : null
              ),
              pdf.radio(
                'Impella: Left Ventricular Support',
                this.data ? this.data.sectionG.MVSupportDevice : null
              ),
              pdf.radio(
                'Impella: Right Ventricular Support',
                this.data ? this.data.sectionG.MVSupportDevice : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Left ventricular assist device (LVAD)',
                this.data ? this.data.sectionG.MVSupportDevice : null
              ),
              pdf.radio(
                'Right Ventricular Assist Device (RVAD)',
                this.data ? this.data.sectionG.MVSupportDevice : null
              ),
              pdf.radio(
                'Percutaneous Heart Pump (PHP)',
                this.data ? this.data.sectionG.MVSupportDevice : null
              ),
              pdf.radio('TandemHeart', this.data ? this.data.sectionG.MVSupportDevice : null)
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
              pdf.radio(
                'In place at start of procedure',
                this.data ? this.data.sectionG.MVSupportTiming : null
              ),
              pdf.radio(
                'Inserted during procedure and prior to intervention',
                this.data ? this.data.sectionG.MVSupportTiming : null
              ),
              pdf.radio(
                'Inserted after intervention has begun',
                this.data ? this.data.sectionG.MVSupportTiming : null
              )
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
                      pdf.radio('No', this.data ? this.data.sectionG.ASSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.ASSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.ASSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.ASSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.ASSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.ASSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Mitral Stenosis', { style: 'tableCell' }),
                      pdf.radio('No', this.data ? this.data.sectionG.MSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.MSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.MSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.MSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.MSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.MSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Pulmonic Stenosis', { style: 'tableCell' }),
                      pdf.radio('No', this.data ? this.data.sectionG.PSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.PSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.PSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.PSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.PSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.PSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Tricuspid Stenosis', { style: 'tableCell' }),
                      pdf.radio('No', this.data ? this.data.sectionG.TSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.TSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.TSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.TSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.TSSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.TSSeverity : null, {
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
                      pdf.radio('No', this.data ? this.data.sectionG.ARSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.ARSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.ARSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.ARSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.ARSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.ARSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Mitral Regurgitation', { style: 'tableCell' }),
                      pdf.radio('No', this.data ? this.data.sectionG.MRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.MRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.MRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.MRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.MRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.MRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Pulmonic Regurgitation', { style: 'tableCell' }),
                      pdf.radio('No', this.data ? this.data.sectionG.PRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.PRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.PRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.PRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.PRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.PRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      })
                    ],
                    [
                      pdf.text('Tricuspid Regurgitation', { style: 'tableCell' }),
                      pdf.radio('No', this.data ? this.data.sectionG.TRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Trivial', this.data ? this.data.sectionG.TRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Mild', this.data ? this.data.sectionG.TRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Moderate', this.data ? this.data.sectionG.TRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Severe', this.data ? this.data.sectionG.TRSeverity : null, {
                        alias: '',
                        style: 'radioInTable'
                      }),
                      pdf.radio('Unknown', this.data ? this.data.sectionG.TRSeverity : null, {
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
            pdf.radio('Cardiac Surgery', this.data ? this.data.sectionG.PreOPEval : null),
            pdf.tab(),
            pdf.radio('Non-Cardiac Surgery', this.data ? this.data.sectionG.PreOPEval : null)
          ),
          pdf.block(
            pdf.field('Functional Capacity', { annotation: '7466' }),
            pdf.tab(),
            pdf.radio('< 4 METS', this.data ? this.data.sectionG.FuncCapacity : null),
            pdf.tab(),
            pdf.radio(
              '>= 4 METS without Symptoms',
              this.data ? this.data.sectionG.FuncCapacity : null
            ),
            pdf.tab(),
            pdf.radio(
              '>= 4 METS with Symptoms',
              this.data ? this.data.sectionG.FuncCapacity : null
            ),
            pdf.tab(),
            pdf.radio('Unknown', this.data ? this.data.sectionG.FuncCapacity : null)
          ),
          pdf.block(
            pdf.field('Surgical Risk', { annotation: '7468' }),
            pdf.tab(),
            pdf.radio('Low', this.data ? this.data.sectionG.SurgRisk : null),
            pdf.tab(),
            pdf.radio('Intermediate', this.data ? this.data.sectionG.SurgRisk : null),
            pdf.tab(),
            pdf.radio('High Risk: Vascular', this.data ? this.data.sectionG.SurgRisk : null),
            pdf.tab(),
            pdf.radio('High Risk: Non-Vascular', this.data ? this.data.sectionG.SurgRisk : null)
          ),
          pdf.block(
            pdf.field('Solid Organ Transplant Surgery', { annotation: '7469' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionG.OrganTransplantSurg : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionG.OrganTransplantSurg : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transplant Donor', { annotation: '7470' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionG.OrganTransplantSurg : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionG.OrganTransplantSurg : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transplant Type', { annotation: '7471' }),
            pdf.tab(),
            pdf.check('Heart', this.data ? this.data.sectionG.OrganTransplantType : null),
            pdf.tab(),
            pdf.check('Kidney', this.data ? this.data.sectionG.OrganTransplantType : null),
            pdf.tab(),
            pdf.check('Liver', this.data ? this.data.sectionG.OrganTransplantType : null),
            pdf.tab(),
            pdf.check('Lung', this.data ? this.data.sectionG.OrganTransplantType : null),
            pdf.tab(),
            pdf.check('Pancreas', this.data ? this.data.sectionG.OrganTransplantType : null),
            pdf.tab(),
            pdf.check('Other Organ', this.data ? this.data.sectionG.OrganTransplantType : null)
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
            pdf.radio('Left', this.data ? this.data.sectionH.Dominance : null),
            pdf.tab(),
            pdf.radio('Right', this.data ? this.data.sectionH.Dominance : null),
            pdf.tab(),
            pdf.radio('Co-dominant', this.data ? this.data.sectionH.Dominance : null)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Native Vessel with Stenosis >= 50%', { annotation: '7505' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionH.NVStenosis : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionH.NVStenosis : null),
            pdf.tab(4),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Specify Segment(s)'),
            pdf.text('(See in Appendix)', {
              italics: true,
              fontSize: 8,
            })
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
            pdf.radio('No', this.data ? this.data.sectionH.GraftStenosis : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionH.GraftStenosis : null),
            pdf.tab(4),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Specify Segment(s)'),
            pdf.text('(See in Appendix)', {
              italics: true,
              fontSize: 8,
            })
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
    const nvLength = this.data ? this.data.sectionH.NativeLesions.length : 0;
    const maxLength = nvLength < maxNvLength ? maxNvLength : nvLength;

    for (let index = 0; index < maxLength; index++) {
      let vessel = null;
      if (index < nvLength) {
        vessel = this.data ? this.data.sectionH.NativeLesions[index] : null;
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
    const nvLength = this.data ? this.data.sectionH.GraftLesions.length : 0;
    const maxLength = nvLength < maxGraftLength ? maxGraftLength : nvLength;

    for (let index = 0; index < maxLength; index++) {
      let vessel = null;
      if (index < nvLength) {
        vessel = this.data ? this.data.sectionH.GraftLesions[index] : null;
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
            pdf.radio('Elective', this.data ? this.data.sectionI.PCIStatus : null),
            pdf.tab(),
            pdf.radio('Urgent', this.data ? this.data.sectionI.PCIStatus : null),
            pdf.tab(),
            pdf.radio('Emergency', this.data ? this.data.sectionI.PCIStatus : null),
            pdf.tab(),
            pdf.radio('Salvage', this.data ? this.data.sectionI.PCIStatus : null)
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
                      pdf.radio('No', this.data ? this.data.sectionI.HypothermiaInduced : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionI.HypothermiaInduced : null)
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
                          pdf.radio(
                            'Post PCI',
                            this.data ? this.data.sectionI.HypothermiaInducedTiming : null
                          )
                        )
                      ),
                      pdf.stack(
                        pdf.radio(
                          'Initiated Pre-PCI, <= 6 hrs post cardiac arrest',
                          this.data ? this.data.sectionI.HypothermiaInducedTiming : null
                        ),
                        pdf.radio(
                          'Initiated Pre-PCI, > 6 hrs post cardiac arrest',
                          this.data ? this.data.sectionI.HypothermiaInducedTiming : null
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
                        pdf.radio('(A) Alert', this.data ? this.data.sectionI.LOCProc : null),
                        pdf.radio('(V) Verbal', this.data ? this.data.sectionI.LOCProc : null)
                      ),
                      pdf.stack(
                        pdf.radio('(P) Pain', this.data ? this.data.sectionI.LOCProc : null),
                        pdf.radio('(U) Unresponsive', this.data ? this.data.sectionI.LOCProc : null)
                      ),
                      pdf.radio('Unable to Assess', this.data ? this.data.sectionI.LOCProc : null)
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
                this.data ? this.data.sectionI.PCIProcedureRisk : null
              ),
              pdf.radio(
                'Complex High Risk Indicated Procedure (CHIP)',
                this.data ? this.data.sectionI.PCIProcedureRisk : null
              ),
              pdf.block(
                pdf.tab(2),
                pdf.check('Chronic Total Occlusion', this.data ? this.data.sectionI.CHIP : null)
              ),
              pdf.block(
                pdf.tab(2),
                pdf.check('Bifurcation Lesion', this.data ? this.data.sectionI.CHIP : null)
              ),
              pdf.block(
                pdf.tab(2),
                pdf.check(
                  'Poor LV function with Device support',
                  this.data ? this.data.sectionI.CHIP : null
                )
              ),
              pdf.block(
                pdf.tab(2),
                pdf.check('Left Main Disease ≥ 50%', this.data ? this.data.sectionI.CHIP : null)
              ),
              pdf.block(
                pdf.tab(2),
                pdf.check('Severe Calcification', this.data ? this.data.sectionI.CHIP : null)
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Decision for PCI with Surgical Consult', { annotation: '7815', width: 180 }),
            pdf.block(
              pdf.radio('No', this.data ? this.data.sectionI.PCIDecision : null),
              pdf.tab(),
              pdf.radio('Yes', this.data ? this.data.sectionI.PCIDecision : null)
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
              pdf.radio(
                'Surgery NOT Recommended',
                this.data ? this.data.sectionI.CVTxDecision : null
              ),
              pdf.radio(
                'Surgery Recommended, Patient/Family Declined',
                this.data ? this.data.sectionI.CVTxDecision : null
              ),
              pdf.radio(
                'Surgery Recommended, Patient/Family Accepted (Hybrid procedure)',
                this.data ? this.data.sectionI.CVTxDecision : null
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
              pdf.radio(
                'Surgical information sheet provided',
                this.data ? this.data.sectionI.CVSheetDecision : null
              ),
              pdf.radio(
                'Surgical information sheet NOT provided',
                this.data ? this.data.sectionI.CVSheetDecision : null
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('PCI for Multi-vessel Disease', { annotation: '7820' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionI.MultiVesselDz : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionI.MultiVesselDz : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Multi-vessel Procedure Type', { annotation: '7820' }),
            '(in this lab visit)',
            pdf.tab(),
            pdf.radio('Initial PCI', this.data ? this.data.sectionI.MultiVessProcType : null),
            pdf.tab(),
            pdf.radio('Staged PCI', this.data ? this.data.sectionI.MultiVessProcType : null)
          ),
          pdf.block(
            pdf.field('Stage PCI Planned'),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionI.StagePCIPlanned : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionI.StagePCIPlanned : null)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('PCI Indication', { annotation: '7825', width: 90 }),
            pdf.stack(
              pdf.radio(
                'STEMI - Immediate PCI for Acute STEMI',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio(
                'STEMI - Stable (<= 12 hrs from Sx)',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio(
                'STEMI - Stable (> 12 hrs from Sx)',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio(
                'STEMI - Unstable (> 12 hrs from Sx)',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio(
                'STEMI (after successful lytics) <= 24 hrs',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio(
                'STEMI (after successful lytics) > 24 hrs - 7 days',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio(
                'STEMI - Rescue (after unsuccessful lytics)',
                this.data ? this.data.sectionI.PCIIndication : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'New Onset Angina <= 2 months',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio('NSTE-ACS', this.data ? this.data.sectionI.PCIIndication : null),
              pdf.radio('Stable Angina', this.data ? this.data.sectionI.PCIIndication : null),
              pdf.radio(
                'CAD (without ischemic Sx)',
                this.data ? this.data.sectionI.PCIIndication : null
              ),
              pdf.radio('Other', this.data ? this.data.sectionI.PCIIndication : null)
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
                this.data ? this.data.sectionI.SymptomDateTime : null,
                this.data
                  ? this.data.sectionI.SymptomOnset
                  : null === 'Unknown'
                  ? 'date'
                  : 'datetime'
              )
            ),
            pdf.block(
              pdf.field('Symptom Onset'),
              pdf.space(2),
              pdf.radio('Exacted', this.data ? this.data.sectionI.SymptomOnset : null),
              pdf.space(2),
              pdf.radio('Estimated', this.data ? this.data.sectionI.SymptomOnset : null),
              pdf.space(2),
              pdf.radio('Unknown', this.data ? this.data.sectionI.SymptomOnset : null)
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
              pdf.radio('No', this.data ? this.data.sectionI.ThromTherapy : null),
              pdf.radio('Streptokinase (SK)', this.data ? this.data.sectionI.ThromTherapy : null)
            ),
            pdf.stack(
              pdf.radio(
                'Tissue Plasminogen Activators (tPA)',
                this.data ? this.data.sectionI.ThromTherapy : null
              ),
              pdf.block(
                pdf.radio(
                  'Tenecteplase (TNK-tPA)',
                  this.data ? this.data.sectionI.ThromTherapy : null
                ),
                pdf.tab(3),
                pdf.radio('Other', this.data ? this.data.sectionI.ThromTherapy : null)
              )
            )
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' any Thrombolytics, ',
            pdf.field('Start Date/Time', { annotation: '7830' }),
            pdf.date(this.data ? this.data.sectionI.ThromDateTime : null, 'datetime')
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' not STEMI, ',
            pdf.field('Syntax Score', { annotation: '7831' }),
            pdf.tab(),
            pdf.radio('Low', this.data ? this.data.sectionI.SyntaxScore : null),
            pdf.tab(),
            pdf.radio('Intermediate', this.data ? this.data.sectionI.SyntaxScore : null),
            pdf.tab(),
            pdf.radio('High', this.data ? this.data.sectionI.SyntaxScore : null),
            pdf.tab(),
            pdf.radio('Unknown', this.data ? this.data.sectionI.SyntaxScore : null),
            pdf.tab(2),
            pdf.field('Syntax Score Value'),
            pdf.input(this.data ? this.data.sectionI.SyntaxScoreValue : null, { blank: 6 })
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
                      pdf.radio('First ECG', this.data ? this.data.sectionI.StemiFirstNoted : null),
                      pdf.tab(),
                      pdf.radio(
                        'Subsequent ECG',
                        this.data ? this.data.sectionI.StemiFirstNoted : null
                      )
                    ),
                    pdf.block(
                      pdf.tab(),
                      pdf.arrowIf(),
                      ' Subsequent ECG, ',
                      pdf.field('ECG with STEMI/ STEMI Equivalent Date & Time', {
                        annotation: '7836'
                      }),
                      pdf.date(this.data ? this.data.sectionI.SubECGDateTime : null, 'datetime')
                    ),
                    pdf.block(
                      pdf.tab(),
                      pdf.arrowIf(),
                      ' Subsequent ECG, ',
                      pdf.field('ECG obtained in Emergency Department', { annotation: '7840' }),
                      pdf.tab(),
                      pdf.radio('No', this.data ? this.data.sectionI.SubECGED : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionI.SubECGED : null)
                    ),
                    pdf.block(
                      pdf.field('Transferred In For Immediate PCI for STEMI', {
                        annotation: '7841'
                      }),
                      pdf.tab(),
                      pdf.radio('No', this.data ? this.data.sectionI.PatientTransPCI : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionI.PatientTransPCI : null)
                    ),
                    pdf.block(
                      pdf.tab(),
                      pdf.arrowIf(),
                      ' Yes, ',
                      pdf.field('Date & Time ED Presentation at Referring Facility', {
                        annotation: '7842'
                      }),
                      pdf.date(this.data ? this.data.sectionI.EDPresentDateTime : null, 'datetime')
                    ),
                    pdf.block(
                      pdf.field('First Device Activation Date & Time', { annotation: '7845' }),
                      pdf.date(
                        this.data ? this.data.sectionI.FirstDevActiDateTime : null,
                        'datetime'
                      )
                    ),
                    pdf.block(
                      pdf.field('Patient Centered Reason for Delay in PCI', { annotation: '7850' }),
                      pdf.tab(),
                      pdf.radio('No', this.data ? this.data.sectionIPtPCIDelayReason : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionIPtPCIDelayReason : null)
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
                              this.data ? this.data.sectionI.PCIDelayReason : null
                            ),
                            { width: 250 }
                          ),
                          pdf.radio('Other', this.data ? this.data.sectionI.PCIDelayReason : null)
                        ),
                        pdf.radio(
                          'Difficulty crossing the culprit lesion',
                          this.data ? this.data.sectionI.PCIDelayReason : null
                        ),
                        pdf.radio(
                          'Cardiac Arrest and/or need for intubation before PCI',
                          this.data ? this.data.sectionI.PCIDelayReason : null
                        ),
                        pdf.radio(
                          'Patient delays in providing consent for PCI',
                          this.data ? this.data.sectionI.PCIDelayReason : null
                        ),
                        pdf.radio(
                          'Emergent placement of LV support device before PCI',
                          this.data ? this.data.sectionI.PCIDelayReason : null
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
                    pdf.radio('No', this.data ? this.data.sectionI.Argatroban : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Argatroban : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Bivalirudin : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Bivalirudin : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Fondaparinux : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Fondaparinux : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.HeparinDerivative : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.HeparinDerivative : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.LMWH : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.LMWH : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.UFH : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.UFH : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Warfarin : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Warfarin : null)
                  )
                )
              ],
              [
                { text: 'Antiplatelet', bold: true, margin: [0, 5, 0, 0] },
                pdf.text('Vorapaxar', { margin: [0, 5, 0, 0] }),
                pdf.blockStyle(
                  { alignment: 'center', margin: [0, 5, 0, 0] },
                  pdf.radio('No', this.data ? this.data.sectionI.Vorapaxar : null),
                  pdf.tab(),
                  pdf.radio('Yes', this.data ? this.data.sectionI.Vorapaxar : null)
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
                  pdf.radio('No', this.data ? this.data.sectionI.GPIIbIIIa : null),
                  pdf.tab(),
                  pdf.radio('Yes', this.data ? this.data.sectionI.GPIIbIIIa : null)
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
                    pdf.radio('No', this.data ? this.data.sectionI.Apixaban : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Apixaban : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Dabigatran : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Dabigatran : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Edoxaban : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Edoxaban : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Rivaroxaban : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Rivaroxaban : null)
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
                    pdf.radio('No', this.data ? this.data.sectionI.Cangrelor : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Cangrelor : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Clopidogrel : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Clopidogrel : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Prasugrel : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Prasugrel : null)
                  ),
                  pdf.blockStyle(
                    { alignment: 'center' },
                    pdf.radio('No', this.data ? this.data.sectionI.Ticagrelor : null),
                    pdf.tab(),
                    pdf.radio('Yes', this.data ? this.data.sectionI.Ticagrelor : null)
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
            pdf.radio('Angiographic Success', this.data ? this.data.sectionJ.PCIResult : null),
            pdf.tab(),
            pdf.radio('Angiographic Failure', this.data ? this.data.sectionJ.PCIResult : null)
          )
        )
      ]
    ];
  }

  private getPci() {
    const output = [];
    const pciLength = this.data ? this.data.sectionJ.PciLesions.length : 0;
    const maxLength = pciLength < maxPciLength ? maxPciLength : pciLength;

    for (let index = 0; index < maxLength; index++) {
      let pci = null;
      if (index < pciLength) {
        pci = this.data ? this.data.sectionJ.PciLesions[index] : null;
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
                  pdf.field('Bifurcation Classification'),
                  pdf.text('(See in Appendix)', {
                    italics: true,
                    fontSize: 8,
                  })
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
    const deviceLength = this.data ? this.data.sectionJ.PciDevices.length : 0;
    const maxLength = deviceLength < maxDeviceLength ? maxDeviceLength : deviceLength;

    for (let index = 0; index < maxLength; index++) {
      let device = null;
      if (index < deviceLength) {
        device = this.data ? this.data.sectionJ.PciDevices[index] : null;
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
                      pdf.radio('No', this.data ? this.data.sectionK.K_BleedingAccessSite : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_BleedingAccessSite : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_BleedingGI : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_BleedingGI : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_BleedingGU : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_BleedingGU : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_BleedingHematoma : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_BleedingHematoma : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_BleedingOther : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_BleedingOther : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_BleedingRetro : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_BleedingRetro : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_CardiacArrest : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_CardiacArrest : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_CardiacTamponade : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_CardiacTamponade : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_CardiogenicShock : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_CardiogenicShock : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_HeartFailure : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_HeartFailure : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_NewDialysis : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_NewDialysis : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_OtherVascular : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_OtherVascular : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_StrokeHemorrhage : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_StrokeHemorrhage : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_StrokeIschemic : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_StrokeIschemic : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_StrokeUndetermined : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_StrokeUndetermined : null)
                    ),
                    pdf.blockStyle(
                      { alignment: 'center' },
                      pdf.radio('No', this.data ? this.data.sectionK.K_MyocardialInfarction : null),
                      pdf.tab(),
                      pdf.radio('Yes', this.data ? this.data.sectionK.K_MyocardialInfarction : null)
                    )
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_BleedingAccessSiteDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_BleedingGIDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_BleedingGUDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_BleedingHematomaDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_BleedingOtherDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_BleedingRetroDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_CardiacArrestDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_CardiacTamponadeDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_CardiogenicShockDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_HeartFailureDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_NewDialysisDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(this.data ? this.data.sectionK.K_OtherVascularDT : null, 'datetime'),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_StrokeHemorrhageDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_StrokeIschemicDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_StrokeUndeterminedDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    ),
                    pdf.prop(
                      pdf.date(
                        this.data ? this.data.sectionK.K_MyocardialInfarctionDT : null,
                        'datetime'
                      ),
                      {
                        alignment: 'center'
                      }
                    )
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
              this.data ? this.data.sectionK.K_MyocardialInfarctionCriteria : null
            )
          ),
          pdf.block(
            pdf.tab(2),
            pdf.radio(
              'Absolute rise in cTn (form baseline) >= 70x(URL)',
              this.data ? this.data.sectionK.K_MyocardialInfarctionCriteria : null
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('RBC Transfusion', { annotation: '9275' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionK.PostTransfusion : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionK.PostTransfusion : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Number of Units Transfused', { annotation: '7026' }),
            pdf.input(this.data ? this.data.sectionK.PRBCUnits : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transfusion PCI', { annotation: '9277' }),
            '(within 72 hours)',
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionK.TransfusPostPCI : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionK.TransfusPostPCI : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Transfusion Surgical', { annotation: '9278' }),
            '(within 72 hours)',
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionK.TransfusionPostSurg : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionK.TransfusionPostSurg : null)
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
            pdf.radio('No', this.data ? this.data.sectionL.HospIntervention : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionL.HospIntervention : null)
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
              pdf.check('CABG', this.data ? this.data.sectionL.HospInterventionType : null),
              pdf.check(
                'Valvular Intervention',
                this.data ? this.data.sectionL.HospInterventionType : null
              ),
              pdf.check(
                'Cardiac Surgery (non CABG)',
                this.data ? this.data.sectionL.HospInterventionType : null
              ),
              pdf.check(
                'Structural Heart Intervention (non-valvular)',
                this.data ? this.data.sectionL.HospInterventionType : null
              )
            ),
            pdf.stack(
              pdf.check(
                'Surgery (Non Cardiac)',
                this.data ? this.data.sectionL.HospInterventionType : null
              ),
              pdf.check('EP Study', this.data ? this.data.sectionL.HospInterventionType : null),
              pdf.check('Other', this.data ? this.data.sectionL.HospInterventionType : null)
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
                  pdf.radio('Elective', this.data ? this.data.sectionL.CABGStatus : null),
                  pdf.tab(),
                  pdf.radio('Urgent', this.data ? this.data.sectionL.CABGStatus : null),
                  pdf.tab(),
                  pdf.radio('Emergency', this.data ? this.data.sectionL.CABGStatus : null),
                  pdf.tab(),
                  pdf.radio('Salvage', this.data ? this.data.sectionL.CABGStatus : null)
                )
              ),
              pdf.columns(
                pdf.field('CABG Indication', { annotation: '10036', width: 100 }),
                pdf.stackStyle(
                  { width: 220 },
                  pdf.radio(
                    'PCI/CABG Hybrid Procedure',
                    this.data ? this.data.sectionL.CABGIndication : null
                  ),
                  pdf.radio(
                    'Recommendation from Dx Cath (instead of PCI)',
                    this.data ? this.data.sectionL.CABGIndication : null
                  )
                ),
                pdf.stack(
                  pdf.radio('PCI Failure', this.data ? this.data.sectionL.CABGIndication : null),
                  pdf.radio(
                    'PCI Complication',
                    this.data ? this.data.sectionL.CABGIndication : null
                  )
                )
              ),
              pdf.columns(
                pdf.field('CABG Date/Time', { annotation: '10011', width: 100 }),
                pdf.date(this.data ? this.data.sectionL.CABGDateTime : null, 'datetime')
              )
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.block(
              pdf.field('Discharge Date/Time', { annotation: '10101' }),
              pdf.date(this.data ? this.data.sectionL.DCDateTime : null, 'datetime')
            ),
            pdf.block(
              pdf.field('Discharge Provider', { annotation: '10070,10071' }),
              pdf.input(this.data ? this.data.sectionL.DCProvider : null)
            )
          ),
          pdf.block(
            pdf.field('Comfort Measures Only', { annotation: '10075' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionL.DC_Comfort : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionL.DC_Comfort : null)
          ),
          pdf.block(
            pdf.field('Discharge Status', { annotation: '10105' }),
            pdf.tab(),
            pdf.radio('Alive', this.data ? this.data.sectionL.DCStatus : null),
            pdf.tab(),
            pdf.radio('Deceased', this.data ? this.data.sectionL.DCStatus : null)
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
              pdf.radio('Home', this.data ? this.data.sectionL.DCLocation : null),
              pdf.radio(
                'Extended care/TCU/rehab',
                this.data ? this.data.sectionL.DCLocation : null
              ),
              pdf.radio(
                'Other acute care hospital',
                this.data ? this.data.sectionL.DCLocation : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Skilled Nursing facility',
                this.data ? this.data.sectionL.DCLocation : null
              ),
              pdf.radio('Other', this.data ? this.data.sectionL.DCLocation : null),
              pdf.radio(
                'Left against medical advice (AMA)',
                this.data ? this.data.sectionL.DCLocation : null
              )
            )
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Other acute care hospital, ',
            pdf.field('Transferred for CABG', { annotation: '10111' }),
            pdf.radio('No', this.data ? this.data.sectionL.CABGTransfer : null),
            pdf.space(2),
            pdf.radio('Yes', this.data ? this.data.sectionL.CABGTransfer : null)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' NOT Left against medical advice (AMA) OR Other acute care hospital, ',
            pdf.field('CABG Planned after Discharge', { annotation: '10112' }),
            pdf.radio('No', this.data ? this.data.sectionL.CABGPlannedDC : null),
            pdf.space(),
            pdf.radio('Yes', this.data ? this.data.sectionL.CABGPlannedDC : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Alive, ',
            pdf.field('Hospice Care', { annotation: '10115' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionL.DCHospice : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionL.DCHospice : null)
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
              pdf.radio(
                'No - Reason Not Documented',
                this.data ? this.data.sectionL.DC_CardRehab : null
              ),
              pdf.radio(
                'No - Medical Reason Documented',
                this.data ? this.data.sectionL.DC_CardRehab : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'No - Health Care System Reason Documented',
                this.data ? this.data.sectionL.DC_CardRehab : null
              ),
              pdf.radio('Yes', this.data ? this.data.sectionL.DC_CardRehab : null)
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
            pdf.radio('(A) Alert', this.data ? this.data.sectionL.DC_LOC : null),
            pdf.tab(),
            pdf.radio('(V) Verbal', this.data ? this.data.sectionL.DC_LOC : null),
            pdf.tab(),
            pdf.radio('(P) Pain', this.data ? this.data.sectionL.DC_LOC : null),
            pdf.tab(),
            pdf.radio('(U) Unresponsive', this.data ? this.data.sectionL.DC_LOC : null),
            pdf.tab(),
            pdf.radio('Unable to Assess', this.data ? this.data.sectionL.DC_LOC : null)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Deceased, ',
            pdf.field('Death During the Procedure', { annotation: '10120' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionL.DeathProcedure : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionL.DeathProcedure : null)
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
              pdf.radio(
                'Acute myocardial infarction',
                this.data ? this.data.sectionL.DeathCause : null
              ),
              pdf.radio('Sudden cardiac death', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Heart failure', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio(
                'Cardiovascular procedure',
                this.data ? this.data.sectionL.DeathCause : null
              ),
              pdf.radio(
                'Cardiovascular hemorrhage',
                this.data ? this.data.sectionL.DeathCause : null
              ),
              pdf.radio(
                'Other cardiovascular reason',
                this.data ? this.data.sectionL.DeathCause : null
              ),
              pdf.radio(
                'Non-cardiovascular procedure or surgery',
                this.data ? this.data.sectionL.DeathCause : null
              )
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Pulmonary', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Neurological', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Hepatobiliary', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Pancreatic', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Renal', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Gastrointestinal', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Suicide', this.data ? this.data.sectionL.DeathCause : null)
            ),
            pdf.stack(
              pdf.radio('Trauma', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Stroke', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Malignancy', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Hemorrhage', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio('Infection', this.data ? this.data.sectionL.DeathCause : null),
              pdf.radio(
                'Inflammatory/Immunologic',
                this.data ? this.data.sectionL.DeathCause : null
              ),
              pdf.radio(
                'Other non-cardiovascular reason',
                this.data ? this.data.sectionL.DeathCause : null
              )
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
              pdf.radio('None', this.data ? this.data.sectionL.L_DeviceCompositeEP : null),
              pdf.radio('Cardiac death', this.data ? this.data.sectionL.L_DeviceCompositeEP : null)
            ),
            pdf.stack(
              pdf.radio(
                'MI (not clearly attribute to a non-target vessel)',
                this.data ? this.data.sectionL.L_DeviceCompositeEP : null
              ),
              pdf.radio(
                'TLR - Target Lesion Revascularization',
                this.data ? this.data.sectionL.L_DeviceCompositeEP : null
              )
            )
          ),
          pdf.field('Patient-oriented Composite End Point'),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 150 },
              pdf.radio('None', this.data ? this.data.sectionL.L_PatientCompositeEP : null),
              pdf.radio(
                'All-cause mortality',
                this.data ? this.data.sectionL.L_PatientCompositeEP : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Any MI (included non-target vessel territory)',
                this.data ? this.data.sectionL.L_PatientCompositeEP : null
              ),
              pdf.radio(
                'Any repeat revascularization (includes all target and non-target vessels)',
                this.data ? this.data.sectionL.L_PatientCompositeEP : null
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
                  pdf.radio('Yes - Prescribed', this.data ? this.data.sectionL.DC_Aspirin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Aspirin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Aspirin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Aspirin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_AspirinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_AspirinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_AspirinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Vorapaxar', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Vorapaxar : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Vorapaxar : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Vorapaxar : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Vorapaxar : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_VorapaxarRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_VorapaxarRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_VorapaxarRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('P2Y12 Inhibitors', {
                    style: 'medCell',
                    rowSpan: 4,
                    margin: [0, 18, 0, 0]
                  }),
                  pdf.text('Clopidogrel', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Clopidogrel : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - No Reason',
                    this.data ? this.data.sectionL.DC_Clopidogrel : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Clopidogrel : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Clopidogrel : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_ClopidogrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_ClopidogrelRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_ClopidogrelRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Prasugrel', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Prasugrel : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Prasugrel : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Prasugrel : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Prasugrel : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_PrasugrelRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_PrasugrelRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_PrasugrelRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Ticagrelor', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Ticagrelor : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Ticagrelor : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Ticagrelor : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Ticagrelor : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_TicagrelorRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_TicagrelorRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_TicagrelorRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Ticlopidine', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Ticlopidine : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - No Reason',
                    this.data ? this.data.sectionL.DC_Ticlopidine : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Ticlopidine : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Ticlopidine : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_TiclopidineRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_TiclopidineRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_TiclopidineRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('Statin', { style: 'medCell' }),
                  pdf.text('Statin (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data ? this.data.sectionL.DC_Statin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Statin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Statin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Statin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_StatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_StatinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_StatinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('Non-Statin', { style: 'medCell' }),
                  pdf.text('Non-Statin (Any)', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_NonStatin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_NonStatin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_NonStatin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_NonStatin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_NonStatinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_NonStatinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_NonStatinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('PCSK9 Inhibitors', {
                    style: 'medCell',
                    rowSpan: 2,
                    margin: [0, 3, 0, 0]
                  }),
                  pdf.text('Alirocumab', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Alirocumab : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Alirocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Alirocumab : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Alirocumab : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_AlirocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_AlirocumabRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_AlirocumabRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Evolocumab', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Evolocumab : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Evolocumab : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Evolocumab : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Evolocumab : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_EvolocumabRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_EvolocumabRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_EvolocumabRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('Beta Blockers', { style: 'medCell' }),
                  pdf.text('Beta Blocker (Any)', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_BetaBlocker : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - No Reason',
                    this.data ? this.data.sectionL.DC_BetaBlocker : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_BetaBlocker : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_BetaBlocker : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_BetaBlockerRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_BetaBlockerRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_BetaBlockerRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('ACE Inhibitors', { style: 'medCell' }),
                  pdf.text('ACE Inhibitors (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data ? this.data.sectionL.DC_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data ? this.data.sectionL.DC_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data ? this.data.sectionL.DC_ACEI : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_ACEIRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_ACEIRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_ACEIRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('ARB', { style: 'medCell' }),
                  pdf.text('ARB (Any)', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data ? this.data.sectionL.DC_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Medical Reason', this.data ? this.data.sectionL.DC_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - Patient Reason', this.data ? this.data.sectionL.DC_ARB : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_ARBRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_ARBRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_ARBRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('Anticoagulant', { style: 'medCell' }),
                  pdf.text('Warfarin', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data ? this.data.sectionL.DC_Warfarin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Warfarin : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Warfarin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Warfarin : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_WarfarinRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_WarfarinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_WarfarinRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  pdf.text('Non-Vitamin K Dependent Oral Anticoagulant', {
                    style: 'medCell',
                    rowSpan: 4,
                    margin: [0, 12, 0, 0]
                  }),
                  pdf.text('Apixaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data ? this.data.sectionL.DC_Apixaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Apixaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Apixaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Apixaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_ApixabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_ApixabanRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_ApixabanRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Dabigatran', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Dabigatran : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Dabigatran : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Dabigatran : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Dabigatran : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_DabigatranRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_DabigatranRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_DabigatranRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Edoxaban', { style: 'tableCell' }),
                  pdf.radio('Yes - Prescribed', this.data ? this.data.sectionL.DC_Edoxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio('No - No Reason', this.data ? this.data.sectionL.DC_Edoxaban : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Edoxaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Edoxaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_EdoxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_EdoxabanRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_EdoxabanRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
                ],
                [
                  '',
                  pdf.text('Rivaroxaban', { style: 'tableCell' }),
                  pdf.radio(
                    'Yes - Prescribed',
                    this.data ? this.data.sectionL.DC_Rivaroxaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - No Reason',
                    this.data ? this.data.sectionL.DC_Rivaroxaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Medical Reason',
                    this.data ? this.data.sectionL.DC_Rivaroxaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'No - Patient Reason',
                    this.data ? this.data.sectionL.DC_Rivaroxaban : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio('Cost', this.data ? this.data.sectionL.DC_RivaroxabanRN : null, {
                    alias: '',
                    style: 'radioInTable'
                  }),
                  pdf.radio(
                    'Alternative Therapy Preferred',
                    this.data ? this.data.sectionL.DC_RivaroxabanRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  ),
                  pdf.radio(
                    'Negative Side Effect',
                    this.data ? this.data.sectionL.DC_RivaroxabanRN : null,
                    {
                      alias: '',
                      style: 'radioInTable'
                    }
                  )
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
              pdf.radio('Low Intensity Dose', this.data ? this.data.sectionL.DC_StatinDose : null),
              pdf.radio(
                'Moderate Intensity Dose',
                this.data ? this.data.sectionL.DC_StatinDose : null
              ),
              pdf.radio('High Intensity Dose', this.data ? this.data.sectionL.DC_StatinDose : null)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Discharge Medication Reconciliation Completed', { annotation: '10220' }),
            pdf.tab(),
            pdf.radio('No', this.data ? this.data.sectionL.DC_MedReconCompleted : null),
            pdf.tab(),
            pdf.radio('Yes', this.data ? this.data.sectionL.DC_MedReconCompleted : null)
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
              pdf.check(
                'Prescriptions: Cardiac',
                this.data ? this.data.sectionL.DC_MedReconciled : null
              ),
              pdf.check(
                'Prescriptions: Non-Cardiac',
                this.data ? this.data.sectionL.DC_MedReconciled : null
              ),
              pdf.check(
                'Over the Counter (OTC) Medications',
                this.data ? this.data.sectionL.DC_MedReconciled : null
              ),
              pdf.check(
                'Vitamins/Minerals',
                this.data ? this.data.sectionL.DC_MedReconciled : null
              ),
              pdf.check(
                'Herbal Supplements',
                this.data ? this.data.sectionL.DC_MedReconciled : null
              )
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
    const followUpLength = this.data ? this.data.sectionM.FollowUps.length : 0;
    const maxLength = followUpLength < maxFollowUpLength ? maxFollowUpLength : followUpLength;

    for (let index = 0; index < maxLength; index++) {
      let fu = null;
      if (index < followUpLength) {
        fu = this.data ? this.data.sectionM.FollowUps[index] : null;
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
              pdf.radio('None', this.data ? this.data.sectionL.M_DeviceCompositeEP : null),
              pdf.radio('Cardiac death', this.data ? this.data.sectionL.M_DeviceCompositeEP : null)
            ),
            pdf.stack(
              pdf.radio(
                'MI (not clearly attribute to a non-target vessel)',
                this.data ? this.data.sectionL.M_DeviceCompositeEP : null
              ),
              pdf.radio(
                'TLR - Target Lesion Revascularization',
                this.data ? this.data.sectionL.M_DeviceCompositeEP : null
              )
            )
          ),
          pdf.field('Patient-oriented Composite End Point'),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stackStyle(
              { width: 150 },
              pdf.radio('None', this.data ? this.data.sectionL.M_PatientCompositeEP : null),
              pdf.radio(
                'All-cause mortality',
                this.data ? this.data.sectionL.M_PatientCompositeEP : null
              )
            ),
            pdf.stack(
              pdf.radio(
                'Any MI (included non-target vessel territory)',
                this.data ? this.data.sectionL.M_PatientCompositeEP : null
              ),
              pdf.radio(
                'Any repeat revascularization (includes all target and non-target vessels)',
                this.data ? this.data.sectionL.M_PatientCompositeEP : null
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
