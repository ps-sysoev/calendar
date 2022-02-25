// IIFE
(function () {

  // начальная инициализация календаря
  function init(selectedDate) {
    // количество дней в неделе
    const countOfDaysInWeek = 7;

    // текуая дата
    const currentDate = new Date();

    // выделяем из полученный даты месяц и год
    const optionsOfDate = {
      year: 'numeric',
      month: 'long'
    };

    const date = selectedDate.toLocaleString('ru-RU', optionsOfDate);

    // находим ноду для вывода текущего месяца и выводим
    document.querySelector('.monthYear').innerText = date.replace(' г.', '');

    // определяем количество дней в текущем месяце
    const numberOfDaysInMonth = 33 - new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 33).getDate();

    // формируем дату - первый день текущего месяца
    const firstDayOfCurrentMonthInEnWeek = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() - 1;
    const firstDayOfCurrentMonthInRuWeek = firstDayOfCurrentMonthInEnWeek < 0 ? 6 : firstDayOfCurrentMonthInEnWeek;

    // таблица для формирования дней месяца
    const daysOfMonth = Array(42).fill(0);

    // формируем данные для таблицы дней месяца
    for (let i = firstDayOfCurrentMonthInRuWeek; i - firstDayOfCurrentMonthInRuWeek < numberOfDaysInMonth; i++) {
      daysOfMonth[i] = i - firstDayOfCurrentMonthInRuWeek + 1;
    }

    // считаем количество строк(недель) для формирования таблицы дней
    const intermediateDataForDaysOfMonthTable = firstDayOfCurrentMonthInRuWeek + numberOfDaysInMonth;
    let countOfWeeks = Math.floor(intermediateDataForDaysOfMonthTable / countOfDaysInWeek);

    if (intermediateDataForDaysOfMonthTable % countOfDaysInWeek) {
      countOfWeeks++;
    }

    // "отрезаем" бесполезные ячейки
    daysOfMonth.length = countOfWeeks * countOfDaysInWeek;

    // находим ноду тела таблицы
    const tbodyNode = document.querySelector('table tbody');

    // заполняем дни в таблице
    let tr;
    daysOfMonth.forEach((item, i) => {
      const step = i + 1;

      // для каждой недели формируем строку
      if (step === 1 || (step % countOfDaysInWeek) - 1 === 0) {
        tr = document.createElement('tr');
        tbodyNode.appendChild(tr);
      }

      // формируем ячейку
      const td = document.createElement('td');

      if (item === 0) {
        td.innerText = '';
        td.className = 'empty';
      } else {
        td.innerText = item;

        if (item === currentDate.getDate() && selectedDate.getMonth() === currentDate.getMonth()) {
          td.className = 'today';
        }
      }

      tr.appendChild(td);
    })
  }

  // -------------------------------------------------------------------------

  // очистка таблицы дней
  function clearTable() {
    const node = document.querySelector('table');

    // rows[0] это заголовок - оставляем
    while (node.rows[1]) {
      node.deleteRow(1);
    }
  }

  // получаем текущую дату
  let selectedDate = new Date();

  // инициализация календаря
  init(selectedDate);

  // установка нового периода календаря (предыдущий/следующий)
  function setNewCalendarPeriod(event) {
    if (event.target.className === 'left button') {
      selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    } else if (event.target.className === 'right button') {
      selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    }

    clearTable();

    init(selectedDate);
  }

  const leftButton = document.querySelector('.left');
  leftButton.addEventListener('click', setNewCalendarPeriod);

  const rightButton = document.querySelector('.right');
  rightButton.addEventListener('click', setNewCalendarPeriod);
})()
