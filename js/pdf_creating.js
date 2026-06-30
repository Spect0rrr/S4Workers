import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function createPDFFromHTML(data = {}) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    let cssContent = '';
    try {
        const cssPath = path.resolve('./public/pages_css/htmlToPDF.css');
        cssContent = fs.readFileSync(cssPath, 'utf8');
    } catch (error) {
        console.log('CSS файл не найден, используем базовые стили');
        cssContent = `
            body { font-family: Arial, sans-serif; margin: 20px; }
            .right_up { text-align: right; margin-bottom: 30px; }
            .main_info { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
        `;
    }

    console.log('Начало создания PDF...');
    
    let work = JSON.parse(localStorage.getItem('worksMas') || '[]');
    console.log('Загружено записей:', storage.length);
    
    const tableRows = data.works && data.works.length > 0 
        ? data.works.map((work, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${work.content || 'Ошибка'}${work.subcontent || 'Ошибка'}</td>
                <td>${work.start_time || 'Ошибка'} - ${work.end_time || 'Ошибка'}</td>
                <td></td><td></td><td></td><td></td><td></td>
                <td>${work.place || 'chto'}</td>
                <td></td>
            </tr>
        `).join('')
        : `
            <tr>
                <td>1</td>
                <td>Пример работы</td>
                <td>09:00-18:00</td>
                <td></td><td></td><td></td><td></td><td></td>
                <td>Офис</td>
                <td></td>
            </tr>
        `;

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>План работ</title>
            <style>${cssContent}</style>
        </head>
        <body>
            <div class="right_up">
                <p>Для служебного пользования</p>
                <p>(п.п. vvv, vvv Перечня сведений ВС)</p>
                <p>Экземпляр единственный</p>
                <p>vvvv начальника vv отдела</p>
                <p>v управления (vvvvvvvvvvv)</p>
                <p>vvvv V.Vvvvvvvv</p>
                <p>03.06.2004</p>
            </div>
            <div class="main_info">
                <p><strong>ПЛАН РАБОТЫ</strong></p>
                <p>научного сотрудника vvvv лаборатории vvv отдела vvvv управления</p>
                <p>на октябрь 2024 года</p>
                <table class="table">
                    <tr>
                        <th rowspan="2">№ п/п</th>
                        <th rowspan="2">Содержание мероприятия</th>
                        <th rowspan="2">Время проведения</th>
                        <th colspan="5">Месяц</th>
                        <th rowspan="2">Место проведения</th>
                        <th rowspan="2">Отметка о выполнении</th>
                    </tr>
                    <tr>
                        <th>1-7</th>
                        <th>8-14</th>
                        <th>15-21</th>
                        <th>22-28</th>
                        <th>29-31</th>
                    </tr>
                    ${tableRows}
                </table>
            </div>
        </body>
        </html>
    `;
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({ 
        path: 'report.pdf',
        format: 'A4',
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });
    
    await browser.close();
    console.log('PDF успешно создан: report.pdf');
}