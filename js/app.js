// начальная инициализация календаря
function init(selectedDate) {
  // количество дней в неделе
  const countOfDaysInWeek = 7

  // текуая дата
  const currentDate = new Date()

  // выделяем из полученный даты месяц и год
  const optionsOfDate = {
    year: 'numeric',
    month: 'long'
  }

  let date = selectedDate.toLocaleString('ru', optionsOfDate)

// убираем 'г.'
  date = date.substring(0, date.indexOf(' г.'))

// находим ноду для вывода текущего месяца и выводим
  document.querySelector('.monthYear').innerText = date

// Функция получения количества дней в месяце
  Date.prototype.daysInMonth = function () {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
  };

// определяем количество дней в текущем месяце
  const numberOfDaysInMonth = selectedDate.daysInMonth()

// формируем дату - первый день текущего месяца
  let firstDayOfCurrentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() - 1
  firstDayOfCurrentMonth = firstDayOfCurrentMonth < 0 ? 6 : firstDayOfCurrentMonth

// таблица для формирования дней месяца
  const daysOfMonth = Array(42).fill(0)

// формируем данные для таблицы дней месяца
  for (let i = firstDayOfCurrentMonth; i - firstDayOfCurrentMonth < numberOfDaysInMonth; i++) {
    daysOfMonth[i] = i - firstDayOfCurrentMonth + 1
  }

// считаем количество строк(недель) для формирования таблицы дней
  const intermediateDataForDaysOfMonthTable = firstDayOfCurrentMonth + numberOfDaysInMonth
  let countOfWeeks = ~~((intermediateDataForDaysOfMonthTable) / countOfDaysInWeek)

  if (intermediateDataForDaysOfMonthTable % countOfDaysInWeek) {
    countOfWeeks++
  }

// "отрезаем" бесполезные ячейки
  daysOfMonth.length = countOfWeeks * countOfDaysInWeek

// находим ноду тела таблицы
  const tbodyNode = document.querySelector('table tbody')

// заполняем дни в таблице
  let tr
  daysOfMonth.forEach((item, step) => {
    step++

    // для каждой недели формируем строку
    if (step === 1 || (step % countOfDaysInWeek) - 1 === 0) {
      tr = document.createElement('tr')
      tbodyNode.appendChild(tr)
    }

    // формируем ячейку
    let td = document.createElement('td')

    if (item === 0) {
      td.innerText = ''
      td.className = 'empty'
    } else {
      td.innerText = item

      if (item === currentDate.getDate() && selectedDate.getMonth() === currentDate.getMonth()) {
        td.className = 'today'
      }
    }

    tr.appendChild(td)
  })
}

// -------------------------------------------------------------------------

// очистка таблицы дней
function clearTable() {
  const node = document.querySelector('table');

  // rows[0] это заголовок - оставляем
  while(node.rows[1]) {
    node.deleteRow(1);
  }
}

// получаем текущую дату
let selectedDate = new Date()

// Дата для отладки
// let selectedDate = new Date(2022, 8, 5)

// инициализация календаря
init(selectedDate)

// переход на предыдущий месяц
function prev() {
  selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)

  clearTable()

  init(selectedDate)
}

// переход на следующий месяц
function next() {
  selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)

  clearTable()

  init(selectedDate)
}

