function showAlert(message, type = 'success', duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    
    // Стили в зависимости от типа
    const styles = {
        success: {
            background: '#4CAF50',
            color: 'white'
        },
        error: {
            background: '#f44336', 
            color: 'white'
        },
        warning: {
            background: '#ff9800',
            color: 'white'
        },
        info: {
            background: '#2196F3',
            color: 'white'
        }
    };
    
    const style = styles[type] || styles.info;
    
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${style.background};
        color: ${style.color};
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        font-family: Arial, sans-serif;
        max-width: 300px;
        word-wrap: break-word;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    // Плавное исчезновение
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, duration);
}

async function addUser() {
    console.log('Функция addUser вызвана');
    
    try {
        const fioElement = document.getElementById('fio');
        const jobTitleElement = document.getElementById('job_title');
        const passElement = document.getElementById('pass');
        const laboratoryElement = document.getElementById('laboratory');
        const departmentElement = document.getElementById('department');
        const managementElement = document.getElementById('management');
        
        if (!fioElement) {
            throw new Error('Элемент с id="fio" не найден');
        }
        if (!jobTitleElement) {
            throw new Error('Элемент с id="job_title" не найден');
        }
        if (!passElement) {
            throw new Error('Элемент с id="pass" не найден');
        }
        if (!laboratoryElement) {
            throw new Error('Элемент с id="laboratory" не найден');
        }
        if (!departmentElement) {
            throw new Error('Элемент с id="department" не найден');
        }
        if (!managementElement) {
            throw new Error('Элемент с id="management" не найден');
        }
        
        const fio = fioElement.value;
        const job_title = jobTitleElement.value;
        const pass = passElement.value;
        const laboratory = laboratoryElement.value;
        const department = departmentElement.value;
        const management = managementElement.value;
        
        console.log('Значения полей:', { fio, job_title, pass, laboratory, department, management });
        
        if (!fio.trim()) {
            showAlert('Пожалуйста, введите ФИО!', 4000);
            return;
        }
        if (!job_title.trim()) {
            showAlert('Пожалуйста, введите должность!', 4000);
            return;
        }
        if (!pass.trim()) {
            showAlert('Пожалуйста, введите пароль!', 4000);
            return;
        }
        if (!laboratory.trim()) {
            showAlert('Пожалуйста, введите лабораторию!', 4000);
            return;
        }
        if (!department.trim()) {
            showAlert('Пожалуйста, введите отдел!', 4000);
            return;
        }
        if (!management.trim()) {
            showAlert('Пожалуйста, введите управление!', 4000);
            return;
        }
        
        console.log('Отправка данных на сервер...');
        
        const response = await fetch('http://localhost:5000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fio: fio,
                job_title: job_title,
                pass: pass,
                laboratory: laboratory,
                department: department,
                management: management
            })
        });
        
        console.log('Статус ответа:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Успех:', result);
            showAlert('Пользователь успешно добавлен!', 4000);
            
            // Очищаем форму
            if (document.getElementById('addUserForm')) {
                document.getElementById('addUserForm').reset();
            }
        } else {
            const errorText = await response.text();
            console.error('Ошибка сервера:', response.status, errorText);
            showAlert('Ошибка сервера: ' + response.status);
        }
        
    } catch (error) {
        console.error('Критическая ошибка:', error);
        console.error('Стек ошибки:', error.stack);
        showAlert('Ошибка: ' + error.message, 3000);
    }
}

