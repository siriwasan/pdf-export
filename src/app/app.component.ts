import { Component } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdf-export';

  constructor() {
  }

  exportPDF() {
    const docDefinition = {
      content: [{ text: 'สวัสดีประเทศไทย reat pdf demo ', fontSize: 15 }]
    };
    pdfMake.createPdf(docDefinition).open();
  }
}
