import React, { useEffect, useState } from 'react'; 
import { Form, Input, DatePicker, Select, Button, Upload, message, Row, Col, Image, InputNumber,Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import thư viện
import 'react-quill/dist/quill.snow.css'; // Import CSS
const { Option } = Select;

interface bacsi {
    id?: number;
    ho_ten?: string;
    chuyen_mon?: string;
    khoa_id?: string;
    so_dien_thoai?: string;
    email?: string;
    ngay_sinh?: string;
    gioi_tinh?: string;
    dia_chi?: string;
    gia?: string;
    mat_khau: string;
    files?: any;
    hinh_anh:any;
    khambenh_qua_video: boolean;
    chuc_danh: string;
    kinh_nghiem: string;
    gioi_thieu: string;
    chuyen_tri: string;
  }
const Thongtincanhan = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<bacsi>(); // Dùng để lưu dữ liệu từ API
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Lấy id từ sessionStorage
    const doctorId = sessionStorage.getItem("id");
    if (doctorId) {
      fetchDoctorInfo(doctorId);
    } else {
      message.error("Không tìm thấy ID bác sĩ trong session!");
    }
  }, []);

  const fetchDoctorInfo = async (doctorId: any) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:9999/api/bacsi/getbacsibyID/${doctorId}`);
      console.log("Dữ liệu bác sĩ:", response.data);
      
      if (response.data && response.data.length > 0) {
        const doctorData = response.data[0];
        setDoctorInfo(doctorData);
        form.setFieldsValue({
          ...doctorData,
          ngay_sinh: doctorData.ngay_sinh ? moment(doctorData.ngay_sinh) : null,
          hinh_anh: Array.isArray(doctorData.hinh_anh) ? doctorData.hinh_anh : [], // Đảm bảo là mảng
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin bác sĩ:", error);
      message.error("Không thể lấy thông tin bác sĩ!");
    } finally {
      setLoading(false);
    }
  };
   // Hàm hiển thị Modal
   const showModal = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng Modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };


 
  const onFinish = async (values:any) => {
    try {
      const response = await axios.put('http://localhost:9999/api/bacsi/suabacsi', {
        ...values,
        ngay_sinh: values.ngay_sinh ? moment(values.ngay_sinh).format('YYYY-MM-DD') : null,
        id: doctorInfo?.id, // Truyền ID bác sĩ cần sửa
      });
      console.log('Response:', response.data);
      if (response.data.success) {

        message.success('Cập nhật thông tin bác sĩ thành công!');
        setIsModalOpen(false); // Đóng Modal
        fetchDoctorInfo(doctorInfo?.id); // Lấy lại dữ liệu mới
      } else {
        message.error('Cập nhật thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      message.error('Có lỗi xảy ra khi cập nhật!');
    }
  };
  return (
    <Form
    form={form}
      name="doctorForm"
      onFinish={onFinish}
      initialValues={{
          ngay_sinh: moment(),
        }}
      layout="vertical"
    >
       <Form.Item label="Ảnh">
        {doctorInfo?.hinh_anh ? (
          <Image
            src={doctorInfo.hinh_anh} // Hiển thị ảnh từ API
            alt="Ảnh bác sĩ"
            width={200}
            style={{borderRadius:100}}
          />
        ) : (
          <p>Không có ảnh</p>
        )}
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Họ và tên"
            name="ho_ten"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12} >
          <Form.Item
            label="Chuyên môn"
            name="chuyen_mon"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên môn!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Khoa"
            name="khoa_id"
            rules={[{ required: true, message: 'Vui lòng chọn khoa!' }]}
          >
            <Select placeholder="Chọn khoa">
              <Option value={1}>Khoa A</Option>
              <Option value={2}>Khoa B</Option>
              {/* Thêm các lựa chọn khoa khác */}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="so_dien_thoai"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Ngày sinh"
            name="ngay_sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Giới tính"
            name="gioi_tinh"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Địa chỉ"
            name="dia_chi"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>


      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Mật khẩu"
            name="mat_khau"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Col>

        <Col span={12}>
        <Form.Item name="gioi_thieu" label="Giới thiệu">
        <ReactQuill
          value={form.getFieldValue("gioi_thieu") || ""}
          onChange={(content: string) => {
            form.setFieldsValue({ gioi_thieu: content });
          }}
        />
      </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Kinh nghiệm"
            name="kinh_nghiem"
          >
           <ReactQuill
          value={form.getFieldValue("kinh_nghiem") || ""}
          onChange={(content: string) => {
            form.setFieldsValue({ kinh_nghiem: content });
          }}
        />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Chuyên trị"
            name="chuyen_tri"
          >
           <ReactQuill
          value={form.getFieldValue("chuyen_tri") || ""}
          onChange={(content: string) => {
            form.setFieldsValue({ chuyen_tri: content });
          }}
        />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Chức danh"
            name="chuc_danh"
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
        <Form.Item
        label="Giá"
        name="gia"
        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          formatter={(value:any) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
          }
          parser={(value) => value?.replace(/\D/g, '') || ''}
          placeholder="Nhập giá tiền"
        />
      </Form.Item>
        </Col>
      </Row>

      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Button type="primary" htmlType="submit">
          Lưu thông tin
        </Button>
        <Button type="primary" onClick={showModal} style={{marginLeft:20
        }}>
        Sửa thông tin
      </Button>

      </Form.Item>


      <div>
      {/* <Button type="primary" onClick={showModal}>
        Sửa thông tin
      </Button> */}

      <Modal
        title="Sửa thông tin bác sĩ"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="doctorForm"
          onFinish={onFinish}
          initialValues={{
            ngay_sinh: moment(),
          }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="ho_ten"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Chuyên môn"
                name="chuyen_mon"
                rules={[{ required: true, message: 'Vui lòng nhập chuyên môn!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Khoa"
                name="khoa_id"
                rules={[{ required: true, message: 'Vui lòng chọn khoa!' }]}
              >
                <Select placeholder="Chọn khoa">
                  <Option value={1}>Khoa A</Option>
                  <Option value={2}>Khoa B</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="so_dien_thoai"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày sinh"
                name="ngay_sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </Form>
    
  );
};

export default Thongtincanhan;
