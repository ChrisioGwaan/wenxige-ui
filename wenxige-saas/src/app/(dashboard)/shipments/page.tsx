'use client'

import { Card, Table, Tag, Button, Input, Space, Typography, Select, Row, Col } from 'antd'
import { SearchOutlined, LinkOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface Shipment {
  key: string
  order_number: string
  carrier: string
  tracking_number: string
  status: string
  estimated_delivery: string
  shipped_at: string
  delivered_at: string
}

const mockShipments: Shipment[] = [
  { key: '1', order_number: 'ORD-2026-04-13-12', carrier: 'EMS', tracking_number: 'EE123456789CN', status: 'in_transit', estimated_delivery: 'Apr 20, 2026', shipped_at: 'Apr 13, 2026', delivered_at: '—' },
  { key: '2', order_number: 'ORD-2026-04-12-9', carrier: 'SF Express', tracking_number: 'SF1234567890', status: 'out_for_delivery', estimated_delivery: 'Apr 14, 2026', shipped_at: 'Apr 12, 2026', delivered_at: '—' },
  { key: '3', order_number: 'ORD-2026-04-11-7', carrier: 'DHL', tracking_number: '1234567890', status: 'delivered', estimated_delivery: 'Apr 14, 2026', shipped_at: 'Apr 11, 2026', delivered_at: 'Apr 14, 2026' },
  { key: '4', order_number: 'ORD-2026-04-10-5', carrier: 'UPS', tracking_number: '1Z999AA10123456784', status: 'delivered', estimated_delivery: 'Apr 14, 2026', shipped_at: 'Apr 10, 2026', delivered_at: 'Apr 13, 2026' },
  { key: '5', order_number: 'ORD-2026-04-08-4', carrier: 'FedEx', tracking_number: '783529452936', status: 'delivered', estimated_delivery: 'Apr 12, 2026', shipped_at: 'Apr 8, 2026', delivered_at: 'Apr 12, 2026' },
  { key: '6', order_number: 'ORD-2026-04-15-1', carrier: 'EMS', tracking_number: '—', status: 'pending', estimated_delivery: '—', shipped_at: '—', delivered_at: '—' },
]

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'default', label: 'Pending' },
  picked_up: { color: 'blue', label: 'Picked Up' },
  in_transit: { color: 'cyan', label: 'In Transit' },
  out_for_delivery: { color: 'purple', label: 'Out for Delivery' },
  delivered: { color: 'green', label: 'Delivered' },
  exception: { color: 'red', label: 'Exception' },
  returned: { color: 'orange', label: 'Returned' },
}

const carrierColors: Record<string, string> = {
  EMS: 'blue',
  'SF Express': 'orange',
  DHL: 'red',
  UPS: 'gold',
  FedEx: 'purple',
  'China Post': 'cyan',
}

const columns: ColumnsType<Shipment> = [
  {
    title: 'Order #',
    dataIndex: 'order_number',
    key: 'order_number',
    render: (v: string) => (
      <Text style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{v}</Text>
    ),
  },
  {
    title: 'Carrier',
    dataIndex: 'carrier',
    key: 'carrier',
    render: (v: string) => <Tag color={carrierColors[v] ?? 'default'}>{v}</Tag>,
  },
  {
    title: 'Tracking #',
    dataIndex: 'tracking_number',
    key: 'tracking_number',
    render: (v: string) =>
      v !== '—' ? (
        <Space>
          <Text code style={{ fontSize: 11 }}>{v}</Text>
          <Button type="text" size="small" icon={<LinkOutlined />} style={{ color: '#16a34a', padding: 0 }} />
        </Space>
      ) : (
        <Text type="secondary">—</Text>
      ),
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
  {
    title: 'Est. Delivery',
    dataIndex: 'estimated_delivery',
    key: 'estimated_delivery',
    render: (v: string) => <Text type="secondary">{v}</Text>,
  },
  {
    title: 'Shipped',
    dataIndex: 'shipped_at',
    key: 'shipped_at',
    render: (v: string) => <Text type="secondary">{v}</Text>,
  },
  {
    title: 'Delivered',
    dataIndex: 'delivered_at',
    key: 'delivered_at',
    render: (v: string) => (
      <Text style={{ color: v !== '—' ? '#16a34a' : '#94a3b8' }}>{v}</Text>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: () => (
      <Space>
        <Button type="link" size="small" style={{ padding: 0, color: '#16a34a' }}>Update</Button>
      </Space>
    ),
  },
]

export default function ShipmentsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Shipments</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Track all outgoing shipments</Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Search by order # or tracking number..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ maxWidth: 360 }}
            />
          </Col>
          <Col>
            <Select placeholder="All Carriers" style={{ width: 150 }} allowClear>
              <Select.Option value="EMS">EMS</Select.Option>
              <Select.Option value="SF Express">SF Express</Select.Option>
              <Select.Option value="DHL">DHL</Select.Option>
              <Select.Option value="UPS">UPS</Select.Option>
              <Select.Option value="FedEx">FedEx</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select placeholder="All Status" style={{ width: 170 }} allowClear>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="in_transit">In Transit</Select.Option>
              <Select.Option value="out_for_delivery">Out for Delivery</Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
              <Select.Option value="exception">Exception</Select.Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={mockShipments}
          pagination={{ pageSize: 10, showTotal: (total) => `${total} shipments` }}
          size="middle"
        />
      </Card>
    </div>
  )
}
