# PdfExport

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

## Install pdfMake

``` node
npm install pdfmake  --save
```

## Import pdfMake and pdfFonts

``` ts
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;
```

## Add Thai fonts

1. go to '(project folder)/node_modules/pdfmake/'
2. create 'examples/fonts' folder
3. copy Roboto and Thai fonts ('src/assets/fonts')
4. open '(project folder)/node_modules/pdfmake/' in terminal, then run 'npm install'
5. run 'gulp buildFonts'. (will see Thai font name in 'pdfmake/build/vfs_fonts.js')
6. add fonts to pdfMake

``` ts
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
```

## Fixed bugs

Declare enum does not create at run time.
<https://lukasbehal.com/2017-05-22-enums-in-declaration-files/>

So, fixed @types/pdfmake/index.d.ts with const enum

- enum PageSize --> const enum PageSize
- enum PageOrientation --> const enum PageOrientation

## Reference

- <https://www.chaichon.com/react/%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C-pdf-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-react-pdfmake-%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%E0%B9%84%E0%B8%97/>