async function deleteUser() {
    try {
        const fioInput = document.getElementById('fio');
        
        if (!fioInput) {
            showAlert('Ошибка: поле для ввода ФИО не найдено', 3000);
            return;
        }
        
        const userFio = fioInput.value.trim();
        
        if (!userFio) {
            showAlert('Пожалуйста, введите ФИО пользователя для удаления', 3000);
            return;
        }
        
        if (!confirm(`Вы уверены, что хотите удалить пользователя:\n${userFio}?`)) {
            return;
        }
        
        const response = await fetch('http://localhost:5000/api/user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fio: userFio
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert(`Пользователь "${userFio}" успешно удален!`, 3000);
            document.getElementById('deleteUserForm').reset();
        } else {
            const errorData = await response.json();
            showAlert('Ошибка при удалении: ' + (errorData.error || 'Unknown error'), 3000);
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
        showAlert('Сетевая ошибка: ' + error.message, 3000);
    }
}

async function auth() {
    try {
        const logInput = document.getElementById("login");
        const passInput = document.getElementById("pas");

        const userLog = logInput.value.trim();
        const userPass = passInput.value.trim();

        if (!userLog || !userPass) {
            showAlert('Пожалуйста, заполните все поля', 4000);
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fio: userLog,    
                pass: userPass   
            })
        });

        const data = await response.json();

        // console.log('Ответ от сервера:', data);
        // console.log('Данные пользователя:', data.authUser);
        // console.log('Поле laboratory:', data.authUser?.laboratory);

        if (data.success) {
            console.log('Авторизация успешна:', userLog);
            showAlert('Добро пожаловать!', 4000);
            
            localStorage.setItem('currentUser', JSON.stringify(userLog));
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('laboratory', data.authUser.laboratory);
            localStorage.setItem('department', data.authUser.department);
            localStorage.setItem('management', data.authUser.management);
            localStorage.setItem('job_title', data.authUser.job_title);
            
            goToMainPanelButton();
            
        } else {
            showAlert('Ошибка авторизации: ' + (data.error || 'Неверные данные'), 3000);
        }

    } catch (error) {
        console.error('Ошибка авторизации:', error);
        showAlert('Сетевая ошибка при авторизации', 3000);
    }
}

async function changePas() {
    try {
        const userFio = document.getElementById('input_fio').value.trim();
        const newPassword = document.getElementById('new_password').value;
        
        console.log('📝 Данные для отправки:', { userFio, newPassword });
        
        if (!userFio || !newPassword) {
            showAlert('Заполните все поля', 3000);
            return;
        }
        
        if (!confirm(`Изменить пароль для сотрудника:\n${userFio}\n\nНовый пароль: ${newPassword}`)) {
            return;
        }
        
        const response = await fetch('http://localhost:5000/api/user/password', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ fio: userFio, newPassword: newPassword })
        });
        
        const result = await response.json();
        console.log('📨 Ответ от сервера:', result);
        
        if (result.success) {
            // Проверяем авторизацию с новым паролем
            const authResponse = await fetch('http://localhost:5000/api/auth', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ fio: userFio, pass: newPassword })
            });
            
            const authResult = await authResponse.json();
            
            if (authResult.success) {
                showAlert(`✅ Пароль успешно изменен и работает!\n\nСотрудник: ${userFio}\nНовый пароль: ${newPassword}\n\nТестовый вход выполнен успешно!`, 3000);
            } else {
                showAlert(`⚠️ Пароль изменен, но авторизация не работает!\n\nСотрудник: ${userFio}\nПароль: ${newPassword}\n\nОшибка авторизации: ${authResult.error}`, 3000);
            }
            
            document.getElementById('changePasswordForm').reset();
        } else {
            alert('❌ Ошибка: ' + result.error);
        }
    } catch (error) {
        console.error('💥 Сетевая ошибка:', error);
        showAlert('💥 Сетевая ошибка: ' + error.message, 3000);
    }
}

async function addWorks() {
    const userContent = document.getElementById('work_name').value;
    const userSubcontent = document.getElementById('details').value;
    const currentUser = document.getElementById('fio_input').value;

    if (!userContent || !userSubcontent) {
        showAlert('Пожалуйста, заполните все поля', 4000);
        return;
    }

    const response = await fetch('http://localhost:5000/api/works', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: userContent,    
            subcontent: userSubcontent,
            user_fio: currentUser    
        })
    });

    const data = await response.json();

    if (data.success) {
        console.log('Работа добавлена');
        showAlert('Работа добавлен', 4000);
        
    } else {
        showAlert('Ошибка авторизации: ' + (data.error || 'Неверные данные'), 3000);
    }
}

async function inputWorkerFio() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('fio_input').value = currentUser;
}

