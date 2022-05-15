##App

- Layout (вся логика с позиционированием на странице)
  - Background (вся логика с картинкой и бэкграундом)
  - Calendar (все что есть в календаре, какие-то корневые значения для стейта, реакт-контекст)
    - CalendarHeader (логика выбора месяца)
      - RightMonthButton
        - MonthButton
      - MonthSelector (логика выбора месяца через дропдаун)
        - MonthValue
        - MonthDropdown
          - MonthDropdownItem x13
      - LeftMonthButton
        - MonthButton
    - WeekDayNames (заголовок календаря, дни недели)
      - WeekDayName x7
        - Cell
    - CalendarDays
      - Week x5 (пять недель для заполнения)
        - Cell x7
    - Footer (то что идет за календарем)
      - PeriodValue
      - TodaySelector

``` jsx
const App = () => (
  <Layout>
    <Calendar />
  </Layout>
);

const Layout = ({ children }) => (
  <div className="Layout">
    <Background />
    {children}
  </div>
);

const DateContext = React.createContext({
  month: [],
  setMonth: () => {},
});

const Calendar = () => {
  const [month, setMonth] = React.useState(/* месяц */);
  return
    <CaledarContext.Provider
      value={{
        month,
        setMonth,
      }}
    >
      <div className="Calendar">
        <CalendarHeader />
        <WeekDayNames />
        <CalendarDays />
        <Footer />
      </div>
    </CaledarContext.Provider>
};

const CalendarHeader = () => {
  const { month } = React.useContext(CaledarContext);
  // ...
}
```

 ##Папки

- public
  - css
- src
  - components
    - файлы компонентов
  - context
    - файлы контекстов
