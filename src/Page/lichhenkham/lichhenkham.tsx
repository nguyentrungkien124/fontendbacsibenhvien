import React, { useEffect, useState } from 'react';
import type { TableColumnsType, TableProps } from 'antd';
import { Button, message, Space, Table, Tooltip, Modal, Input } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';

type OnChange = NonNullable<TableProps<DataType>['onChange']>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
  id: string;
  nguoi_dung_id: number;
  bac_si_id: number;
  goi_kham_id: number;
  ngay_hen: string;
  ca_dat: string;
  trang_thai: number;
  ghi_chu: string;
  ngay_tao: string;
  chuyen_khoa: string;
  gia: number;
  ly_do: string;
}
interface KhachHang {
  id: number;
  ho_ten: string;
}

const Lichhenkham: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataType[]>([]);
  const [reason, setReason] = useState<string>('');
  const [currentRecord, setCurrentRecord] = useState<DataType | null>(null);
  const [customers, setCustomers] = useState<KhachHang[]>([]);
  const bacsiID = sessionStorage.getItem('id');

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const handleStatusChange = (status: number | null) => {
    setStatusFilter(status);
  };

  const filteredData = statusFilter === null ? data : data.filter(item => item.trang_thai === statusFilter);

  const showRejectModal = (record: DataType) => {
    setCurrentRecord(record);
    setReason('');
    Modal.confirm({
      title: 'Nhập lý do từ chối khám',
      content: (
        <Input
          
          //  
          onChange={(e) => setReason(e.target.value)}
        />
      ),
      onOk: async () => {
        if (currentRecord) {
          try {
            const response = await fetch('http://localhost:9999/api/datlich/tuchoikham', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: currentRecord.id, ly_do: reason }),
            });

            if (!response.ok) throw new Error('Failed to reject appointment');
            message.success('Từ chối khám thành công!');
            fetchData(); // Tải lại dữ liệu để cập nhật giao diện
          } catch (error) {
            message.error('Từ chối khám thất bại');
          }
        }
      },
    });
  };
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/user/getall');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const result = await response.json();
      setCustomers(result);
    } catch (error) {
      message.error('Lỗi khi tải danh sách khách hàng');
    }
  };

  const showConfirm = (record: DataType, action: string) => {
    const { id, trang_thai } = record;
    let newStatus: number | null = null;

    if (action === 'confirm' && trang_thai === 1) {
      newStatus = 2; // Cập nhật trạng thái từ 1 sang 2
    } else if (action === 'view' && trang_thai === 2) {
      newStatus = 3; // Cập nhật trạng thái từ 2 sang 3
    }

    if (newStatus !== null) {
      Modal.confirm({
        title: 'Xác nhận hành động',
        content: `Bạn có chắc chắn muốn ${action === 'confirm' ? 'xác nhận' : 'đã khám'} lịch khám này?`,
        onOk: async () => {
          try {
            const response = await fetch('http://localhost:9999/api/datlich/suatrangthailichkham', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id, trang_thai: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            message.success('Cập nhật trạng thái thành công!');
            fetchData(); // Tải lại dữ liệu để cập nhật giao diện
          } catch (error) {
            message.error('Cập nhật trạng thái thất bại');
          }
        },
      });
    }
  };

  const fetchData = async () => {
    if (!bacsiID) {
      message.error('Không tìm thấy ID người dùng trong session');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9999/api/datlich/getLichKhamByBacSi/${bacsiID}/1/1000`);
      console.log(data)
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchData();
  }, []);

  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      key: 'stt',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
      width:50,  ellipsis: true,
    },
    {
      title: 'Khách hàng',
      key: 'khach_hang',
      render: (text: any, record: DataType) => {
        const customer = customers.find(c => c.id === record.nguoi_dung_id);
        return customer ? customer.ho_ten : 'Không xác định';
      },
      sorter: (a, b) => {
        const nameA = customers.find(c => c.id === a.nguoi_dung_id)?.ho_ten || '';
        const nameB = customers.find(c => c.id === b.nguoi_dung_id)?.ho_ten || '';
        return nameA.localeCompare(nameB);
      },
      ellipsis: false,
     width:200
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'ngay_hen',
      key: 'ngay_hen',
      sorter: (a, b) => new Date(a.ngay_hen).getTime() - new Date(b.ngay_hen).getTime(),
      ellipsis: true,
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Ca đặt',
      dataIndex: 'ca_dat',
      key: 'ca_dat',
      ellipsis: true,
      render: (text: string) => {
        // Ensure text is defined and not an empty string
        if (!text || typeof text !== 'string') return '';
    
        // Try to split the text into a time range (if applicable)
        const times = text.split('-');
        
        // If it's a valid time range, format the times
        if (times.length === 2) {
          const formatTime = (time: string) => {
            const [hours, minutes] = time.split(':');
            return `${hours}:${minutes}`;
          };
    
          // Safely format the time range and return it
          return `${formatTime(times[0])}-${formatTime(times[1])}`;
        }
    
        // If not a valid time range, return the original text
        return text;
      },
    },
    

    {
      title: 'Chuyên khoa',
      dataIndex: 'chuyen_khoa',
      key: 'chuyen_khoa',
      ellipsis: true,
    },
    {
      title: 'Giá',
      dataIndex: 'gia',
      key: 'gia',
      sorter: (a, b) => a.gia - b.gia,
      ellipsis: true,
      render: (gia: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghi_chu',
      key: 'ghi_chu',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngay_tao',
      key: 'ngay_tao',
      align: 'center',
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      dataIndex: 'trang_thai',
      render: (text: number) => {
        let color = '';
        let label = '';
        switch (text) {
          case 1:
            color = 'orange';
            label = 'Chờ xác nhận';
            break;
          case 2:
            color = 'green';
            label = 'Đã xác nhận';
            break;
          case 3:
            color = 'blue';
            label = 'Đã khám';
            break;
          case 0:
            color = 'red';
            label = 'Hủy khám bệnh';
            break;
          case 4:
            color = 'yellow';
            label = 'Từ chối khám';
            break;
          default:
            color = 'gray';
            label = 'Không xác định';
        }
        return <span style={{ color, fontWeight: 'bold' }}>{label}</span>;
      },
      sorter: (a, b) => a.trang_thai - b.trang_thai,
    },
    {
      title: 'Chức năng',
      key: 'actions',
      align: 'center',
      render: (_, record) => {
        const { trang_thai } = record;
        return (
          <Space size="middle">
            {trang_thai === 1 && (
              <Tooltip title="Xác nhận">
                <CheckCircleOutlined
                  style={{ color: 'green', cursor: 'pointer' }}
                  onClick={() => showConfirm(record, 'confirm')}
                />
              </Tooltip>
            )}
            {trang_thai === 2 && (
              <Tooltip title="Đã khám">
                <EyeOutlined
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => showConfirm(record, 'view')}
                />
              </Tooltip>
            )}
            {(trang_thai === 1 || trang_thai === 2) && (
              <Tooltip title="Từ chối">
                <CloseCircleOutlined
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => showRejectModal(record)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  const getButtonStyle = (status: number | null) => {
    return status === statusFilter ? { backgroundColor: 'lightblue' } : {};
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => handleStatusChange(1)} style={getButtonStyle(1)}>
          Chờ xác nhận
        </Button>
        <Button onClick={() => handleStatusChange(2)} style={getButtonStyle(2)}>
          Đã xác nhận
        </Button>
        <Button onClick={() => handleStatusChange(3)} style={getButtonStyle(3)}>
          Đã khám
        </Button>
        <Button onClick={() => handleStatusChange(0)} style={getButtonStyle(0)}>
          Khách hàng hủy khám
        </Button>
        <Button onClick={() => handleStatusChange(4)} style={getButtonStyle(4)}>
          Từ chối khám
        </Button>
        <Button onClick={() => handleStatusChange(null)} style={getButtonStyle(null)}>
          Tất cả
        </Button>
      </Space>
      <Table<DataType> columns={columns} dataSource={filteredData} onChange={handleChange} loading={loading} />
    </>
  );
};

export default Lichhenkham;