(function IIFE() {
  // ==========================================================================================================
  // инициализация начального состояния календаря
  // ==========================================================================================================
  function init(selectedDate) {
    // выделяем из полученный даты месяц и год
    {
      const optionsOfDate = {
        year: 'numeric',
        month: 'long'
      };

      const date = selectedDate.toLocaleString('ru-RU', optionsOfDate);

      // находим ноду для вывода текущего месяца и выводим
      const nodeMonthYear = document.querySelector('.monthYear');
      nodeMonthYear.innerText = date.replace(' г.', '');
    }

    // определяем количество дней в переданной дате - selectedDate
    const numberOfDaysInMonth = getCountOfDaysInMonth.call(selectedDate);

    // определяем первый день в переданной дате - selectedDate
    const firstDayOfCurrentMonthInEnWeek = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() - 1;
    const firstDayOfCurrentMonthInRuWeek = firstDayOfCurrentMonthInEnWeek < 0 ? 6 : firstDayOfCurrentMonthInEnWeek;

    // ==========================================================================================================
    // формируем данные для таблицы дней текущего периода/месяца
    const daysOfMonth = Array(42).fill(0);

    for (let i = firstDayOfCurrentMonthInRuWeek; i - firstDayOfCurrentMonthInRuWeek < numberOfDaysInMonth; i++) {
      daysOfMonth[i] = i - firstDayOfCurrentMonthInRuWeek + 1;
    }

    // заполняем дни следующего периода
    {
      let numberOfNextPeriod = 1;

      // '.' - используем как признак что это число не текущего периода
      for (let i = firstDayOfCurrentMonthInRuWeek + numberOfDaysInMonth; i < daysOfMonth.length; i++) {
        daysOfMonth[i] = numberOfNextPeriod + '.';
        numberOfNextPeriod++;
      }
    }

    // заполняем дни предыдущего периода
    {
      const tempDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
      const numberOfPreviousPeriod = getCountOfDaysInMonth.call(tempDate);

      for (let i = 0; i < firstDayOfCurrentMonthInRuWeek; i++) {
        daysOfMonth[i] = numberOfPreviousPeriod - firstDayOfCurrentMonthInRuWeek + 1 + i + '.';
      }
    }

    const inputTextDateNode = document.querySelector('.inputTextDate');

    // находим ноду тела таблицы
    const tbodyNode = document.querySelector('table tbody');

    // заполняем дни в таблице
    let tr;
    const countOfDaysInWeek = 7;
    const currentDate = new Date();

    daysOfMonth.forEach((item, i) => {
      const step = i + 1;

      // для каждой недели формируем строку
      if (step === 1 || (step % countOfDaysInWeek) - 1 === 0) {
        tr = document.createElement('tr');
        tbodyNode.appendChild(tr);
      }

      // формируем ячейку
      const td = document.createElement('td');

      const strItem = String(item);
      if (strItem.endsWith('.')) {
        td.innerText = strItem.slice(0, strItem.length - 1);
        td.className = 'anotherPeriod';
      } else {
        td.innerText = item;
        td.addEventListener('click', clickedDate.bind(null, inputTextDateNode, selectedDate));

        if (item === currentDate.getDate() && selectedDate.getMonth() === currentDate.getMonth()
          && selectedDate.getFullYear() === currentDate.getFullYear()) {
          td.className = 'today';
        }
      }

      tr.appendChild(td);
    })
  }

  // ==========================================================================================================
  // определение количество дней в месяце
  // ==========================================================================================================
  function getCountOfDaysInMonth() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
  }

  // ==========================================================================================================
  // очистка таблицы дней
  // ==========================================================================================================
  function clearTable() {
    const node = document.querySelector('table');

    // rows[0] это заголовок - оставляем
    while (node.rows[1]) {
      node.deleteRow(1);
    }
  }

  // ==========================================================================================================
  // установка нового периода календаря (предыдущий/следующий)
  // ==========================================================================================================
  function setNewCalendarPeriod(event) {
    if (event.target.className === 'left button') {
      selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    } else if (event.target.className === 'right button') {
      selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    }

    clearTable();

    init(selectedDate);
  }

  // ==========================================================================================================
  // Вывод выбранного (кликнутого) числа
  // ==========================================================================================================
  function clickedDate(node, date) {
    node.value = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    console.log(node);
    console.log(date);
  }

  // ==========================================================================================================
  // ОСНОВНОЙ БЛОК
  // ==========================================================================================================

  // получаем текущую дату
  let selectedDate = new Date();

  // инициализация календаря
  init(selectedDate);

  // вышаем обработчик нажатия предыдущий/следующий период
  const leftButton = document.querySelector('.left');
  leftButton.addEventListener('click', setNewCalendarPeriod);

  const rightButton = document.querySelector('.right');
  rightButton.addEventListener('click', setNewCalendarPeriod);
})()
