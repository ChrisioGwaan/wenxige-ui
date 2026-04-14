'use client'

import { Card, Row, Col, Statistic, Table, Tag, Typography, Space } from 'antd'
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  MessageOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface RecentOrder {
  key: string
  orderNumber: string
  customer: string
  total: string
  status: string
  date: string
}

const recentOrders: RecentOrder[] = [
  {
    key: '1',
    orderNumber: 'ORD-2026-04-14-8',
    customer: 'Emily Chen',
    total: '$89.50',
    status: 'pending',
    date: 'Apr 14, 2026',
  },
  {
    key: '2',
    orderNumber: 'ORD-2026-04-14-7',
    customer: 'Michael Wang',
    total: '$156.00',
    status: 'processing',
    date: 'Apr 14, 2026',
  },
  {
    key: '3',
    orderNumber: 'ORD-2026-04-13-12',
    customer: 'Sarah Williams',
    total: '$234.80',
    status: 'shipped',
    date: 'Apr 13, 2026',
  },
  {
    key: '4',
    orderNumber: 'ORD-2026-04-13-11',
    customer: 'David Liu',
    total: '$67.20',
    status: 'delivered',
    date: 'Apr 13, 2026',
  },
  {
    key: '5',
    orderNumber: 'ORD-2026-04-13-10',
    customer: 'Emma Johnson',
    total: '$345.00',
    status: 'processing',
    date: 'Apr 13, 2026',
  },
]

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: 'Pending' },
  processing: { color: 'blue', label: 'Processing' },
  shipped: { color: 'cyan', label: 'Shipped' },
  delivered: { color: 'green', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' },
}

const columns: ColumnsType<RecentOrder> = [
  {
    title: 'Order',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
    render: (v: string) => (
      <Text strong style={{ fontFamily: 'monospace', fontSize: 12 }}>
        {v}
      </Text>
    ),
  },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (v: string) => <Text strong>{v}</Text>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (v: string) => {
      const cfg = statusConfig[v] ?? { color: 'default', label: v }
      return <Tag color={cfg.color}>{cfg.label}</Tag>
    },
  },
  { title: 'Date', dataIndex: 'date', key: 'date', render: (v: string) => <Text type="secondary">{v}</Text> },
]

const statCards = [
  {
    title: 'Total Products',
    value: 48,
    icon: <ShoppingOutlined style={{ fontSize: 22, color: '#16a34a' }} />,
    bg: '#f0fdf4',
    border: '#bbf7d0',
    suffix: '',
    desc: '6 added this month',
  },
  {
    title: 'Total Orders',
    value: 124,
    icon: <ShoppingCartOutlined style={{ fontSize: 22, color: '#2563eb' }} />,
    bg: '#eff6ff',
    border: '#bfdbfe',
    suffix: '',
    desc: '18 this week',
  },
  {
    title: 'Pending Orders',
    value: 23,
    icon: <ClockCircleOutlined style={{ fontSize: 22, color: '#d97706' }} />,
    bg: '#fffbeb',
    border: '#fde68a',
    suffix: '',
    desc: 'Needs attention',
  },
  {
    title: 'Monthly Revenue',
    value: 8470,
    icon: <DollarOutlined style={{ fontSize: 22, color: '#7c3aed' }} />,
    bg: '#faf5ff',
    border: '#e9d5ff',
    prefix: '$',
    suffix: '',
    desc: '+12% vs last month',
  },
  {
    title: 'New Inquiries',
    value: 12,
    icon: <MessageOutlined style={{ fontSize: 22, color: '#db2777' }} />,
    bg: '#fdf2f8',
    border: '#fbcfe8',
    suffix: '',
    desc: '3 awaiting reply',
  },
  {
    title: 'Active Categories',
    value: 7,
    icon: <RiseOutlined style={{ fontSize: 22, color: '#0891b2' }} />,
    bg: '#ecfeff',
    border: '#a5f3fc',
    suffix: '',
    desc: 'Tea, Teapot, Painting…',
  },
]

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
          Dashboard
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Welcome back! Here's what's happening with your store.
        </Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} lg={8} key={card.title}>
            <Card
              style={{
                border: `1px solid ${card.border}`,
                background: card.bg,
                borderRadius: 12,
              }}
              styles={{ body: { padding: '20px 24px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {card.title}
                  </Text>
                  <Statistic
                    value={card.value}
                    prefix={card.prefix}
                    styles={{ content: { fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 } }}
                  />
                  <Text style={{ fontSize: 12, color: '#64748b' }}>{card.desc}</Text>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Orders */}
      <Card
        title={
          <Space>
            <ShoppingCartOutlined />
            <span>Recent Orders</span>
          </Space>
        }
        extra={
          <a href="/orders" style={{ color: '#16a34a', fontSize: 13 }}>
            View all →
          </a>
        }
        style={{ borderRadius: 12 }}
      >
        <Table
          columns={columns}
          dataSource={recentOrders}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}
