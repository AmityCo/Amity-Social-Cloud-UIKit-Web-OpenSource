import * as echarts from 'echarts';

export const initChart = () => {
  const chartElement = document.getElementById('tipsterChart');
  if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
    const myChart = echarts.init(chartElement);
    const radarOptions = {
      color: ['#00653B'],
      legend: {},
      radar: [
        {
          indicator: [
            // these values are in order with /n new line command to go to the next line.
            // is gonna be shown in this order on the 4 angles of the chart
            {
              name: '{icon1|🔄}\n{title|Rigochi ricevuti}\n{value|10.0}\n{subtitle|(Media 6.2)}',
              max: 10,
            },

            {
              name: '{icon2|👍}\n{title|Like ricevuti}\n{value|8.5}\n{subtitle|(Media 8.0)}',
              max: 10,
            },

            {
              name: '{icon3|👥}\n{title|Follower}\n{value|2.0}\n{subtitle|(Media 4.2)}',
              max: 10,
            },

            {
              name: '{icon4|📱}\n{title|Tip pubblicati}\n{value|8.4}\n{subtitle|(Media 6.4)}',
              max: 10,
            },
          ],

          name: {
            formatter: function (name: string) {
              return name;
            },

            //different formatting options for the labels according the the figma
            rich: {
              icon1: { fontSize: 20, padding: [0, 0, 4, 0] },
              icon2: { fontSize: 20, padding: [0, 0, 4, 0] },
              icon3: { fontSize: 20, padding: [0, 0, 4, 0] },
              icon4: { fontSize: 20, padding: [0, 0, 4, 0] },
              title: { fontSize: 14, color: '#666', fontWeight: 400 },
              value: { fontSize: 22, color: '#00653B', fontWeight: 'bold' },
              subtitle: { fontSize: 12, color: '#006400' },
            },
          },
          // positioning of the chart [xAxis,yAxis]
          center: ['50%', '50%'],
          radius: 100,
          //   turn from diamond shape to cross
          startAngle: 45,
          splitNumber: 5,
          shape: 'circle',
          splitArea: { show: false },
          axisLine: {
            lineStyle: {
              color: '#D9D9D9',
              dashOffset: 5,
            },
          },
          splitLine: {
            lineStyle: {
              color: '#D9D9D9',
            },
          },
        },
      ],
      series: [
        {
          type: 'radar',
          emphasis: {
            lineStyle: {
              width: 1,
            },
          },
          data: [
            // these values are the actual data used by the chart
            {
              value: [10, 8.5, 2.0, 8.4],
              name: 'values',
              areaStyle: {
                color: 'rgba(0, 101, 59, 0.20)',
              },
            },
          ],
        },
      ],
    };
    myChart.setOption(radarOptions);

    // Cleanup function
    return () => {
      myChart.dispose();
    };
  }
  return null;
};
