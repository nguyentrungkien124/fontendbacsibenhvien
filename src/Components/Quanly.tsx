import React, { useEffect, useState } from 'react';
import {
  BarChartOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Typography, theme, MenuProps } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

// Menu người dùng
const userMenu = (
  <Menu
    items={[
      { key: '1', label: <Link to="/thongtincanhan">Thông tin cá nhân</Link> },
      { key: '2', label: <Link to="/settings">Cài đặt</Link> },
      { key: '3', label: <Link to="/login">Đăng xuất</Link> },
    ]}
  />
);

const items: MenuProps['items'] = [
  {
    key: 'sub1',
    icon: <BarChartOutlined />,
    label: 'Thống kê',
    children: [{ key: '1', label: <Link to="/thongke">Danh sách</Link> }],
  },
  {
    key: 'sub2',
    icon: <CalendarOutlined />,
    label: 'Lịch làm việc',
    children: [{ key: '2', label: <Link to="/lichlamviec">Danh sách</Link> }],
  },
  {
    key: 'sub3',
    icon: <ScheduleOutlined />,
    label: 'Lịch hẹn khám',
    children: [{ key: '3', label: <Link to="/lichhenkham">Danh sách</Link> }],
  },
];

const Admin: React.FC = () => {
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // Số lượng thông báo
  const [notifications, setNotifications] = useState<{ message: string; time: number }[]>([]); // Lưu thông báo

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Lấy dữ liệu từ sessionStorage
    const storedDoctorName = sessionStorage.getItem('ho_ten');
    const storedDoctorId = sessionStorage.getItem('id');
    const anhdaidien = sessionStorage.getItem('hinh_anh');
    if (storedDoctorName) setDoctorName(storedDoctorName);
    if (storedDoctorId) setDoctorId(storedDoctorId);
    if (anhdaidien) setAvatar(anhdaidien);

    // Kết nối socket
    const socket = io('http://localhost:9999');

    socket.on('connect', () => {
      if (storedDoctorId) {
        socket.emit('join_room', { bac_si_id: storedDoctorId });
        console.log(`Gửi sự kiện join_room với bac_si_id: ${storedDoctorId}`);
      }
    });

    socket.on('newNotification', (data) => {
      const newNotification = {
        message: data.message,
        time: Date.now(), // Lưu thời gian nhận thông báo
      };
      setNotifications((prev) => [...prev, newNotification]);
      setNotificationCount((prevCount) => prevCount + 1);
      console.log('Nhận thông báo mới:', data.message);
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  // Hàm để tính toán thời gian đã trôi qua
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  // Cập nhật thời gian thực cho thông báo
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.map((noti) => ({
          ...noti,
          time: noti.time, // Giữ nguyên thời gian đã lưu
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [notifications]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Avatar
            size={collapsed ? 40 : 80}
            src={avatar}
            alt="Doctor Avatar"
            style={{ marginBottom: 16 }}
          />
          {!collapsed && (
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'block',
              }}
            >
              {doctorName ? `Bác sĩ ${doctorName}` : 'Đang tải...'}
            </Text>
          )}
        </div>
        <Menu
          theme="dark"
          style={{ marginTop: '-9px' }}
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/logobenhvienKhoaiChau.jpg"
              alt="Logo"
              style={{ width: 40, height: 40, marginRight: 12 }}
            />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#1d8ceb' }}>
              Phân hệ dành cho Bác sĩ
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Dropdown
              overlay={
                <Menu>
                  {notifications.length > 0 ? (
                    notifications.map((noti, index) => (
                      <Menu.Item key={index}>
                        {noti.message} - {getTimeAgo(noti.time)}
                      </Menu.Item>
                    ))
                  ) : (
                    <Menu.Item key="no_noti">Không có thông báo</Menu.Item>
                  )}
                </Menu>
              }
              placement="bottomRight"
              arrow
            >
              <Badge count={notificationCount}>
                <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
              </Badge>
            </Dropdown>

            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#4caf50' }}>
              {new Date().toLocaleDateString()}
            </span>
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{doctorName ? `Xin chào ${doctorName}` : 'Đang tải...'}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ margin: '16px 0' }}></div>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Bản quyền thuộc về Bệnh viện Khoái Châu ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Admin;