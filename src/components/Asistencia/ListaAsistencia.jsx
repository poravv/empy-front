import { Button, Table } from 'antd';
import { useState } from 'react';
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
  },
  {
    title: 'Edad',
    dataIndex: 'edad',
  },
  {
    title: 'Direccion',
    dataIndex: 'Direccion',
  },
];
const data = [];
for (let i = 0; i < 25; i++) {
  data.push({
    key: i,
    nombre: `Edward King ${i}`,
    edad: 32,
    Direccion: `London, Park Lane no. ${i}`,
  });
}
const ListaAsistencia = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Cargar
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Presentes ${selectedRowKeys.length}` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};
export default ListaAsistencia;