async function loadContentToSelect(selectId, includeEmptyOption = true) {
    const selectElement = document.getElementById(selectId);

    const response = await fetch('http://localhost:5000/api/works/select_content');

    

    const result = await response.json();

    if (result.success) {
        selectElement.innerHTML = '';
        
        if (includeEmptyOption) {
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Выберите название работы';
            emptyOption.disabled = true;
            emptyOption.selected = true;
            selectElement.appendChild(emptyOption);
        }
        result.contents.forEach(work => {
            const option = document.createElement('option');
            option.value = work.content; // значение = content
            option.textContent = work.content; // текст = content
            option.setAttribute('data-id', work.id); // сохраняем ID работы
            selectElement.appendChild(option);
        });
    }
}

async function loadSubcontentToSelect(selectId, includeEmptyOption = true) {
    const selectElement = document.getElementById(selectId);

    const response = await fetch('http://localhost:5000/api/works/select_subcontent');

    const result = await response.json();

    if (result.success) {
        selectElement.innerHTML = '';
        
        if (includeEmptyOption) {
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Выберите подробности о работе';
            emptyOption.disabled = true;
            emptyOption.selected = true;
            selectElement.appendChild(emptyOption);
        }
        result.subcontents.forEach(work => {
            const option = document.createElement('option');
            option.value = work.subcontent; // значение = content
            option.textContent = work.subcontent; // текст = content
            option.setAttribute('data-id', work.id); // сохраняем ID работы
            selectElement.appendChild(option);
        });
    }
}

async function deleteWork() {
    let inputContent = document.getElementById('content_select').value;
    let inputSubcontent = document.getElementById('subcontent_select').value;

    if (!inputContent && !inputContent) {
        showAlert('Выберете требуемую работу и/или подробности о ней', 3000);
        return;
    }

    if (inputContent && !inputSubcontent) {
        inputSubcontent = 'nothing';
        const response = await fetch('http://localhost:5000/api/works/delete_works', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: inputContent,
                subcontent: inputSubcontent
            })
        });

        if (response.ok) {
            const result = await response.json();
            showAlert(`Работа "${inputContent}" и подробности о ней успешно удалены!`, 3000);
            document.getElementById('content_select').reset();
        } else {
            const errorData = await response.json();
            showAlert('Ошибка при удалении: ' + (errorData.error || 'Unknown error'), 3000);
        }
    }

    if (!inputContent && inputSubcontent) {
        inputContent = 'nothing';
        const response = await fetch('http://localhost:5000/api/works/delete_works', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: inputContent,
                subcontent: inputSubcontent
            })
        });

        if (response.ok) {
            const result = await response.json();
            showAlert(`Работа "${inputContent}" и подробности о ней успешно удалены!`, 3000);
            document.getElementById('content_select').reset();
        } else {
            const errorData = await response.json();
            showAlert('Ошибка при удалении: ' + (errorData.error || 'Unknown error'), 3000);
        }
    }

    if (inputContent && inputSubcontent) {
        const response = await fetch('http://localhost:5000/api/works/delete_works', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: inputContent,
                subcontent: inputSubcontent
            })
        });

        if (response.ok) {
            const result = await response.json();
            showAlert(`Работа "${inputContent}" и подробности о ней успешно удалены!`, 3000);
            document.getElementById('content_select').reset();
        } else {
            const errorData = await response.json();
            showAlert('Ошибка при удалении: ' + (errorData.error || 'Unknown error'), 3000);
        }
    }
}

let worksMas = [];
async function addWorkToPDF() {

    const inputContent = document.getElementById('content_select').value;
    const inputSubcontent = document.getElementById('subcontent_select').value;
    const startTime = document.getElementById('time_select_start').value;
    const endTime = document.getElementById('time_select_end').value;

    worksMas = JSON.parse(localStorage.getItem('wokrsMas') || '[]');

    if (!inputContent) {
        showAlert('Работа не выбрана', 3000);
        return;
    }

    if (!inputSubcontent) {
        showAlert('Подробности о работе не найдены', 3000);
        return;
    }

    if (!startTime) {
        showAlert('Начальное времы не задано', 3000);
        return;
    }

    if (!endTime) {
        showAlert('Конечное время не задано', 3000);
        return;
    }

    if (startTime > endTime) {
        showAlert('Начальное время не может быть больше конечного. Попробуйте снова.');
        document.getElementById('time_select_start').value = '';
        document.getElementById('time_select_end').value = '';
        return;
    }

    const response = await fetch('http://localhost:5000/api/works/enter_works_select', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: inputContent,    
            subcontent: inputSubcontent,
            start_time: startTime,
            end_time: endTime   
        })
    });

    worksMas.push({
        content: inputContent,
        subcontent: inputSubcontent,
        start_time: startTime,
        end_time: endTime
    });

    let works = JSON.parse(localStorage.getItem('worksMas') || '[]');
    localStorage.setItem('wokrsMas', JSON.stringify(worksMas));

    document.getElementById('content_select').value = '';
    document.getElementById('subcontent_select').value = '';
    document.getElementById('time_select_start').value = '';
    document.getElementById('time_select_end').value = '';
    // showAlert('Работа успешно добавлена', 2000);
    const result = await response.json();

    try {
        window.location.href = "calendarPDF.html"
        console.log("Calendar page is open")
    } catch (error) {
        console.error('Cant open calendar page', error)
    }
}

