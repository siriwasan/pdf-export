import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';

//#region Style
export const styles: pdfMake.Style = {
  icon: {
    font: 'Fontello'
  },
  symbol: {
    font: 'FontAwesome',
    fontSize: 9
  },
  thai: {
    font: 'THSarabunNew',
    fontSize: 12,
    lineHeight: 1.0
  },
  header: {
    fontSize: 20,
    color: 'darkblue',
    lineHeight: 1,
    margin: [0, 7, 0, 0]
  },
  section: {
    bold: true,
    fillColor: '#CBEEF3',
    lineHeight: 1,
    margin: [0, 1, 0, 0]
  },
  subSection: {
    fillColor: '#dddddd',
    lineHeight: 1,
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
    // lineHeight: 1.1,
    // margin: [0, 5, 0, 0]
  },
  tableHeader: {
    bold: true,
    lineHeight: 1.0,
    alignment: 'center'
  },
  tableHeaderWithAnno: {
    alignment: 'center',
    fillColor: '#dddddd',
    lineHeight: 1.0
  },
  tableCell: {
    lineHeight: 1.0
  },
  tableCellCenter: {
    lineHeight: 1.0,
    alignment: 'center',
  },
  deviceCell: {
    lineHeight: 1.4,
    margin: [0, 5, 0, 0]
  },
  medCell: {
    bold: true,
    lineHeight: 1.0
  },
  medTableHeader: {
    fontSize: 9,
    alignment: 'center',
    fillColor: '#dddddd',
    lineHeight: 1.0
  },
  radioInTable: {
    alias: '',
    lineHeight: 1.0,
    alignment: 'center'
  }
};

export const defaultStyle: pdfMake.Style = {
  font: 'Calibri',
  fontSize: 10,
  lineHeight: 1.4,
  preserveLeadingSpaces: true
};
//#endregion

//#region Layout
export function stack(...arg: any[]): pdfMake.Content {
  const output = { stack: [] };
  for (const iterator of arg) {
    if (typeof iterator === 'string') {
      output.stack.push({ text: iterator });
    } else {
      output.stack.push(iterator);
    }
  }
  return output;
}

export function stackStyle(styl: pdfMake.Style, ...arg: any[]): pdfMake.Content {
  return prop(stack(...arg), styl);
}

export function stackT(...arg: any[]): pdfMake.Content {
  const output = stack(...arg);
  output.style = 'tabelCell';
  return output;
}

export function columns(...arg: any[]): pdfMake.Content {
  const output = { columns: [] };
  for (const iterator of arg) {
    if (typeof iterator === 'string') {
      output.columns.push({ text: iterator });
    } else {
      output.columns.push(iterator);
    }
  }
  return output;
}

export function block(...arg: any[]): pdfMake.Content {
  const output = { text: [] };
  for (const iterator of arg) {
    if (typeof iterator === 'string') {
      output.text.push({ text: iterator });
    } else {
      output.text.push(iterator);
    }
  }
  return output as pdfMake.Content;
}

export function blockT(...arg: any[]): pdfMake.Content {
  const output = block(...arg);
  output.style = 'tableCell';
  return output;
}

export function blockStyle(styl: pdfMake.Style, ...arg: any[]): pdfMake.Content {
  return prop(block(...arg), styl);
}

export function space(num = 1) {
  return ' '.repeat(num);
}

export function tab(num = 1) {
  return '\t'.repeat(num);
}

export function ln() {
  return '\n';
}

export function emptyLine(): pdfMake.Content {
  return { text: '', margin: [0, 3, 0, 0] };
}

export function line(): pdfMake.Content {
  return {
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, color: 'gray' }]
  };
}

export function lineHalf(): pdfMake.Content {
  return {
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 243, y2: 0, lineWidth: 0.5, color: 'gray' }]
  };
}
//#endregion

//#region Pre-defined
export function superscript(annotation: string) {
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
    9: '\u{2079}',
    ',': '\u{2019}',
    '+': '\u207A',
    '-': '\u207B',
    '=': '\u207C',
    '(': '\u207D',
    ')': '\u207E'
  };

  let output = '';
  for (const c of annotation) {
    output += superscripts[c];
  }

  return { text: output, style: 'superscript' };
}

