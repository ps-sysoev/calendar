(function IIFE() {
  const nodeBody = document.querySelector('body');

  setTimeout(() => {
    nodeBody.classList.add('changeOpacity');
  }, 500);

  // получаем текущую дату
  let selectedDate = new Date();

  const period = [];

  // массив для формирования таблицы дней
  const daysOfMonth = Array(42)
    .fill(0);

  // находим заголовок
  const nodeMonthYear = document.querySelector('.monthYear');

  // находим table
  const nodeTable = document.querySelector('table');

  // определяем table tbody
  const tbodyNode = nodeTable.lastElementChild;

  const startDatePeriod = document.querySelector('.startDatePeriod');
  const endDatePeriod = document.querySelector('.endDatePeriod');

  /**
   * формируем заголовок календаря
   * @param{Date} dateValue
   */
  function createCalendarTitle(dateValue) {
    nodeMonthYear.innerText = dateValue
      .toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
      })
      .replace(' г.', '');
  }

  // ===============================================================================================
  // определение количество дней в месяце
  // ===============================================================================================
  function getCountOfDaysInMonth(dateValue) {
    return 33 - new Date(dateValue.getFullYear(), dateValue.getMonth(), 33).getDate();
  }

  // ===============================================================================================
  // формируем таблицу дней
  // ===============================================================================================
  function createCalendarDaysTable(dateValue) {
    // определяем количество дней в переданной дате selectedDate
    const numberOfDaysInMonth = getCountOfDaysInMonth(dateValue);

    // определяем первый день на неделе
    const firstDayOfCurrentMonthInEnWeek = new
    Date(dateValue.getFullYear(), dateValue.getMonth(), 1).getDay() - 1;

    const firstDayOfCurrentMonthInRuWeek = firstDayOfCurrentMonthInEnWeek < 0
      ? 6 : firstDayOfCurrentMonthInEnWeek;

    // заполняем в daysOfMonth дни предыдущего периода
    {
      const tempDate = new Date(dateValue.getFullYear(), dateValue.getMonth() - 1, 1);
      const numberOfPreviousPeriod = getCountOfDaysInMonth(tempDate);

      for (let i = 0; i < firstDayOfCurrentMonthInRuWeek; i += 1) {
        daysOfMonth[i] = `${numberOfPreviousPeriod - firstDayOfCurrentMonthInRuWeek + 1 + i}.`;
      }
    }

    // заполняем в daysOfMonth дни текущего периода
    for (let i = firstDayOfCurrentMonthInRuWeek;
      i - firstDayOfCurrentMonthInRuWeek < numberOfDaysInMonth; i += 1) {
      daysOfMonth[i] = i - firstDayOfCurrentMonthInRuWeek + 1;
    }

    // заполняем в daysOfMonth дни следующего периода
    {
      let numberOfNextPeriod = 1;

      // '.' - используем как признак что это число не текущего периода
      for (let i = firstDayOfCurrentMonthInRuWeek + numberOfDaysInMonth;
        i < daysOfMonth.length; i += 1) {
        daysOfMonth[i] = `${numberOfNextPeriod}.`;
        numberOfNextPeriod += 1;
      }
    }
  }

  // ===============================================================================================
  // заполняем выбранный период
  // ===============================================================================================
  function fillSelectedPeriod(periodData) {
    const node = tbodyNode.getElementsByTagName('td');
    const beginPeriod = periodData[0];
    const endPeriod = periodData[periodData.length - 1];

    startDatePeriod.value = beginPeriod;
    endDatePeriod.value = endPeriod;

    for (let i = 0; i < node.length; i += 1) {
      if (node.item(i).className !== 'anotherPeriod') {
        const itemDate = node.item(i).innerHTML;
        const startValueOfPeriod = Number(beginPeriod.slice(0, 2));
        const endValueOfPeriod = Number(endPeriod.slice(0, 2));

        if (itemDate >= startValueOfPeriod && itemDate <= endValueOfPeriod) {
          node.item(i)
            .classList
            .add('selectedTd');
        }
      }
    }
  }

  // ===============================================================================================
  // формируем и отображаем выбранный период
  // ===============================================================================================
  function setSelectedPeriod(item, dateValue) {
    const periodItem = new Date(dateValue.getFullYear(), dateValue.getMonth(), item);
    const periodItemToString = periodItem.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (!period.includes(periodItemToString)) {
      if (period.length && periodItemToString.slice(3, 5) !== period[0].slice(3, 5)) {
        return;
      }

      period.push(periodItemToString);
      period.sort((a, b) => {
        if (a > b) return 1;
        if (a === b) return 0;

        return -1;
      });

      // если есть 1 и более элементов - это уже период:
      if (period.length) {
        fillSelectedPeriod(period);
      }
    }
  }

  // ===============================================================================================
  // заполняем таблицу дней
  // ===============================================================================================
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
          setSelectedPeriod(item, dateValue);
        });

        if (
          item === currentDate.getDate()
          && dateValue.getMonth() === currentDate.getMonth()
          && dateValue.getFullYear() === currentDate.getFullYear()
        ) {
          td.className = 'today';
        }
      }

      tr.appendChild(td);
    });
  }

  // ===============================================================================================
  // инициализация начального состояния календаря
  // ===============================================================================================
  function createCalendar(dateValue, isPeriod) {
    createCalendarTitle(dateValue);

    createCalendarDaysTable(dateValue);

    fillInCalendarDaysTable(dateValue);

    if (isPeriod) {
      fillSelectedPeriod(period);
    }
  }

  // ===============================================================================================
  // очистка таблицы дней
  // ===============================================================================================
  function clearTable() {
    // rows[0] это заголовок - оставляем
    while (nodeTable.rows[1]) {
      nodeTable.deleteRow(1);
    }
  }

  // ===============================================================================================
  // проверка выбранного периода для отрисовки
  // ===============================================================================================
  function checkingPeriod(dateValue, periodData) {
    if (!periodData.length) {
      return false;
    }

    const month = Number(periodData[0].slice(3, 5));
    const year = Number(periodData[0].slice(6));

    return month === selectedDate.getMonth() + 1 && year === selectedDate.getFullYear();
  }

  // ===============================================================================================
  // установка нового периода календаря (предыдущий/следующий)
  // ===============================================================================================
  function setNewCalendarPeriod(event) {
    const { buttonType } = event.target.dataset;

    switch (buttonType) {
      case 'left':
        selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
        break;
      case 'right':
        selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
        break;
      case 'dropdown':
        // eslint-disable-next-line no-case-declarations
        const itemDropdown = event.target.dataset;
        selectedDate = new Date(Number(itemDropdown.year), Number(itemDropdown.month), 1);
        break;
      default:
        selectedDate = new Date();
        break;
    }

    const isPeriod = checkingPeriod(selectedDate, period);

    clearTable();

    createCalendar(selectedDate, isPeriod);
  }

  // ===============================================================================================
  // Выпадающий список Dropdown
  // ===============================================================================================
  function showDropdown() {
    const dateValue = selectedDate;
    const currentMonthNumber = dateValue.getMonth();
    const currentYearNumber = dateValue.getFullYear();

    const tempListOfMonthsAndYears = Array(13)
      .fill(dateValue);

    const listOfMonthsAndYears = tempListOfMonthsAndYears.map((item, i) => {
      const month = item.getMonth();
      const newDate = new Date(item);

      newDate.setMonth(i + month + 6);

      return {
        month: newDate.getMonth(),
        year: newDate.getFullYear() - 1,
      };
    });

    const nodeDropdownContent = document.querySelector('.dropdown-content');

    while (nodeDropdownContent.firstChild) {
      nodeDropdownContent.removeChild(nodeDropdownContent.firstChild);
    }

    listOfMonthsAndYears.forEach((item) => {
      const tempDate = new Date();
      tempDate.setMonth(item.month);

      const nodeTagA = document.createElement('a');
      nodeTagA.href = '#';
      nodeTagA.dataset.month = String(item.month);
      nodeTagA.dataset.year = String(item.year);
      nodeTagA.innerHTML = `${tempDate
        .toLocaleString('ru', { month: 'long' })
        .replace(' г.', '')
        .toUpperCase()} ${item.year}`;

      if (item.month === currentMonthNumber && item.year === currentYearNumber) {
        nodeTagA.className = 'dropdownToday';
      } else {
        nodeTagA.dataset.buttonType = 'dropdown';

        nodeTagA.addEventListener('click', (event) => {
          setNewCalendarPeriod(event);
        });
      }

      nodeDropdownContent.appendChild(nodeTagA);
    });

    nodeDropdownContent.classList.toggle('show');
  }

  // ===============================================================================================
  // Очистка выбранного периода
  // ===============================================================================================
  function clearingSelectedPeriod() {
    document
      .querySelectorAll('.selectedTd')
      .forEach((item) => item.classList.toggle('selectedTd'));

    period.splice(0);

    startDatePeriod.value = '';
    endDatePeriod.value = '';
    startDatePeriod.placeholder = 'не выбрано';
    endDatePeriod.placeholder = 'не выбрано';
  }

  // ===============================================================================================

  document.querySelector('.clearingPeriod')
    .addEventListener('click', clearingSelectedPeriod);

  // инициализация календаря
  createCalendar(selectedDate);

  // конпка "Сегодня"
  const nodeTodayButton = document.querySelector('.todayButton');
  if (nodeTodayButton !== null) {
    nodeTodayButton.addEventListener('click', setNewCalendarPeriod);
  }

  // вешаем обработчик нажатия предыдущий/следующий период
  document.querySelector('.left')
    .addEventListener('click', setNewCalendarPeriod);

  document.querySelector('.right')
    .addEventListener('click', setNewCalendarPeriod);

  // меню dropdown
  document.querySelector('.dropdown')
    .addEventListener('click', showDropdown);

  // закрыть раскрывающийся список, если пользователь кликнет за его пределами
  window.onclick = (event) => {
    if (!event.target.matches('.dropButton')) {
      document
        .querySelector('.dropdown-content')
        .classList
        .remove('show');
    }
  };
}());
