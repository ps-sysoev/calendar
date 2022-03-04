(function IIFE() {
  // ==========================================================================================================
  // формируем заголовок календаря
  // ==========================================================================================================
  function createCalendarTitle(dateValue) {
    const optionsOfDate = {
      year: 'numeric',
      month: 'long'
    };

    const date = dateValue.toLocaleString('ru-RU', optionsOfDate);
    nodeMonthYear.innerText = date.replace(' г.', '');
  }

  // ==========================================================================================================
  // формируем таблицу дней
  // ==========================================================================================================
  function createCalendarDaysTable(dateValue) {
    // определяем количество дней в переданной дате selectedDate
    const numberOfDaysInMonth = getCountOfDaysInMonth.call(dateValue);

    // определяем первый день на неделе
    const firstDayOfCurrentMonthInEnWeek = new Date(dateValue.getFullYear(), dateValue.getMonth(), 1).getDay() - 1;
    const firstDayOfCurrentMonthInRuWeek = firstDayOfCurrentMonthInEnWeek < 0 ? 6 : firstDayOfCurrentMonthInEnWeek;

    // заполняем в daysOfMonth дни предыдущего периода
    {
      const tempDate = new Date(dateValue.getFullYear(), dateValue.getMonth() - 1, 1);
      const numberOfPreviousPeriod = getCountOfDaysInMonth.call(tempDate);

      for (let i = 0; i < firstDayOfCurrentMonthInRuWeek; i++) {
        daysOfMonth[i] = numberOfPreviousPeriod - firstDayOfCurrentMonthInRuWeek + 1 + i + '.';
      }
    }

    // заполняем в daysOfMonth дни текущего периода
    for (let i = firstDayOfCurrentMonthInRuWeek; i - firstDayOfCurrentMonthInRuWeek < numberOfDaysInMonth; i++) {
      daysOfMonth[i] = i - firstDayOfCurrentMonthInRuWeek + 1;
    }

    // заполняем в daysOfMonth дни следующего периода
    {
      let numberOfNextPeriod = 1;

      // '.' - используем как признак что это число не текущего периода
      for (let i = firstDayOfCurrentMonthInRuWeek + numberOfDaysInMonth; i < daysOfMonth.length; i++) {
        daysOfMonth[i] = numberOfNextPeriod + '.';
        numberOfNextPeriod++;
      }
    }

  }

  // ==========================================================================================================
  // заполняем дни в таблице
  // ==========================================================================================================
  function fillInCalendarDaysTable(dateValue) {
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
        td.innerText = strItem.replace('.', '');
        td.className = 'anotherPeriod';
      } else {
        td.innerText = item;
        td.addEventListener('click', () => {
          inputTextDateNode.value = item + '/' + (dateValue.getMonth() + 1) + '/' + dateValue.getFullYear();
        });

        if (item === currentDate.getDate() && dateValue.getMonth() === currentDate.getMonth()
          && dateValue.getFullYear() === currentDate.getFullYear()) {
          td.className = 'today';
        }
      }

      tr.appendChild(td);
    })
  }

  // ==========================================================================================================
  // инициализация начального состояния календаря
  // ==========================================================================================================
  function createCalendar(dateValue) {
    createCalendarTitle(dateValue);

    createCalendarDaysTable(dateValue);

    fillInCalendarDaysTable(dateValue);
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
    // rows[0] это заголовок - оставляем
    while (nodeTable.rows[1]) {
      nodeTable.deleteRow(1);
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

    createCalendar(selectedDate);
  }

  // ==========================================================================================================
  // Выпадающий список Dropdown
  // ==========================================================================================================
  function showDropdown() {
    document.querySelector('.dropdown-content').classList.toggle("show");
  }

  // ==========================================================================================================
  // ОСНОВНОЙ БЛОК
  // ==========================================================================================================

  // массив для формирования таблицы дней
  const daysOfMonth = Array(42).fill(0);

  // находим заголовок
  const nodeMonthYear = document.querySelector('.monthYear');

  // находим table
  const nodeTable = document.querySelector('table');

  console.log(nodeTable.parentElement)

  // определяем table tbody
  const tbodyNode = nodeTable.lastElementChild;

  // находим input
  const inputTextDateNode = document.querySelector('.inputTextDate');

  // получаем текущую дату
  let selectedDate = new Date();

  // инициализация календаря
  createCalendar(selectedDate);

  // вешаем обработчик нажатия предыдущий/следующий период
  {
    const leftButton = document.querySelector('.left');
    leftButton.addEventListener('click', setNewCalendarPeriod);

    const rightButton = document.querySelector('.right');
    rightButton.addEventListener('click', setNewCalendarPeriod);
  }

  // меню dropdown
  {
    const nodeDropdown = document.querySelector('.dropdown');
    nodeDropdown.addEventListener('click', showDropdown);

    // закрыть раскрывающийся список, если пользователь кликнет за его пределами
    window.onclick = function (event) {
      if (!event.target.matches('.dropButton')) {
        const myDropdown = document.querySelector('.dropdown-content');

        if (myDropdown.classList.contains('show')) {
          myDropdown.classList.remove('show');
        }
      }
    }
  }
})()
