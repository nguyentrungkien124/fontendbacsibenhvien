import axios from 'axios';
import { message, notification } from 'antd';
import "../Login/login.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setUsername] = useState(''); // Đổi từ setEmail thành setUsername
    const [mat_khau, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9999/api/bacsi/loginBacSi', {
                email,
                mat_khau
            });

            if (response.data && response.data.token) {
                // Lưu thông tin đăng nhập vào sessionStorage
                sessionStorage.setItem('id',response.data.id);
                sessionStorage.setItem('token', response.data.token); // Token
                sessionStorage.setItem('email', response.data.email); // Tên người dùng
                sessionStorage.setItem('ho_ten',response.data.ho_ten);
                sessionStorage.setItem('hinh_anh',response.data.hinh_anh);
                message.success(`Đăng nhập thành công! Chào mừng, ${response.data.ho_ten}`);
                navigate('/');
              } else {
                message.error(response.data.message || 'Đăng nhập thất bại!');
              }
            } catch (error: any) {
              // Xử lý lỗi
              message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
            }
    };

    return (
        <div className="container">
            <section id="content">
                <form onSubmit={handleLogin}>
                    <h1>Login Form</h1>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            id="username" 
                            value={email} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            id="password" 
                            value={mat_khau} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div>
                        <input 
                            type="submit" 
                            value="Log in" 
                            style={{ left: '87px' }} 
                        />
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="button">
                    <a href="#">Download source file</a>
                </div>
            </section>
        </div>
    );
};

export default Login;