export function subscript(annotation: string) {
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

export function arrowIf(): pdfMake.Content {
  return { text: '→ If', bold: true };
}
//#endregion

//#region Utility
export function prop(txt: any, prp: pdfMake.Content): pdfMake.Content {
  Object.keys(prp).forEach(key => {
    txt[key] = prp[key];
  });
  return txt;
}

export function imageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d') as CanvasDrawImage;

      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = reject;

    img.src = url;
  });
}
//#endregion

//#region Form
export function section(title: string): pdfMake.Content {
  return { text: title, style: 'section' };
}

export function subSection(title: string): pdfMake.Content {
  return { text: title, style: 'subSection' };
}

export function field(label: string, styl?: pdfMake.Style): pdfMake.Content {
  const output = { text: [] };
  output.text.push({ text: label, style: 'field' });
  if (styl && styl.annotation) {
    output.text.push(superscript(styl.annotation));
  }
  output.text.push({ text: ':  ', style: 'field' });

  if (styl) {
    prop(output, styl);
  }
  return output;
}

export function fieldT(label: string, styl?: pdfMake.Style): pdfMake.Content {
  const output = field(label, styl);
  output.style = 'tableCell';
  return output;
}

export function input(label: string, styl?: pdfMake.Style): pdfMake.Content {
  let blank = '_____________';
  if (styl && styl.blank) {
    blank = '_'.repeat(styl.blank);
  }

  const output = { text: label ? label : blank, bold: true, italics: true };
  if (styl) {
    prop(output, styl);
  }
  return output;
}

export function inputArray(label: string[], styl?: pdfMake.Style): pdfMake.Content {
  let output = '__________,__________,__________,__________,__________';

  if (label) {
    output = '';
    label.forEach(s => {
      output += s + ', ';
    });
    output = output.substring(0, output.length - 2);
  }

  return input(output, styl);
}

export function inputT(label: string, styl?: pdfMake.Style): pdfMake.Content {
  const output = input(label, styl);
  output.style = 'tableCell';
  return output;
}

export function inputThai(label: string, styl?: pdfMake.Style): pdfMake.Content {
  // insert blank to adjust line postion
  let blank = '_____________';
  if (styl && styl.blank) {
    blank = '_'.repeat(styl.blank);
  }

  const output = { text: label ? label : blank, style: 'thai' };
  if (styl) {
    prop(output, styl);
  }
  return output;
}

function choice(symbol: string, label: string, styl?: pdfMake.Style): pdfMake.Content {
  const output = { text: [{ text: symbol, style: 'symbol' }] };

  if (styl && (styl.alias || styl.alias === '')) {
    output.text.push({ text: styl.alias, style: 'choice' });
  } else {
    output.text.push({ text: ` ${label}`, style: 'choice' });
  }

  if (styl && styl.annotation) {
    output.text.push(superscript(styl.annotation));
  }

  if (styl) {
    prop(output, styl);
  }
  return output;
}

export function radio(label: string, value: string, styl?: pdfMake.Style): pdfMake.Content {
  return choice(label === value ? '' : '', label, styl);
}

export function check(label: string, value: string, styl?: pdfMake.Style): pdfMake.Content {
  return choice(value && value.includes(label) ? '' : '', label, styl);
}

// export function radio(label: string, value: string, styl?: pdfMake.Style): pdfMake.Content {
//   const output = {
//     text: [
//       { text: label === value ? '' : '', style: 'symbol' },
//       { text: ` ${label}`, style: 'choice' }
//     ]
//   };

//   if (styl) {
//     prop(output, styl);

//     if (styl.annotation) {
//       output.text.push(superscript(styl.annotation));
//     }
//   }
//   return output;
// }

// export function check(label: string, value: any[], styl?: pdfMake.Style): pdfMake.Content {
//   const output = {
//     text: [
//       { text: value && value.includes(label) ? '' : '', style: 'symbol' },
//       { text: ` ${label}`, style: 'choice' }
//     ]
//   };

//   if (styl) {
//     prop(output, styl);

//     if (styl.annotation) {
//       output.text.push(superscript(styl.annotation));
//     }
//   }
//   return output;
// }

export function date(label: string, type = 'date'): pdfMake.Content {
  const d = moment(label);
  let output = '';

  if (d.isValid()) {
    output = d.format(type === 'date' ? 'D/M/YYYY' : 'D/M/YYYY H:mm');
  } else {
    output = type === 'date' ? '___ /___ /______' : '___ /___ /______,___:___';
  }
  return { text: output, bold: true, italics: true };
}

export function text(label: string, styl?: pdfMake.Style): pdfMake.Content {
  return { text: label, ...styl };
}
//#endregion
