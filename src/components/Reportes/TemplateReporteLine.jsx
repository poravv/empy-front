
import { Area } from '@ant-design/plots';

//xField: 'mes',yField: ['marca', 'cantidad'],

const ReporteLine = ({data,xField,cantidad,descripcion}) => {
  
  
  const config = {
    data,
    xField: xField,
    yField: cantidad,
    seriesField: descripcion,
    color: ['#6897a7', '#8bc0d6', '#60d7a7', '#dedede', '#fedca9', '#fab36f', '#d96d6f'],
    xAxis: {type: 'time',mask: 'MM',},
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {position: 'top',},
  };
  return <Area {...config} />;
};

export default ReporteLine;
