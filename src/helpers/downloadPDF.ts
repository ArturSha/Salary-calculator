import jsPDF from 'jspdf';
import { Month, Root, Root2 } from '../pages/archive/archiveTypes';
import { myFont } from './cyrillicFontForPDF';

export const downloadPDF = (data: Root, language: string) => {
  const doc = new jsPDF();

  doc.addFileToVFS('PTSans.ttf', myFont);
  doc.addFont('PTSans.ttf', 'PTSans', 'normal');
  doc.setFont('PTSans');

  data.forEach((element: Root2) => {
    let dynamicHeight = 40;
    doc.setTextColor('#000000');

    let total = element.months.reduce(
      (acc: number, item: Month) => acc + Number(item.salary.slice(0, -1)),
      0
    );
    doc.addPage('a4', 'p');
    doc.text(element.year, 100, 20);
    doc.line(80, 22, 136, 22);
    element.months.forEach((element: Month, i: number) => {
      dynamicHeight += 10;
      doc.text(element.month, 80, i * 10 + 40);
      doc.text(element.salary, 120, i * 10 + 40);
    });
    doc.setTextColor('#3300ff');

    doc.text(
      `${language === 'ru-RU' ? 'Итого:' : 'Total:'}`,
      80,
      dynamicHeight
    );
    doc.text(total.toString(), 120, dynamicHeight);
  });

  doc.deletePage(1);
  doc.save('salary.pdf');
};
