import React, { useState } from 'react';
import { DatePicker, Button, Table, Card, Row, Col, message } from 'antd';
import { Bar } from '@ant-design/plots';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const ThongKe = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Dayjs[] | null>(null);
  
  const bacSiId = sessionStorage.getItem('id') || ''; // Lấy bac_si_id từ session

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      key: 'ngay',
    },
    {
      title: 'Số lịch khám',
      dataIndex: 'so_lich_kham',
      key: 'so_lich_kham',
    },
    {
      title: 'Số bệnh nhân',
      dataIndex: 'so_benh_nhan',
      key: 'so_benh_nhan',
    },
  ];

  const fetchData = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:9999/api/thongke/ThongKeLichKhamTheoBacSi',
        {
          start_date: startDate,
          end_date: endDate,
          bac_si_id: bacSiId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Dữ liệu nhận được:', response.data);

      const formattedData = response.data.map((item: any, index: number) => ({
        ...item,
        stt: index + 1,
        ngay: dayjs(item.ngay).format('YYYY-MM-DD'),  // Chuyển đổi định dạng ngày
      }));

      console.log('Dữ liệu đã định dạng:', formattedData);
      setData(formattedData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      message.error('Không thể lấy dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (selectedDates && selectedDates.length === 2) {
      const startDate = selectedDates[0].format('YYYY-MM-DD');
      const endDate = selectedDates[1].format('YYYY-MM-DD');
      fetchData(startDate, endDate);
    } else {
      message.warning('Vui lòng chọn khoảng thời gian trước khi lọc.');
    }
  };

  const config = {
    data,
    xField: 'ngay',
    yField: 'so_lich_kham',
    seriesField: 'ngay',
    label: {
      position: 'top',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    colorField: 'ngay',
    columnStyle: {
      radius: [5, 5, 0, 0],
    },
  };

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={16}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => setSelectedDates(dates as Dayjs[] | null)}
            />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ width: '100%' }} onClick={handleButtonClick}>
              Lọc thống kê
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Số lượng lịch khám">
            {data.length > 0 ? (
              <Bar {...config} loading={loading} />
            ) : (
              <div>Không có dữ liệu để hiển thị</div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Chi tiết lịch khám">
            <Table dataSource={data} columns={columns} pagination={false} rowKey="stt" loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThongKe;