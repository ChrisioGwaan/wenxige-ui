'use client'

import {
  Card,
  Descriptions,
  Tag,
  Table,
  Typography,
  Space,
  Button,
  Timeline,
  Row,
  Col,
  Divider,
} from 'antd'
import {
  ArrowLeftOutlined,
  CarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface OrderItem {
  key: string
  product: string
  variant: string
  sku: string
  unit_price: string
  quantity: number
  line_total: string
}

const mockItems: OrderItem[] = [
  { key: '1', product: 'Dragon Well Green Tea', variant: '100g', sku: 'TEA-DW-100G', unit_price: '$28.00', quantity: 2, line_total: '$56.00' },
  { key: '2', product: 'Bamboo Tea Tray', variant: 'Large', sku: 'ACC-BT-L', unit_price: '$56.00', quantity: 1, line_total: '$56.00' },
]

const itemColumns: ColumnsType<OrderItem> = [
  {
    title: 'Product',
    key: 'product',
    render: (_, r) => (
      <div>
        <Text strong>{r.product}</Text>
        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{r.variant}</Text>
      </div>
    ),
  },
  { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
  { title: 'Unit Price', dataIndex: 'unit_price', key: 'unit_price', render: (v: string) => <Text>{v}</Text> },
  { title: 'Qty', dataIndex: 'quantity', key: 'quantity', width: 60 },
  { title: 'Subtotal', dataIndex: 'line_total', key: 'line_total', render: (v: string) => <Text strong>{v}</Text> },
]

export default function OrderDetailPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/orders">
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: '#64748b' }}>
            Back to Orders
          </Button>
        </Link>
        <Divider orientation="vertical" />
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
          Order ORD-2026-04-14-8
        </Title>
        <Tag color="orange" style={{ marginLeft: 4 }}>Pending</Tag>
      </div>

      <Row gutter={[16, 16]}>
        {/* Order Items */}
        <Col span={24}>
          <Card title="Order Items" style={{ borderRadius: 12 }}>
            <Table columns={itemColumns} dataSource={mockItems} pagination={false} size="middle" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 8, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Space style={{ fontSize: 13 }}>
                <Text type="secondary">Subtotal:</Text><Text>$112.00</Text>
              </Space>
              <Space style={{ fontSize: 13 }}>
                <Text type="secondary">Shipping:</Text><Text>$12.00</Text>
              </Space>
              <Space style={{ fontSize: 13 }}>
                <Text type="secondary">Tax:</Text><Text>$0.00</Text>
              </Space>
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ fontSize: 16 }}>
                <Text strong>Total:</Text><Text strong style={{ color: '#16a34a' }}>$124.00</Text>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Customer & Shipping */}
        <Col xs={24} md={12}>
          <Card
            title={<Space><UserOutlined /> Customer</Space>}
            style={{ borderRadius: 12, height: '100%' }}
          >
            <Descriptions column={1} size="small" styles={{ label: { color: '#64748b', width: 100 } }}>
              <Descriptions.Item label="Name">Emily Chen</Descriptions.Item>
              <Descriptions.Item label="Email">emily@example.com</Descriptions.Item>
              <Descriptions.Item label="Phone">+1 415 555 0192</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={<Space><EnvironmentOutlined /> Shipping Address</Space>}
            style={{ borderRadius: 12, height: '100%' }}
          >
            <Descriptions column={1} size="small" styles={{ label: { color: '#64748b', width: 120 } }}>
              <Descriptions.Item label="Address">123 Oak Street, Apt 4B</Descriptions.Item>
              <Descriptions.Item label="City">San Francisco, CA 94102</Descriptions.Item>
              <Descriptions.Item label="Country">United States (US)</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Payment */}
        <Col xs={24} md={12}>
          <Card
            title={<Space><DollarOutlined /> Payment</Space>}
            style={{ borderRadius: 12 }}
          >
            <Descriptions column={1} size="small" styles={{ label: { color: '#64748b', width: 120 } }}>
              <Descriptions.Item label="Method">Credit Card</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="green">Paid</Tag></Descriptions.Item>
              <Descriptions.Item label="Reference">ch_3Px9AbEJR8v7Qk2</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Shipment Tracking */}
        <Col xs={24} md={12}>
          <Card
            title={<Space><CarOutlined /> Shipment</Space>}
            style={{ borderRadius: 12 }}
          >
            <Descriptions column={1} size="small" styles={{ label: { color: '#64748b', width: 120 } }}>
              <Descriptions.Item label="Status"><Tag color="orange">Pending</Tag></Descriptions.Item>
              <Descriptions.Item label="Carrier">—</Descriptions.Item>
              <Descriptions.Item label="Tracking">—</Descriptions.Item>
            </Descriptions>
            <Button
              type="dashed"
              size="small"
              icon={<CarOutlined />}
              style={{ marginTop: 12, width: '100%' }}
            >
              Add Shipment
            </Button>
          </Card>
        </Col>

        {/* Tracking Timeline */}
        <Col span={24}>
          <Card title="Order Timeline" style={{ borderRadius: 12 }}>
            <Timeline
              items={[
                { color: 'green', content: <><Text strong>Order placed</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>Apr 14, 2026 09:41 AM — Payment confirmed via credit card</Text></> },
                { color: 'blue', content: <><Text strong>Payment received</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>Apr 14, 2026 09:41 AM — $124.00 charged</Text></> },
                { color: 'gray', content: <Text type="secondary">Awaiting fulfilment…</Text> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
