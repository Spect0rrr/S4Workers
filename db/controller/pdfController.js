const db = require('../db');
const puppeteer = require('puppeteer');

class pdfController {

    async generateWorkPlan(req, res) {
        try {
            const { works, laboratory, department, 
                management, calendarMonth, calendarYear, selectedDays, 
                job_title, currentUser, monthWeeks, allDatesForWorks } = req.body;
            
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            
            const calendarMonthLower = calendarMonth.toLowerCase();

            // let firstWeek = [];
            // let secondWeek = [];
            // let thirdWeek = [];
            // let fourthWeek = [];
            // let fifthWeek = [];
            // console.log(selectedDays);

            // for (let i = 0; i <= selectedDays.length; i++) {
            //     if (selectedDays[i] <= 7) {
            //         firstWeek.push(selectedDays[i]);
            //     }
            //     if (selectedDays[i] <= 14) {
            //         secondWeek.push(selectedDays[i]);
            //     }
            //     if (selectedDays[i] <= 21) {
            //         thirdWeek.push(selectedDays[i]);
            //     }
            //     if (selectedDays[i] <= 28) {
            //         fourthWeek.push(selectedDays[i]);
            //     }
            //     if (selectedDays[i] <= 28) {
            //         fifthWeek.push(selectedDays[i]);
            //     }
            // }

            // let firstWeekNumber = firstWeek.length;
            // let secondWeekNumber = secondWeek.length;
            // let thirdWeekNumber = thirdWeek.length;
            // let fourthWeekNumber = fourthWeek.length;
            // let fifthWeekNumber = fifthWeek.length;
            // console.log(firstWeekNumber, secondWeekNumber, thirdWeekNumber, fourthWeekNumber, fifthWeekNumber);

            function shortFIO(str) {
                str = str.slice(1, str.length - 1);
                let resultMas = str.split(" ");
                let result = "";
                console.log(resultMas.length);
                for (let i = 0; i < resultMas.length - 1; i++) {
                    if (resultMas[i] != resultMas.length - 1) {
                        resultMas[i] = resultMas[i].slice(0, 1) + ".";
                        result = result + resultMas[i];
                    }
                }
                if (resultMas[resultMas.length - 1]) {
                    result = result + " " + resultMas[resultMas.length - 1];
                }
                
                return result;
            }

            const weeksCost = monthWeeks.length;

            function updateWeekHeadersOnly(monthWeeksTemp) {
                const weeksData = monthWeeksTemp;
                
                const weeksHTML = weeksData.map(week => 
                    `<th>${week[0]}-${week[1]}</th>`
                ).join('');
                
                const newRowHTML = `
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        ${weeksHTML}
                        <th></th>
                        <th></th>
                    </tr>
                `;
                
                return newRowHTML;
            }

            function selectedDaysForWorks(weeksRange, datesMas) {
                const dates = datesMas;
                const ranges = weeksRange;

                for (let i = 0; i < dates.length - 1; i++) {
                    
                }

                const weeksHTML = weeksData.map(week => 
                    `<th>${week[0]}-${week[1]}</th>`
                ).join('');

                const newRowHTML = `
                    ${weeksHTML}
                `
            }

            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>План работ</title>
                    <style>
                        body { 
                            font-family: "Times New Roman", Times, serif;
                            // font-size: 50px;
                            // line-height: 1.5;
                            margin: 20px; 
                            // font-size: 12px;
                        }
                        .right_up { 
                            text-align: right; 
                            margin-bottom: 30px; 
                            font-size: 14pt;
                        }
                        .main_info { 
                            text-align: center; 
                            font-size: 14pt;
                        }
                        .work_plan_title {
                            font-size: 16pt;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                            font-size: 14pt;
                        }
                        th, td { 
                            border: 1px solid #000; 
                            padding: 3px; 
                            text-align: center; 
                        }
                        th { 
                            background-color: #ffffffff; 
                            font-weight: bold;
                        }
                        .main_info p {
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="right_up">
                        <p>Для служебного пользования</p>
                        <p>(п.п. 383, 403 Перечня сведений ВС)</p>
                        <p>Экземпляр единственный</p>
                        <p>ВРИО начальника ${department} отдела</p>
                        <p>${management} управления</p>
                        <p>${job_title} ${shortFIO(currentUser)}</p>
                        <p>03.06.2004</p>
                    </div>
                    <div class="main_info">
                        <p><strong>ПЛАН РАБОТЫ</strong></p>
                        <p>научного сотрудника ${laboratory} лаборатории ${department} отдела ${management} управления</p>
                        <p>на ${calendarMonthLower} ${calendarYear} года</p>
                        <table>
                            <tr>
                                <th style="width: 5%">
                                    <div>№</div>
                                    <div>п/п</div>
                                </th>
                                <th style="width: 25%">Содержание мероприятия</th>
                                <th style="width: 12%">Время проведения</th>
                                <th colspan="${weeksCost}" style="width: 25/${weeksCost}">${calendarMonth}</th>
                                <th style="width: 15%">Место проведения</th>
                                <th style="width: 15%">Отметка о выполнении</th>
                            </tr>
                            ${updateWeekHeadersOnly(monthWeeks)}
                            ${works && works.length > 0 ? works.map((work, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td style = "text-align: left;">
                                        <div>${work.content || 'Ошибка'}</div>
                                        <div>${work.subcontent || 'Ошибка'}</div>
                                    </td>
                                    <td>${work.start_time || 'Ошибка'} - ${work.end_time || 'Ошибка'}</td>
                                    <td>${firstWeekNumber}</td>
                                    <td>${secondWeekNumber}</td>
                                    <td>${thirdWeekNumber}</td>
                                    <td>${fourthWeekNumber}</td>
                                    <td>${fifthWeekNumber}</td>
                                    ${selectedDaysForWorks(allDatesForWorks)}
                                    <td>${work.place || 'ФГБУ ,,27 ЦНИИ,, Минобороны России'}</td>
                                    <td></td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td>1</td>
                                    <td>Нет данных</td>
                                    <td>-</td>
                                    <td></td><td></td><td></td><td></td><td></td>
                                    <td>-</td>
                                    <td></td>
                                </tr>
                            `}
                        </table>
                    </div>
                </body>
                </html>
            `;
            
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            
            const pdfBuffer = await page.pdf({
                format: 'A4',
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                },
                printBackground: true,
                landscape: true
            });
            
            await browser.close();
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="work_plan.pdf"');
            res.send(pdfBuffer);
            
        } catch (error) {
            console.error('Ошибка генерации PDF:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Ошибка при создании PDF' 
            });
        }
    }
};

module.exports = pdfController;