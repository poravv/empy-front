import { Button, Table } from 'antd';
import { useParams } from "react-router-dom";
import { getDetalleId } from '../../../services/DetAsistencia';
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const columns = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
  },
  {
    title: 'Apellido',
    dataIndex: 'apellido',
  },
  {
    title: 'Documento',
    dataIndex: 'documento',
  },
];

const AsistenciaDetalle = ({ token }) => {
  
  const navigate = useNavigate();
  const { idasistencia } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  const start = (selected) => {
    //console.log(selectedRowKeys)
    //console.log(selected);
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getLstAsistencia();
    // eslint-disable-next-line
  }, []);

  const getLstAsistencia = async () => {
      const array = [];
      const arrayselect = [];
      const res = await getDetalleId({ token: token, param: idasistencia });
      res.body.map((asis) => {
        array.push(asis);
        if(asis.asistencia==='P'){
          arrayselect.push(asis.idpersona)
          
        }
        return false;
      })
      setSelectedRowKeys(arrayselect);
      setData(array);
  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  
  const btnCancelar = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={() => start(hasSelected)} disabled={!hasSelected} loading={loading}>
          Cargar
        </Button>
        <span style={{ marginLeft: 8,}} >
          {hasSelected ? `Presentes ${selectedRowKeys.length}` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} rowKey={'idpersona'} columns={columns} dataSource={data} />
      <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
        Atras
      </Button>
    </div>
  );
};
export default AsistenciaDetalle;