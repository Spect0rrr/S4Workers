async function printDays() {
    console.log('Функция printDays вызвана'); // ← добавить эту строку
    const days = JSON.parse(localStorage.getItem('calendarSelectedDays')) || [];
    console.log('Дни из localStorage:', days); // ← и эту
    document.getElementById('days').textContent = days.join(' ');
}