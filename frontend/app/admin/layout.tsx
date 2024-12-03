'use client';
import React, { Suspense, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  EditOutlined,
  MessageOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Loading from './loading';


const { Header, Sider, Content } = Layout;

// Dummy components for each section
const Dashboard = () => <h1>Dashboard Content</h1>;
const Properties = () => <h1>Properties Management</h1>;
const Reviews = () => <h1>Reviews Section</h1>;
const Analytics = () => <h1>Analytics Section</h1>;
const Settings = () => <h1>Settings</h1>;

const AdminPanel: React.FC = () => {

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard'); // Track selected menu key
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Function to render content based on selected menu item
  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <Properties />;
      case 'reviews':
        return <Reviews />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <h1>404 - Page Not Found</h1>;
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" style={{ color: 'white', textAlign: 'center', padding: '16px' }}>
            Admin Panel
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            onClick={({ key }) => setSelectedKey(key)} // Update selectedKey on menu click
            items={[
              {
                key: 'dashboard',
                icon: <HomeOutlined />,
                label: 'Dashboard',
              },
              {
                key: 'properties',
                icon: <EditOutlined />,
                label: 'Properties',
              },
              {
                key: 'reviews',
                icon: <MessageOutlined />,
                label: 'Reviews',
              },
              {
                key: 'analytics',
                icon: <BarChartOutlined />,
                label: 'Analytics',
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Settings',
              },
            ]}
          />
        </Sider>

        {/* Main Content Area */}
        <Layout>
          {/* Header */}
          <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: '16px' }}>
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
              <h1 style={{ margin: 0, paddingLeft: '16px', fontSize: '24px', color: 'inherit' }}>Admin Panel</h1>
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
            {renderContent()} {/* Render content dynamically */}
          </Content>
        </Layout>
      </Layout>
    </Suspense>
  );
};

export default AdminPanel;
