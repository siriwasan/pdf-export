import * as pdfMake from 'pdfmake/build/pdfmake';

export const report: pdfMake.TDocumentDefinitions = {
  content: [
    {
      table: {
        widths: ['*'],
        heights: [30],
        body: [
          [
            {
              columns: [
                { text: 'BDMS', alignment: 'left', width: 100 },
                { text: 'Data Collection Form', bold: true, alignment: 'center' },
                { text: 'CathPCI Registry', alignment: 'center', width: 155 }
              ],
              style: 'header'
            }
          ],
          ...sectionA(),
          ...sectionB()
        ]
      }
    }
  ],
  styles: {
    icon: {
      font: 'Fontello'
    },
    symbol: {
      font: 'FontAwesome',
      fontSize: 10
    },
    thai: {
      font: 'THSarabunNew',
      fontSize: 10
    },
    header: {
      fontSize: 20,
      color: 'darkblue',
      margin: [0, 7, 0, 0]
    },
    section: {
      bold: true,
      fillColor: '#dddddd',
      margin: [0, 1, 0, 0]
    },
    field: {
      bold: true
    },
    choice: {},
    superscript: {
      bold: true,
      italics: true
    },
    subscript: {
      bold: true,
      italics: true
    },
    inputLine: {
      lineHeight: 1.1,
      margin: [0, 5, 0, 0]
    }
  },
  defaultStyle: {
    font: 'Calibri',
    fontSize: 10,
    lineHeight: 1.1,
    margin: [0, 5, 0, 0]
}
};

function field(label: string, annotation?: string) {
  const output = { text: [], style: null };
  output.text.push({ text: label, style: 'field' });
  if (annotation) {
    output.text.push(superscript(annotation));
  }
  output.text.push({ text: ': ', style: 'field' });
  return output;
}

function radioChoice(label: string, widthz?: string | number) {
  return {
    text: [
      { text: '', style: 'symbol' },
      { text: ` ${label}`, style: 'choice' }
    ],
    width: widthz
  };
}

function superscript(annotation: string) {
  const superscripts = {
    0: '\u{2070}',
    1: '\u{00B9}',
    2: '\u{00B2}',
    3: '\u{00B3}',
    4: '\u{2074}',
    5: '\u{2075}',
    6: '\u{2076}',
    7: '\u{2077}',
    8: '\u{2078}',
    9: '\u{2079}'
  };

  let output = '';
  for (const c of annotation) {
    output += superscripts[c];
  }

  return { text: output, style: 'superscript' };
}

function subscript(annotation: string) {
  const superscripts = {
    0: '\u{2080}',
    1: '\u{2081}',
    2: '\u{2082}',
    3: '\u{2083}',
    4: '\u{2084}',
    5: '\u{2085}',
    6: '\u{2086}',
    7: '\u{2087}',
    8: '\u{2088}',
    9: '\u{2089}'
  };

  let output = '';
  for (const c of annotation) {
    output += superscripts[c];
  }

  return { text: output, style: 'subscript' };
}

function block(...arg: any[]) {
  console.log(arg);
  // const output = { text: [{ text: ['art', { text: '234', style: 'superscript' }, ':'], style: 'field' }] };
  // const output = { text: ['art', { text: '\u{2070}\u{00B9}', style: 'superscript' }, ':'], style: 'field' };
  // const output = {
  //   text: [
  //     { text: 'art', style: 'field' },
  //     { text: '\u{2070}\u{00B9}', style: 'superscript' },
  //     { text: ':', style: 'field' },
  //     { text: '', style: 'symbol' },
  //     { text: ` Male`, style: 'choice' }
  //   ]
  // };
  const output = { text: [] };
  for (const iterator of arg) {
    if (iterator.text) {
      output.text.push(...iterator.text);
    } else {
      output.text.push({ text: iterator });
    }
  }
  console.log(output);
  return output;
}

function space(num: number) {
  return ' '.repeat(num);
}

function width(txt: any, wid: number) {
  // tslint:disable-next-line: no-string-literal
  txt['width'] = wid;
  return txt;
}

function section(title: string) {
  return { text: title, style: 'section' };
}

function sectionA() {
  return [
    [section('A. DEMOGRAPHICS')],
    [
      {
        stack: [
          {
            columns: [
              field('Registry Id', '0123456789'),
              field('HN'),
              field('AN'),
            ],
            style: 'inputLine'
          },
          {
            columns: [field('Last Name', '2000'), field('First Name', '2010'), field('Middle Name', '2020')],
            style: 'inputLine'
          },
          {
            columns: [
              field('Birth Date', '2050'),
              field('Age'),
              block(
                field('Sex', '2060'),
                space(5),
                radioChoice('Male', 'auto'),
                space(5),
                radioChoice('Female', 'auto')
              )
            ],
            style: 'inputLine'
          },
          {
            columns: [
              width(field('SSN'), 100),
              block(
                field('Race'),
                space(5),
                radioChoice('White', 'auto'),
                space(5),
                radioChoice('Black/African American', 'auto'),
                space(5),
                radioChoice('European', 'auto'),
                space(5),
                radioChoice('Asian', 'auto')
              )
            ],
            style: 'inputLine'
          },
          {
            columns: [
              field('Nationality'),
              block(
                field(`Is This Patient's Permanet Address`),
                space(5),
                radioChoice('Yes', 'auto'),
                space(5),
                radioChoice('No', 'auto')
              )
            ],
            style: 'inputLine'
          }
        ]
      }
    ]
  ];
}

function sectionB() {
  return [
    [section('B. EPISODE OF CARE')],
    [{
      stack: [
        field('Hospital Name')
      ]
    }]
  ];
}
