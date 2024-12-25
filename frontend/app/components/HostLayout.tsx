'use client';
import React, { useState, useEffect } from 'react';
import { Toaster } from "../components/ui/toaster";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    EditOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/navigation';
import HostPropertyCard from './HostPropertyCard';

const HostLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { Header, Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('dashboard'); // Track selected menu key
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const router = useRouter();

    // UseEffect to handle navigation based on selected key
    useEffect(() => {
        switch (selectedKey) {
            case 'properties':
                <HostPropertyCard/>;
                break;
            case 'reviews':
                <h1>Reviews</h1>;
                break;
            default:
                <><h1>404 Page not found</h1></>
                break;
        }
    }, [selectedKey, router]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" style={{ color: 'white', textAlign: 'center', padding: '16px' }}>
                    Admin Panel
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['properties']}
                    onClick={({ key }) => setSelectedKey(key)} // Update selectedKey on menu click
                    items={[
                        {
                            key: 'properties',
                            icon: <EditOutlined />,
                            label: 'Properties',
                        },
                        {
                            key: 'reviews',
                            icon: <MessageOutlined />,
                            label: 'Reviews',
                        }
                    ]}
                />
            </Sider>

            {/* Main Content Area */}
            <Layout>
                {/* Header */}
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingInline: '16px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <h1
                            style={{
                                margin: 0,
                                paddingLeft: '16px',
                                fontSize: '24px',
                                color: 'inherit',
                            }}
                        >
                            Host Panel
                        </h1>
                    </div>
                </Header>

                {/* Content Area */}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: '8px',
                    }}
                >
                    {children}
                </Content>
            </Layout>
            <Toaster />
        </Layout>
    );
};

export default HostLayout;