function allDatesForWorksMas() {
    let datesForWorks = JSON.parse(localStorage.getItem('allDatesForWorks'));
    let temp = JSON.parse(localStorage.getItem('calendarSelectedDays'));
    datesForWorks.push(temp);
    localStorage.setItem('allDatesForWorks', JSON.stringify(datesForWorks));
}

function fillWorksTable() {
    const worksMasJSON = localStorage.getItem('wokrsMas');
    const worksMas = worksMasJSON ? JSON.parse(worksMasJSON) : [];
    
    const table = document.getElementById('worksTable');
    if (!table) {
        console.error('Таблица с id="worksTable" не найдена');
        return;
    }
    
    const tbody = table.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = '';
    } else {
        const newTbody = document.createElement('tbody');
        table.appendChild(newTbody);
    }
    
    const count = worksMas.length;
    console.log(`Количество объектов в массиве: ${count}`);
    
    worksMas.forEach(work => {
        const row = document.createElement('tr');
        
        const workCell = document.createElement('td');
        workCell.textContent = work.work || work.name || ''; // разные возможные названия свойства
        row.appendChild(workCell);
        
        // Столбец "подробности"
        const detailsCell = document.createElement('td');
        detailsCell.textContent = work.details || work.description || '';
        row.appendChild(detailsCell);
        
        // Столбец "начальное время"
        const startTimeCell = document.createElement('td');
        startTimeCell.textContent = work.startTime || work.start || '';
        row.appendChild(startTimeCell);
        
        // Столбец "конечное время"
        const endTimeCell = document.createElement('td');
        endTimeCell.textContent = work.endTime || work.end || '';
        row.appendChild(endTimeCell);
        
        table.querySelector('tbody').appendChild(row);
    });
    
    // Если массив пуст, добавляем сообщение
    if (count === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'Нет данных для отображения';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        table.querySelector('tbody').appendChild(row);
    }
}

// Пример использования:
// fillWorksTable();
function getWeeksRange(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const weeks = [];
    let currentDate = new Date(firstDay);
    
    while (currentDate <= lastDay) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + (6 - currentDate.getDay()));
        
        // Корректируем конец недели если выходит за месяц
        const actualEnd = weekEnd > lastDay ? lastDay : weekEnd;
        
        weeks.push({
            weekNumber: weeks.length + 1,
            startDate: new Date(weekStart),
            endDate: new Date(actualEnd),
            daysInWeek: Math.floor((actualEnd - weekStart) / (1000 * 60 * 60 * 24)) + 1
        });
        
        // Следующая неделя начинается со следующего дня после воскресенья
        currentDate = new Date(actualEnd);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return weeks;
}

async function randomPas() {
    const SYMBOLS_COUNT = 6;
    let allSymbolsStr = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    let allSymbolsMas = allSymbolsStr.split('');
    let endStr = '';
    let endMas = [];
    for (let i = 0; i < SYMBOLS_COUNT; i++) {
        let tempNumber = Math.floor(Math.random() * (allSymbolsMas.length - 1));
        endMas.push(allSymbolsMas[tempNumber]);
        allSymbolsMas.splice(tempNumber, 1);
    }
    endStr = endMas.join('');
    document.getElementById('new_password').value = endStr;
}
