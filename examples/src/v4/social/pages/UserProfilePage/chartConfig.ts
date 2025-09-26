import * as echarts from 'echarts';

// Function to calculate responsive values
const calculateResponsiveValues = (element: HTMLElement) => {
  const containerWidth = element.clientWidth;
  const containerHeight = element.clientHeight;

  // Since container is always square, use the smaller dimension for calculations
  const containerSize = Math.min(containerWidth, containerHeight);

  // More aggressive scaling for very small devices
  let radiusPercentage = 0.35; // Default 35%

  if (containerSize < 200) {
    radiusPercentage = 0.25; // 25% for very small containers
  } else if (containerSize < 300) {
    radiusPercentage = 0.3; // 30% for small containers
  }

  // Use calculated percentage of the container size for radius
  const baseRadius = containerSize * radiusPercentage;
  const radius = Math.max(baseRadius, 40); // Reduced minimum radius to 40px for very small screens

  // More aggressive font size scaling for small devices
  let fontScale = containerSize / 20; // Default scaling

  if (containerSize < 200) {
    fontScale = containerSize / 25; // Smaller fonts for very small containers
  } else if (containerSize < 300) {
    fontScale = containerSize / 22; // Slightly smaller fonts for small containers
  }

  const baseFontSize = Math.max(fontScale, 8); // Reduced minimum to 8px
  const iconSize = Math.max(baseFontSize * 1.1, 12); // Reduced icon size multiplier
  const titleSize = Math.max(baseFontSize * 0.8, 8);
  const valueSize = Math.max(baseFontSize * 1.2, 12); // Reduced value size multiplier
  const subtitleSize = Math.max(baseFontSize * 0.7, 7);

  return { radius, iconSize, titleSize, valueSize, subtitleSize };
};

// Function to create radar options
const createRadarOptions = (responsive: ReturnType<typeof calculateResponsiveValues>) => {
  const { radius, iconSize, titleSize, valueSize, subtitleSize } = responsive;

  return {
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
            icon1: { fontSize: iconSize, padding: [0, 0, 4, 0] },
            icon2: { fontSize: iconSize, padding: [0, 0, 4, 0] },
            icon3: { fontSize: iconSize, padding: [0, 0, 4, 0] },
            icon4: { fontSize: iconSize, padding: [0, 0, 4, 0] },
            title: { fontSize: titleSize, color: '#666', fontWeight: 400 },
            value: { fontSize: valueSize, color: '#00653B', fontWeight: 'bold' },
            subtitle: { fontSize: subtitleSize, color: '#006400' },
          },
        },
        // positioning of the chart [xAxis,yAxis]
        center: ['50%', '50%'],
        radius: radius,
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
};

export const initChart = () => {
  const chartElement = document.getElementById('tipsterChart');
  const tipsterCard = document.getElementById('tipsterCard');

  console.log('Chart element:', chartElement);
  console.log('Tipster card:', tipsterCard);

  if (
    chartElement &&
    tipsterCard &&
    chartElement.clientWidth > 0 &&
    chartElement.clientHeight > 0
  ) {
    const myChart = echarts.init(chartElement);

    // Initial setup
    const initialValues = calculateResponsiveValues(chartElement);
    myChart.setOption(createRadarOptions(initialValues));

    // Debounce function to limit resize calls
    let resizeTimeout: NodeJS.Timeout;

    // Handle resize to make chart responsive
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Calculate new responsive values based on current chart element size
        const newValues = calculateResponsiveValues(chartElement);

        // Update chart with new options
        myChart.setOption(createRadarOptions(newValues));

        // Resize the chart according to ECharts documentation
        myChart.resize({
          animation: {
            duration: 300,
            easing: 'cubicOut',
          },
        });
      }, 100); // 100ms debounce
    };

    // Use ResizeObserver on the tipster card that changes width on desktop/mobile
    const resizeObserver = new ResizeObserver((entries) => {
      console.log('Tipster card resized:', entries[0].contentRect);
      handleResize();
    });

    // Observe the tipster card that changes size on desktop/mobile
    resizeObserver.observe(tipsterCard);

    // Also listen to window resize as a fallback
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }
  return null;
};
