'use client'

import { Card, Table, Tag, Button, Input, Space, Typography, Select, Row, Col } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import Link from 'next/link'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface Order {
  key: string
  order_number: string
  customer: string
  email: string
  country: string
  total: string
  order_status: string
  payment_status: string
  created_at: string
}

const mockOrders: Order[] = [
  { key: '1', order_number: 'ORD-2026-04-14-8', customer: 'Emily Chen', email: 'emily@example.com', country: 'US', total: '$89.50', order_status: 'pending', payment_status: 'paid', created_at: 'Apr 14, 2026' },
  { key: '2', order_number: 'ORD-2026-04-14-7', customer: 'Michael Wang', email: 'mwang@example.com', country: 'CA', total: '$156.00', order_status: 'processing', payment_status: 'paid', created_at: 'Apr 14, 2026' },
  { key: '3', order_number: 'ORD-2026-04-13-12', customer: 'Sarah Williams', email: 'sarah.w@example.com', country: 'GB', total: '$234.80', order_status: 'shipped', payment_status: 'paid', created_at: 'Apr 13, 2026' },
  { key: '4', order_number: 'ORD-2026-04-13-11', customer: 'David Liu', email: 'dliu@example.com', country: 'AU', total: '$67.20', order_status: 'delivered', payment_status: 'paid', created_at: 'Apr 13, 2026' },
  { key: '5', order_number: 'ORD-2026-04-13-10', customer: 'Emma Johnson', email: 'emma.j@example.com', country: 'US', total: '$345.00', order_status: 'processing', payment_status: 'paid', created_at: 'Apr 13, 2026' },
  { key: '6', order_number: 'ORD-2026-04-12-9', customer: 'Liam Park', email: 'lpark@example.com', country: 'SG', total: '$128.00', order_status: 'shipped', payment_status: 'paid', created_at: 'Apr 12, 2026' },
  { key: '7', order_number: 'ORD-2026-04-12-8', customer: 'Olivia Brown', email: 'obrown@example.com', country: 'US', total: '$72.50', order_status: 'cancelled', payment_status: 'refunded', created_at: 'Apr 12, 2026' },
  { key: '8', order_number: 'ORD-2026-04-11-7', customer: 'Noah Tanaka', email: 'ntanaka@example.com', country: 'JP', total: '$198.00', order_status: 'delivered', payment_status: 'paid', created_at: 'Apr 11, 2026' },
  { key: '9', order_number: 'ORD-2026-04-11-6', customer: 'Ava Martinez', email: 'ava.m@example.com', country: 'MX', total: '$54.00', order_status: 'pending', payment_status: 'pending', created_at: 'Apr 11, 2026' },
  { key: '10', order_number: 'ORD-2026-04-10-5', customer: 'Lucas Zhou', email: 'lzhou@example.com', country: 'CN', total: '$420.00', order_status: 'delivered', payment_status: 'paid', created_at: 'Apr 10, 2026' },
]

const orderStatusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: 'Pending' },
  processing: { color: 'blue', label: 'Processing' },
  shipped: { color: 'cyan', label: 'Shipped' },
  delivered: { color: 'green', label: 'Delivered' },
  cancelled: { color: 'red', label: 'Cancelled' },
}

const paymentStatusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: 'Pending' },
  paid: { color: 'green', label: 'Paid' },
  failed: { color: 'red', label: 'Failed' },
  refunded: { color: 'purple', label: 'Refunded' },
}

const columns: ColumnsType<Order> = [
  {
    title: 'Order #',
    dataIndex: 'order_number',
    key: 'order_number',
    render: (v: string, r) => (
      <Link href={`/orders/${r.key}`} style={{ color: '#16a34a', fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
        {v}
      </Link>
    ),
  },
  {
    title: 'Customer',
    key: 'customer',
    render: (_, r) => (
      <div>
        <Text strong style={{ display: 'block' }}>{r.customer}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
      </div>
    ),
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    width: 80,
    render: (v: string) => <Tag>{v}</Tag>,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (v: string) => <Text strong>{v}</Text>,
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    render: (v: string) => {
      const cfg = orderStatusConfig[v] ?? { color: 'default', label: v }
      return <Tag color={cfg.color}>{cfg.label}</Tag>
    },
  },
  {
    title: 'Payment',
    dataIndex: 'payment_status',
    key: 'payment_status',
    render: (v: string) => {
      const cfg = paymentStatusConfig[v] ?? { color: 'default', label: v }
      return <Tag color={cfg.color}>{cfg.label}</Tag>
    },
  },
  { title: 'Date', dataIndex: 'created_at', key: 'created_at', render: (v: string) => <Text type="secondary">{v}</Text> },
  {
    title: '',
    key: 'actions',
    width: 60,
    render: (_, r) => (
      <Link href={`/orders/${r.key}`}>
        <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: '#16a34a' }} />
      </Link>
    ),
  },
]

export default function OrdersPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Orders</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Track and manage customer orders</Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Search by order # or customer email..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ maxWidth: 360 }}
            />
          </Col>
          <Col>
            <Select placeholder="All Statuses" style={{ width: 160 }} allowClear>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="processing">Processing</Select.Option>
              <Select.Option value="shipped">Shipped</Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select placeholder="Payment" style={{ width: 130 }} allowClear>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="refunded">Refunded</Select.Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={mockOrders}
          pagination={{ pageSize: 10, showTotal: (total) => `${total} orders` }}
          size="middle"
        />
      </Card>
    </div>
  )
}
