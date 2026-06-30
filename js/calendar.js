document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const calendar = document.getElementById('calendar');
    const hiddenDaysInput = document.getElementById('selected_days');
    const clearButton = document.getElementById("clearSession");

    if (!monthSelect || !yearSelect || !calendar || !hiddenDaysInput) {
        console.error("Ошибка: один из элементов не найден!");
        return;
    }

    const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // const temp = today.getFullYear();

    for (let i = 2000; i <= 2030; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    const today = new Date();
    monthSelect.value = today.getMonth();
    yearSelect.value = today.getFullYear();

    monthSelect.addEventListener('change', updateCalendar);
    yearSelect.addEventListener('change', updateCalendar);

    function updateCalendar() {
        calendar.innerHTML = '';

        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let weekNumber = getWeekNumber(new Date(year, month, 1));

        const weekNumberColumn = document.createElement('div');
        weekNumberColumn.className = 'week-number-column';
        calendar.appendChild(weekNumberColumn);

        daysOfWeek.forEach(day => {
            const dayOfWeekElement = document.createElement('div');
            dayOfWeekElement.className = 'day-of-week';
            dayOfWeekElement.textContent = day;
            calendar.appendChild(dayOfWeekElement);
        });

        let rowDays = [];

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            rowDays.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            rowDays.push(day);
            if (rowDays.length === 7 || day === daysInMonth) {
                addWeekRow(rowDays, weekNumber);
                rowDays = [];
                weekNumber++;
            }
        }

        loadSelectedDaysFromLocalStorage();
        const calendarMas = months[monthSelect.value];
        localStorage.setItem('calendarMonth', calendarMas);
        localStorage.setItem('calendarYear', yearSelect.value);
        const enteredMonth = localStorage.getItem('calendarMonth');
        const yearNumber = localStorage.getItem('calendarYear');
        let monthNumber = 0;

        const monthsForMas = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        for (let i = 0; i < monthsForMas.length; i++) {
            if (enteredMonth === monthsForMas[i]) {
                monthNumber = i + 1; 
                console.log('Найден месяц:', enteredMonth, 'номер:', monthNumber);
                break; 
            }
        }

        if (monthNumber !== 0 && yearNumber) {
            getWeeksRange(monthNumber, parseInt(yearNumber));
        } else {
            console.error('Месяц или год не найдены');
            console.log('enteredMonth:', enteredMonth, 'yearNumber:', yearNumber);
        }
        getWeeksRange(monthNumber, yearNumber);
    }

    function addWeekRow(days, weekNumber) {
        const weekNumberElement = document.createElement('div');
        weekNumberElement.className = 'week-number';
        weekNumberElement.textContent = weekNumber;
        weekNumberElement.addEventListener('click', function () {
            toggleWeekSelection(weekNumber);
        });
        calendar.appendChild(weekNumberElement);

        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            if (day !== null) {
                dayElement.textContent = day;
                const date = new Date(parseInt(yearSelect.value), parseInt(monthSelect.value), day);
                if (date.getDay() === 0 || date.getDay() === 6) {
                    dayElement.classList.add('weekend');
                }
                dayElement.addEventListener('click', function () {
                    dayElement.classList.toggle('selected');
                    updateSelectedDays();
                });
            } else {
                dayElement.classList.add('empty');
            }
            calendar.appendChild(dayElement);
        });
    }

    function toggleWeekSelection(weekNumber) {
        const daysInWeek = document.querySelectorAll('.day');
        let startIndex = (weekNumber - getWeekNumber(new Date(yearSelect.value, monthSelect.value, 1))) * 7;
        let endIndex = startIndex + 7;

        for (let i = startIndex; i < endIndex; i++) {
            if (daysInWeek[i] && !daysInWeek[i].classList.contains('empty') && !daysInWeek[i].classList.contains('weekend')) {
                daysInWeek[i].classList.toggle('selected');
            }
        }
        updateSelectedDays();
    }

    function updateSelectedDays() {
        const selectedDays = Array.from(document.querySelectorAll('.day.selected')).map(day => day.textContent);
        
        hiddenDaysInput.value = JSON.stringify(selectedDays);
        
        saveSelectedDaysToLocalStorage(selectedDays);
    }

    function saveSelectedDaysToLocalStorage(selectedDays) {
        try {
            localStorage.setItem('calendarSelectedDays', JSON.stringify(selectedDays));
            console.log('Дни сохранены в Local Storage:', selectedDays);
        } catch (error) {
            console.error('Ошибка при сохранении в Local Storage:', error);
        }
    }

    function loadSelectedDaysFromLocalStorage() {
        try {
            const storedData = localStorage.getItem('calendarSelectedDays');
            if (storedData) {
                const selectedDays = JSON.parse(storedData);
                console.log('Дни загружены из Local Storage:', selectedDays);
                
                const allDays = document.querySelectorAll('.day');
                allDays.forEach(dayElement => {
                    const dayText = dayElement.textContent.trim();
                    if (selectedDays.includes(dayText)) {
                        dayElement.classList.add('selected');
                    }
                });
                
                hiddenDaysInput.value = JSON.stringify(selectedDays);
            }
        } catch (error) {
            console.error('Ошибка при загрузке из Local Storage:', error);
        }
    }

    function getWeekNumber(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = date - start;
        return Math.ceil((diff / (1000 * 60 * 60 * 24) + start.getDay() + 1) / 7);
    }

    if (clearButton) {
        clearButton.addEventListener("click", function (event) {
            event.preventDefault();
            
            document.querySelectorAll(".day.selected").forEach(day => {
                day.classList.remove("selected");
            });
            
            document.getElementById("selected_days").value = "";
            
            localStorage.removeItem('calendarSelectedDays');
            console.log('Дни очищены из Local Storage');
        });
    }

    loadSelectedDaysFromLocalStorage();
    updateCalendar();
    function getWeeksRange(month, year) {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        
        const weeks = [];
        let currentDate = new Date(firstDay);
        
        let weekStart = new Date(currentDate);
        const dayOfWeek = currentDate.getDay();
        const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        weekStart.setDate(diff);
        
        while (weekStart <= lastDay) {
            let weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            let startDay = weekStart.getMonth() === month - 1 ? weekStart.getDate() : 1;
            let endDay = weekEnd.getMonth() === month - 1 ? weekEnd.getDate() : lastDay.getDate();
            
            const endDate = new Date(year, month - 1, endDay);
            if (endDate.getDay() === 6) {
                endDay = endDay - 1;
            } else if (endDate.getDay() === 0) { 
                endDay = endDay - 2; 
            }
            
            const startDate = new Date(year, month - 1, startDay);
            if (startDate.getDay() === 6) { 
                startDay = startDay + 2; 
            } else if (startDate.getDay() === 0) { 
                startDay = startDay + 1; 
            }
            
            if ((weekStart.getMonth() === month - 1 || weekEnd.getMonth() === month - 1) && startDay <= endDay) {
                weeks.push([startDay, endDay]);
            }
            
            weekStart.setDate(weekStart.getDate() + 7);
        }
        
        localStorage.setItem('monthWeeks', JSON.stringify(weeks));
        console.log(weeks);
        
        return weeks;
    }
});