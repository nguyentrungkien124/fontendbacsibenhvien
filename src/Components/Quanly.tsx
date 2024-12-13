import React, { useEffect, useState } from 'react';
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  UserOutlined,
  BellOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Typography, theme, MenuProps } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

// Menu người dùng
const userMenu = (
  <Menu
    items={[
      { key: '1', label: <Link to="/profile">Thông tin cá nhân</Link> },
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
  // {
  //   key: 'sub4',
  //   icon: <CheckCircleOutlined />,
  //   label: 'OK',
  //   children: [{ key: '4', label: <Link to="/lichlamviec">Danh sách</Link> }],
  // },
];

const Admin: React.FC = () => {
  const [doctorName, setDoctorName] = useState<string | null>(null); // Tên bác sĩ lấy từ sessionStorage
  const [doctorId, setDoctorId] = useState<string | null>(null); // ID bác sĩ lấy từ sessionStorage
  const [avatar, setAvatar] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  useEffect(() => {
    // Lấy dữ liệu từ sessionStorage
    const storedDoctorName = sessionStorage.getItem('ho_ten');
    const storedDoctorId = sessionStorage.getItem('id');
    const anhdaidien = sessionStorage.getItem('hinh_anh')
    if (storedDoctorName) setDoctorName(storedDoctorName); 
    if (storedDoctorId) setDoctorId(storedDoctorId);
    if(anhdaidien) setAvatar(anhdaidien)
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Avatar
            size={collapsed ? 40 : 80}
            src={avatar } 
            alt="Doctor Avatar"
            style={{ marginBottom: 16 }}
          />
          {!collapsed && (
         <Text
         style={{
           color: '#fff',
           fontSize: 16,
           fontWeight: 'bold',
           textAlign: 'center', // Căn chữ giữa theo chiều ngang
           display: 'block', // Đảm bảo Text chiếm cả chiều ngang
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
            <Badge count={5}>
              <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
            </Badge>
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
            {/* <div
              style={{
                background: '#e3f2fd',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              <MedicineBoxOutlined style={{ fontSize: 24, color: '#1d8ceb' }} />
              <h3 style={{ margin: 0, fontSize: 18, color: '#1d8ceb' }}>
                Hệ thống quản lý lịch làm việc và lịch hẹn khám
              </h3>
            </div> */}
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
