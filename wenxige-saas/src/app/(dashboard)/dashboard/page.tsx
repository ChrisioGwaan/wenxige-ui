'use client'

import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Typography, Space, Spin } from 'antd'
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  MessageOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'

const { Title, Text } = Typography

interface RecentOrder {
  id: string
  order_number: string
  first_name: string | null
  last_name: string | null
  total: number | null
  order_status: string
  created_at: string
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: 'Pending' },
  processing: { color: 'blue', label: 'Processing' },
  shipped: { color: 'cyan', label: 'Shipped' },
  delivered: { color: 'green', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' },
}

const fmtDate = (v: string | null) =>
  v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const fmtCurrency = (amount: number | null, currency = 'USD') =>
  amount != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount) : '—'

const columns: ColumnsType<RecentOrder> = [
  {
    title: 'Order',
    dataIndex: 'order_number',
    key: 'order_number',
    render: (v: string) => (
      <Text strong style={{ fontFamily: 'monospace', fontSize: 12 }}>
        {v}
      </Text>
    ),
  },
  {
    title: 'Customer',
    key: 'customer',
    render: (_, r) => <Text>{[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'}</Text>,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (v: number | null) => <Text strong>{fmtCurrency(v)}</Text>,
  },
  {
    title: 'Status',
    dataIndex: 'order_status',
    key: 'order_status',
    render: (v: string) => {
      const cfg = statusConfig[v] ?? { color: 'default', label: v }
      return <Tag color={cfg.color}>{cfg.label}</Tag>
    },
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    responsive: ['md'],
    render: (v: string) => <Text type="secondary">{fmtDate(v)}</Text>,
  },
]

interface Stats {
  productCount: number
  orderCount: number
  pendingCount: number
  revenue: number
  inquiryCount: number
  categoryCount: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    productCount: 0, orderCount: 0, pendingCount: 0,
    revenue: 0, inquiryCount: 0, categoryCount: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const [
        { count: productCount },
        { count: orderCount },
        { count: pendingCount },
        { data: paidOrders },
        { count: inquiryCount },
        { count: categoryCount },
        { data: recent },
      ] = await Promise.all([
        supabase.from('product').select('*', { count: 'exact', head: true }).eq('del_flag', false),
        supabase.from('order').select('*', { count: 'exact', head: true }),
        supabase.from('order').select('*', { count: 'exact', head: true }).eq('order_status', 'pending'),
        supabase.from('order').select('total').eq('payment_status', 'paid').gte('created_at', startOfMonth.toISOString()),
        supabase.from('contact_inquiry').select('*', { count: 'exact', head: true }),
        supabase.from('category').select('*', { count: 'exact', head: true }),
        supabase.from('order').select('id, order_number, first_name, last_name, total, order_status, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      const revenue = (paidOrders ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0)
      setStats({
        productCount: productCount ?? 0,
        orderCount: orderCount ?? 0,
        pendingCount: pendingCount ?? 0,
        revenue,
        inquiryCount: inquiryCount ?? 0,
        categoryCount: categoryCount ?? 0,
      })
      setRecentOrders(recent ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    {
      title: 'Total Products',
      value: stats.productCount,
      icon: <ShoppingOutlined style={{ fontSize: 22, color: '#9AB17A' }} />,
      bg: '#f2f6ec',
      border: '#C3CC9B',
      prefix: undefined as string | undefined,
      precision: undefined as number | undefined,
      desc: 'Active products in catalog',
    },
    {
      title: 'Total Orders',
      value: stats.orderCount,
      icon: <ShoppingCartOutlined style={{ fontSize: 22, color: '#7a9460' }} />,
      bg: '#f5f0e4',
      border: '#d4c9a0',
      prefix: undefined as string | undefined,
      precision: undefined as number | undefined,
      desc: 'All-time orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingCount,
      icon: <ClockCircleOutlined style={{ fontSize: 22, color: '#c49060' }} />,
      bg: '#fdf5e4',
      border: '#f0d490',
      prefix: undefined as string | undefined,
      precision: undefined as number | undefined,
      desc: 'Awaiting fulfilment',
    },
    {
      title: 'Monthly Revenue',
      value: stats.revenue,
      icon: <DollarOutlined style={{ fontSize: 22, color: '#9AB17A' }} />,
      bg: '#f2f6ec',
      border: '#C3CC9B',
      prefix: '$' as string | undefined,
      precision: 2 as number | undefined,
      desc: 'Paid orders this month',
    },
    {
      title: 'New Inquiries',
      value: stats.inquiryCount,
      icon: <MessageOutlined style={{ fontSize: 22, color: '#b87858' }} />,
      bg: '#fdf3e8',
      border: '#FBE8CE',
      prefix: undefined as string | undefined,
      precision: undefined as number | undefined,
      desc: 'Customer messages',
    },
    {
      title: 'Active Categories',
      value: stats.categoryCount,
      icon: <RiseOutlined style={{ fontSize: 22, color: '#7a9460' }} />,
      bg: '#f5f0e4',
      border: '#E4DFB5',
      prefix: undefined as string | undefined,
      precision: undefined as number | undefined,
      desc: 'Product categories',
    },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Spin size="large" />
      </div>
    )
  }

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
                    precision={card.precision}
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
          <a href="/orders" style={{ color: '#9AB17A', fontSize: 13 }}>
            View all →
          </a>
        }
        style={{ borderRadius: 12 }}
      >
        <Table
          columns={columns}
          dataSource={recentOrders}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  )
}
