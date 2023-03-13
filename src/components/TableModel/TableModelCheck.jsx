//import axios from 'axios'
import { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Table, Select } from 'antd';
import { Spin } from 'antd';
import Buscador from '../Utils/Buscador/Buscador';
import UploadFile from '../Utils/Upload';
import { Buffer } from 'buffer';
import { getCiudad } from '../../services/Ciudad';

const { Option } = Select;
function TableModel({ token, form, data, mergedColumns, keyExtraido, varx }) {
  //Celdas editables
  const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
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
    const [previewImage, setPreviewImage] = useState('');
    // eslint-disable-next-line
    const [proveedores, setProveedores] = useState([]);
    // eslint-disable-next-line
    const [marca, setMarca] = useState([]);
    // eslint-disable-next-line
    const [ciudades, setCiudades] = useState([]);
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const onSelectChange = (newSelectedRowKeys) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const hasSelected = selectedRowKeys.length > 0;


    useEffect(() => {
      //getProveedor();

      //getMarca();
      // eslint-disable-next-line
    }, []);



    const getLstCiudad = async () => {
      const res = await getCiudad({ token: token, param: 'get' });
      //console.log(res)
      setCiudades(res.body);
    }

    /*
        //CONFIGURACION DE TOKEN
        const config = {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        };
    
        const getProveedor = async () => {
          const res = await axios.get(`${URIPROV}/get`, config);
          setProveedores(res.data.body);
        }
    
        const getMarca = async () => {
          const res = await axios.get(`${URIMARCA}/get`, config);
          setMarca(res.data.body);
        }
    
        
    */

    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    switch (dataIndex) {
      case 'estado':
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  <Select allowClear > <Option value="AC">Activo</Option> <Option value="IN">Inactivo</Option> </Select>
                </Form.Item>
              ) : (children)
            }
          </td>);
      case 'tipo_cli':
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  <Select allowClear > <Option value="F">Fisico</Option> <Option value="J">Juridico</Option> </Select>
                </Form.Item>
              ) : (children)
            }
          </td>);
      case 'sexo':
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  <Select allowClear > <Option value="MA">Masculino</Option> <Option value="FE">Femenino</Option> </Select>
                </Form.Item>
              ) : (children)
            }
          </td>);
      //break;
      //Proveedor
      case 'idproveedor':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'razon_social'} value={'idproveedor'} data={proveedores} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      //Marca
      case 'idmarca':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'descripcion'} value={'idmarca'} data={marca} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      //Modelo
      case 'idmodelo':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'descripcion'} value={'idmodelo'} data={marca} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      //Ciudad
      case 'idciudad':
        getLstCiudad();
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'descripcion'} value={'idciudad'} data={ciudades} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      case 'img':
        return (
          <td {...restProps}>
            {
              //
              editing ?
                <Form.Item name={dataIndex} style={{ margin: 0, }}  >
                  <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >

                    { //Aqui la logica de si actualiza o no las imagenes del formulario
                      (previewImage !== '' && previewImage != null) ?
                        record.img = previewImage :
                        record.img ?
                          record.img = Buffer.from(record.img).toString('ascii') :
                          null}

                  </UploadFile>
                </Form.Item>
                : (children)
            }
          </td>);

      case 'img1':
        return (
          <td {...restProps}>
            {
              //
              editing ?
                <Form.Item name={dataIndex} style={{ margin: 0, }}  >
                  <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >

                    { //Aqui la logica de si actualiza o no las imagenes del formulario
                      (previewImage !== '' && previewImage != null) ?
                        record.img1 = previewImage :
                        record.img1 ?
                          record.img1 = Buffer.from(record.img1).toString('ascii') :
                          null}

                  </UploadFile>
                </Form.Item>
                : (children)
            }
          </td>);
      case 'img2':
        return (
          <td {...restProps}>
            {
              //
              editing ?
                <Form.Item name={dataIndex} style={{ margin: 0, }}  >
                  <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >

                    { //Aqui la logica de si actualiza o no las imagenes del formulario
                      (previewImage !== '' && previewImage != null) ?
                        record.img2 = previewImage :
                        record.img2 ?
                          record.img2 = Buffer.from(record.img2).toString('ascii') :
                          null}

                  </UploadFile>
                </Form.Item>
                : (children)
            }
          </td>);
      //break;
      default:
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  {inputNode}
                </Form.Item>
              ) : (children)
            }
          </td>);
    }
  };

  return (
    <>
      {
        data ? <Form form={form} component={false}
        >
          <Table
            rowSelection={rowSelection}
            rowKey={keyExtraido}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            scroll={{
              x: (varx ?? 100),
              y: 300,
            }}
            
          />
        </Form> :
          <section style={{ textAlign: `center`, margin: `10px` }}>
            <Spin />
          </section>
      }
    </>
  );
};
export default TableModel;