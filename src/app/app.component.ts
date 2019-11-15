import { Component } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;

// const or = pdf.PageOrientation;

pdf.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew-Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdf-export';

  constructor() {
    // console.log(or);
  }

  exportPDF() {
    const docDefinition: pdfMake.TDocumentDefinitions = {
      content: [
        { text: 'สวัสดีประเทศไทย reat pdf demo ', fontSize: 15 },
        { ul: ['item 1', 'item 2'], type: 'square' },
        { qr: 'Hello! world' }
      ],
      defaultStyle: {
        font: 'THSarabunNew'
      },
      pageOrientation: pdfMake.PageOrientation.LANDSCAPE,
      pageSize: pdfMake.PageSize.A5
    };
    pdfMake.createPdf(docDefinition).open();
  }
}
