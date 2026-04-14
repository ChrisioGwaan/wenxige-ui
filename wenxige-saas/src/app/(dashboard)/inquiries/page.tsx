'use client'

import { Card, Table, Tag, Button, Input, Space, Typography, Tabs, Row, Col } from 'antd'
import { SearchOutlined, MailOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface Inquiry {
  key: string
  name: string
  email: string
  subject: string
  status: string
  created_at: string
}

const mockInquiries: Inquiry[] = [
  { key: '1', name: 'Amelia Scott', email: 'amelia.s@example.com', subject: 'Wholesale pricing for tea sets', status: 'new', created_at: 'Apr 14, 2026' },
  { key: '2', name: 'James Turner', email: 'jturner@example.com', subject: 'Custom engraving on teapot', status: 'new', created_at: 'Apr 14, 2026' },
  { key: '3', name: 'Mei Lin', email: 'meilin@example.com', subject: 'International shipping to Taiwan', status: 'read', created_at: 'Apr 13, 2026' },
  { key: '4', name: 'Robert Clarke', email: 'rob.c@example.com', subject: 'Certificate of authenticity', status: 'replied', created_at: 'Apr 12, 2026' },
  { key: '5', name: 'Sophie Dubois', email: 'sdubois@example.com', subject: 'Returns policy question', status: 'replied', created_at: 'Apr 11, 2026' },
  { key: '6', name: 'Hassan Ali', email: 'hassan.a@example.com', subject: 'Order ORD-2026-04-10-3 delivery delay', status: 'read', created_at: 'Apr 10, 2026' },
  { key: '7', name: 'Isabella Rossi', email: 'irossi@example.com', subject: 'Gift wrapping options', status: 'archived', created_at: 'Apr 8, 2026' },
  { key: '8', name: 'Tom Nguyen', email: 'tnguyen@example.com', subject: 'Partnership inquiry', status: 'new', created_at: 'Apr 14, 2026' },
]

const statusConfig: Record<string, { color: string; label: string }> = {
  new: { color: 'blue', label: 'New' },
  read: { color: 'orange', label: 'Read' },
  replied: { color: 'green', label: 'Replied' },
  archived: { color: 'default', label: 'Archived' },
}

const columns: ColumnsType<Inquiry> = [
  {
    title: 'From',
    key: 'from',
    render: (_, r) => (
      <div>
        <Text strong style={{ display: 'block' }}>{r.name}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
      </div>
    ),
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject',
    render: (v: string) => <Text>{v}</Text>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    render: (v: string) => {
      const cfg = statusConfig[v] ?? { color: 'default', label: v }
      return <Tag color={cfg.color}>{cfg.label}</Tag>
    },
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 120,
    render: (v: string) => <Text type="secondary">{v}</Text>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: () => (
      <Space>
        <Button
          type="link"
          size="small"
          icon={<MailOutlined />}
          style={{ padding: 0, color: '#16a34a' }}
        >
          Reply
        </Button>
        <Button type="link" size="small" style={{ padding: 0, color: '#64748b' }}>
          Archive
        </Button>
      </Space>
    ),
  },
]

const tabItems = [
  {
    key: 'all',
    label: `All (${mockInquiries.length})`,
    data: mockInquiries,
  },
  {
    key: 'new',
    label: `New (${mockInquiries.filter((i) => i.status === 'new').length})`,
    data: mockInquiries.filter((i) => i.status === 'new'),
  },
  {
    key: 'read',
    label: 'Read',
    data: mockInquiries.filter((i) => i.status === 'read'),
  },
  {
    key: 'replied',
    label: 'Replied',
    data: mockInquiries.filter((i) => i.status === 'replied'),
  },
  {
    key: 'archived',
    label: 'Archived',
    data: mockInquiries.filter((i) => i.status === 'archived'),
  },
]

export default function InquiriesPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Customer Inquiries</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Messages from your store's contact form</Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <Input
              placeholder="Search by name, email or subject..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ maxWidth: 360 }}
            />
          </Col>
        </Row>

        <Tabs
          defaultActiveKey="all"
          items={tabItems.map((tab) => ({
            key: tab.key,
            label: tab.label,
            children: (
              <Table
                columns={columns}
                dataSource={tab.data}
                pagination={{ pageSize: 8, showTotal: (total) => `${total} inquiries` }}
                size="middle"
              />
            ),
          }))}
        />
      </Card>
    </div>
  )
}
