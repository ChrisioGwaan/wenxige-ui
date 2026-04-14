'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Input, Space, Typography, Select, Row, Col, Spin } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import Link from 'next/link'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'

const { Title, Text } = Typography

interface Order {
  id: string
  order_number: string
  first_name: string | null
  last_name: string | null
  email: string | null
  country: string | null
  total: number | null
  order_status: string
  payment_status: string
  created_at: string
}

const fmtDate = (v: string | null) =>
  v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const fmtCurrency = (amount: number | null) =>
  amount != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) : '—'

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

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [paymentFilter, setPaymentFilter] = useState<string | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data } = await supabase
        .from('order')
        .select('id, order_number, first_name, last_name, email, country, total, order_status, payment_status, created_at')
        .order('created_at', { ascending: false })
      setAllOrders(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return allOrders.filter((o) => {
      if (q && !o.order_number.toLowerCase().includes(q) && !(o.email ?? '').toLowerCase().includes(q)) return false
      if (statusFilter && o.order_status !== statusFilter) return false
      if (paymentFilter && o.payment_status !== paymentFilter) return false
      return true
    })
  }, [allOrders, search, statusFilter, paymentFilter])

  const columns: ColumnsType<Order> = [
    {
      title: 'Order #',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (v: string, r) => (
        <Link href={`/orders/${r.id}`} style={{ color: '#9AB17A', fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
          {v}
        </Link>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, r) => (
        <div>
          <Text strong style={{ display: 'block' }}>
            {[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
        </div>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 80,
      responsive: ['sm'],
      render: (v: string | null) => v ? <Tag>{v}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v: number | null) => <Text strong>{fmtCurrency(v)}</Text>,
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
      responsive: ['lg'],
      render: (v: string) => {
        const cfg = paymentStatusConfig[v] ?? { color: 'default', label: v }
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
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, r) => (
        <Link href={`/orders/${r.id}`}>
          <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: '#9AB17A' }} />
        </Link>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Orders</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Track and manage customer orders</Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Search by order # or customer email..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="All Statuses"
              style={{ width: '100%' }}
              allowClear
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="processing">Processing</Select.Option>
              <Select.Option value="shipped">Shipped</Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Payment"
              style={{ width: '100%' }}
              allowClear
              value={paymentFilter}
              onChange={(v) => setPaymentFilter(v)}
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="refunded">Refunded</Select.Option>
            </Select>
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={{ pageSize: 10, showTotal: (total) => `${total} orders` }}
            size="middle"
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
    </div>
  )
}
