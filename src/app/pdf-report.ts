import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';

declare module 'pdfmake/build/pdfmake' {
  export interface Content {
    annotation?: string;
  }
}

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
    lineHeight: 1,
    alignment: 'center'
  },
  tableCell: {
    lineHeight: 1
  }
};

export const defaultStyle: pdfMake.Style = {
  font: 'Calibri',
  fontSize: 10,
  lineHeight: 1.4,
  preserveLeadingSpaces: true
};

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
  return output as pdfMake.Content;
}

export function fieldT(label: string, styl?: pdfMake.Style): pdfMake.Content {
  const output = field(label, styl);
  output.style = 'tableCell';
  return output;
}

export function input(label: string): pdfMake.Content {
  return { text: label ? label : '_____________', bold: true, italics: true };
}

export function inputThai(label: string): pdfMake.Content {
  // insert blank to adjust line postion
  return { text: label ? label : '_____________', style: 'thai' };
}

export function radio(label: string, value: string, styl?: pdfMake.Style): pdfMake.Content {
  const output = {
    text: [
      { text: label === value ? '' : '', style: 'symbol' },
      { text: ` ${label}`, style: 'choice' }
    ]
    // width: 'auto'
  };

  if (styl) {
    prop(output, styl);

    if (styl.annotation) {
      output.text.push(superscript(styl.annotation));
    }
  }
  return output;
}

export function radioT(label: string, value: string, styl?: pdfMake.Style): pdfMake.Content {
  const output = radio(label, value, styl);
  output.style = 'tableCell';
  return output;
}

export function check(label: string, value: any[], styl?: pdfMake.Style): pdfMake.Content {
  const output = {
    text: [
      { text: value && value.includes(label) ? '' : '', style: 'symbol' },
      { text: ` ${label}`, style: 'choice' }
    ]
  };

  if (styl) {
    prop(output, styl);

    if (styl.annotation) {
      output.text.push(superscript(styl.annotation));
    }
  }
  return output;
}

export function block(...arg: any[]) {
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

export function blockStyle(styl: pdfMake.Style, ...arg: any[]) {
  return prop(block(...arg), styl);
}

export function columns(...arg: any[]) {
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

export function stack(...arg: any[]) {
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

export function stackStyle(styl: pdfMake.Style, ...arg: any[]) {
  return prop(stack(...arg), styl);
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

export function prop(txt: any, prp: pdfMake.Content) {
  Object.keys(prp).forEach(key => {
    txt[key] = prp[key];
  });
  return txt;
}

export function section(title: string): pdfMake.Content {
  return { text: title, style: 'section' };
}

export function subSection(title: string): pdfMake.Content {
  return { text: title, style: 'subSection' };
}

export function rightArrow(): pdfMake.Content {
  return { text: [{ text: '', style: 'symbol', bold: true }] };
}

export function emptyLine(): pdfMake.Content {
  return { text: '', margin: [0, 3, 0, 0] };
}

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

export function arrowIf(): pdfMake.Content {
  return { text: '→ If', bold: true };
}

export function line(): pdfMake.Content {
  return {
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, color: 'gray' }]
  };
}
