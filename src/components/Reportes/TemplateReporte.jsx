
import { Pie } from '@ant-design/plots';

const ReporteModelos = ({ data, title }) => {



  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 10,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize:19
        },
        content: title,
      },
    },
  };
  return (
      <Pie style={{ height: `300px` }} {...config} />
  );
};

export default ReporteModelos;