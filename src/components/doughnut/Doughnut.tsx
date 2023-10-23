import Chart from 'react-apexcharts';
import { memo } from 'react';
import './doughnut.css';

interface DoughnutChartType {
  data: number[];
  theme: boolean;
  language: string;
}

export const DoughnutChart = memo((props: DoughnutChartType) => {
  const { data, theme, language } = props;
  return (
    <div className='contaner-doughnut'>
      <Chart
        className='doughnut'
        type='donut'
        series={data}
        options={{
          legend: {
            position: 'bottom',
            fontSize: '18px',
            labels: {
              colors: '',
              useSeriesColors: true,
            },
          },
          labels:
            language === 'en-US'
              ? ['Base', 'Extra', 'Bonus/Vacation', 'Calls', 'SSP']
              : [
                  'Базовая ставка',
                  'Экстра',
                  'Бонус/Отпускные',
                  'Бонус за звонки',
                  'ЕСВ',
                ],
          colors: ['#6F75F2', '#c24848', '#58c248', '#b248c2', '#c2a748'],
          grid: {
            borderColor: '#F67E7E',
          },
          stroke: {
            colors: ['#6F75F2', '#c24848', '#58c248', '#b248c2', '#c2a748'],
          },

          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  value: {
                    color: `${theme ? '#000000' : '#D1EAFF'}`,
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '24px',
                    formatter: function (w) {
                      const num = parseFloat(w);
                      if (isNaN(num)) {
                        return w;
                      }
                      const res = num.toFixed(2);
                      return res.toString();
                    },
                  },
                  total: {
                    label: language === 'en-US' ? 'In total' : 'Доход',
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    show: true,
                    showAlways: true,
                    color: `${theme ? '#3E3B3B' : '#F4E79E'} `,
                    fontSize: '20px',
                    formatter: function (w) {
                      let result = w.globals.initialSeries.reduce(
                        (a: number, b: number) => a + b,
                        0
                      );

                      return result.toFixed(0) + '$';
                    },
                  },
                },
              },
            },
          },
        }}
      />
    </div>
  );
});
