(function IIFE() {
  // ==========================================================================================================
  // формируем заголовок календаря
  // ==========================================================================================================
  function createCalendarTitle(dateValue) {
    const optionsOfDate = {
      year: 'numeric',
      month: 'long'
    };

    const date = dateValue.toLocaleString('ru', optionsOfDate);
    nodeMonthYear.innerText = date.replace(' г.', '');
  }

  // ==========================================================================================================
  // формируем таблицу дней
  // ==========================================================================================================
  function createCalendarDaysTable(dateValue) {
    // определяем количество дней в переданной дате selectedDate
    const numberOfDaysInMonth = getCountOfDaysInMonth(dateValue);

    // определяем первый день на неделе
    const firstDayOfCurrentMonthInEnWeek = new Date(dateValue.getFullYear(), dateValue.getMonth(), 1).getDay() - 1;
    const firstDayOfCurrentMonthInRuWeek = firstDayOfCurrentMonthInEnWeek < 0 ? 6 : firstDayOfCurrentMonthInEnWeek;

    // заполняем в daysOfMonth дни предыдущего периода
    {
      const tempDate = new Date(dateValue.getFullYear(), dateValue.getMonth() - 1, 1);
      const numberOfPreviousPeriod = getCountOfDaysInMonth(tempDate);

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
  // формируем и отображаем выбранный период
  // ==========================================================================================================
  function setSelectedPeriod(item, dateValue, td) {
    period.push(item);
    period.sort((a, b) => {
      if (a > b) return 1;
      else if (a === b) return 0;

      return -1;
    });

    const node = tbodyNode.getElementsByTagName('td');
    const periodLength = period.length;
    const beginPeriod = period[0];
    const endPeriod = period[periodLength - 1];

    if (periodLength > 1 && item >= beginPeriod || item <= endPeriod) {
      for (let i = 0; i < node.length; i++) {
        if (node.item(i).className !== 'anotherPeriod') {
          const index = node.item(i).innerHTML;

          if (index >= beginPeriod && index <= endPeriod) {
            node.item(i).classList.add('selectedTd');
          }
        }
      }
    }

    td.classList.add('selectedTd');

    startDatePeriod.value = beginPeriod + '/' + (dateValue.getMonth() + 1) + '/' + dateValue.getFullYear();
    endDatePeriod.value = endPeriod + '/' + (dateValue.getMonth() + 1) + '/' + dateValue.getFullYear();
  }

  // ==========================================================================================================
  // заполняем таблицу дней
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
          setSelectedPeriod(item, dateValue, td);
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
  function getCountOfDaysInMonth(dateValue) {
    return 33 - new Date(dateValue.getFullYear(), dateValue.getMonth(), 33).getDate();
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
    const clickedButton = event.target.dataset.clickedButton;

    if (clickedButton === 'left') {
      selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    } else if (clickedButton === 'right') {
      selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    } else if (clickedButton === 'dropdown') {
      selectedDate = new Date(Number(event.target.dataset.year), Number(event.target.dataset.month), 1);
    }

    clearTable();

    createCalendar(selectedDate);
  }

  // ==========================================================================================================
  // Выпадающий список Dropdown
  // ==========================================================================================================
  function showDropdown() {
    const dateValue = selectedDate;
    const listOfMonthsAndYears = [];
    const currentMonthNumber = dateValue.getMonth();
    const currentYearNumber = dateValue.getFullYear();
    const numberOfMonths = 11;

    {
      let monthNumber = currentMonthNumber;
      let yearNumber = currentYearNumber;

      for (let i = 5; i <= numberOfMonths; i++, monthNumber++) {
        if (monthNumber > numberOfMonths) {
          monthNumber = 0;
          yearNumber++;
        }

        listOfMonthsAndYears[i] =
          {
            month: monthNumber,
            year: yearNumber
          };
      }

      monthNumber = currentMonthNumber - 1;
      yearNumber = currentYearNumber;

      for (let i = 4; i >= 0; i--, monthNumber--) {
        if (monthNumber < 0) {
          monthNumber = numberOfMonths;
          yearNumber--;
        }

        listOfMonthsAndYears[i] =
          {
            month: monthNumber,
            year: yearNumber
          };
      }
    }

    const nodeDropdownContent = document.querySelector('.dropdown-content');

    while (nodeDropdownContent.firstChild) {
      nodeDropdownContent.removeChild(nodeDropdownContent.firstChild);
    }

    listOfMonthsAndYears.forEach((item) => {
      const tempDate = new Date();
      tempDate.setMonth(item.month);

      const nodeTagA = document.createElement('a');
      nodeTagA.href = '#';
      nodeTagA.dataset.month = item.month;
      nodeTagA.dataset.year = item.year;
      nodeTagA.innerHTML =
        tempDate.toLocaleString('ru', {month: 'long'})
          .replace(' г.', '')
          .toUpperCase()
        + ' ' + item.year;

      if (item.month === currentMonthNumber && item.year === currentYearNumber) {
        nodeTagA.className = 'dropdownToday';
      } else {
        nodeTagA.dataset.clickedButton = 'dropdown';

        nodeTagA.addEventListener('click', (event) => {
          setNewCalendarPeriod(event);
        })
      }

      nodeDropdownContent.appendChild(nodeTagA);
    });

    nodeDropdownContent.classList.toggle("show");
  }

  // ==========================================================================================================
  // Очистка выбранного периода
  // ==========================================================================================================
  function clearingSelectedPeriod() {
    document
      .querySelectorAll('.selectedTd')
      .forEach(item => item.classList.toggle('selectedTd'));

    period.splice(0);

    startDatePeriod.value = endDatePeriod.value = '';
    startDatePeriod.ariaPlaceholder = endDatePeriod.ariaPlaceholder = 'не выбрано';
  }

  // ==========================================================================================================
  // ОСНОВНОЙ БЛОК
  // ==========================================================================================================
  const period = [];

  // массив для формирования таблицы дней
  const daysOfMonth = Array(42).fill(0);

  // находим заголовок
  const nodeMonthYear = document.querySelector('.monthYear');

  // находим table
  const nodeTable = document.querySelector('table');

  // определяем table tbody
  const tbodyNode = nodeTable.lastElementChild;

  const startDatePeriod = document.querySelector('.startDatePeriod');
  const endDatePeriod = document.querySelector('.endDatePeriod');

  const clearingPeriod = document.querySelector('.clearingPeriod');
  clearingPeriod.addEventListener('click', clearingSelectedPeriod);

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
      //!nodeDropdown.contains(event.target)

      if (!event.target.matches('.dropButton')) {
        const myDropdown = document.querySelector('.dropdown-content');

        if (myDropdown.classList.contains('show')) {
          myDropdown.classList.remove('show');
        }
      }
    }
  }
})()
