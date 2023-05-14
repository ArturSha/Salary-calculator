import Chart from 'react-apexcharts';
interface DoughnutChartType {
  data: number[];
  theme: boolean;
}

export const DoughnutChart: React.FC<DoughnutChartType> = ({ data, theme }) => {
  return (
    <div>
      <Chart
        type='donut'
        width={600}
        height={600}
        series={data}
        options={{
          legend: {
            fontSize: '18px',
            labels: {
              colors: '',
              useSeriesColors: true,
            },
          },
          labels: ['Base', 'Extra', 'Bonus/Vacation', 'Calls', 'SSP'],
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
                    label: 'In total',
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
                      return result.toFixed(2) + '$';
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
};
