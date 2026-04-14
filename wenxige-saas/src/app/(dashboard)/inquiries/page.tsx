'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Input, Space, Typography, Tabs, Row, Col, Spin } from 'antd'
import { SearchOutlined, MailOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'

const { Title, Text } = Typography

interface Inquiry {
  id: string
  name: string | null
  email: string | null
  subject: string | null
  message: string | null
  status: string
  created_at: string
}

const statusConfig: Record<string, { color: string; label: string }> = {
  new: { color: 'blue', label: 'New' },
  read: { color: 'orange', label: 'Read' },
  replied: { color: 'green', label: 'Replied' },
  archived: { color: 'default', label: 'Archived' },
}

const fmtDate = (v: string | null) =>
  v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const columns: ColumnsType<Inquiry> = [
  {
    title: 'From',
    key: 'from',
    render: (_, r) => (
      <div>
        <Text strong style={{ display: 'block' }}>{r.name ?? '—'}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
      </div>
    ),
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject',
    render: (v: string | null) => <Text>{v ?? '—'}</Text>,
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
    responsive: ['sm'],
    render: (v: string) => <Text type="secondary">{fmtDate(v)}</Text>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: () => (
      <Space>
        <Button type="link" size="small" icon={<MailOutlined />} style={{ padding: 0, color: '#9AB17A' }}>
          Reply
        </Button>
        <Button type="link" size="small" style={{ padding: 0, color: '#64748b' }}>
          Archive
        </Button>
      </Space>
    ),
  },
]

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data } = await supabase
        .from('contact_inquiry')
        .select('id, name, email, subject, message, status, created_at')
        .eq('del_flag', false)
        .order('created_at', { ascending: false })
      setInquiries(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const counts = useMemo(() => ({
    all: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    archived: inquiries.filter(i => i.status === 'archived').length,
  }), [inquiries])

  const displayData = useMemo(() => {
    let list = inquiries
    if (activeTab !== 'all') list = list.filter(i => i.status === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i =>
        i.name?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q) ||
        i.subject?.toLowerCase().includes(q)
      )
    }
    return list
  }, [inquiries, activeTab, search])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Spin size="large" />
      </div>
    )
  }

  const tabItems = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'new', label: `New (${counts.new})` },
    { key: 'read', label: 'Read' },
    { key: 'replied', label: 'Replied' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Customer Inquiries</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Messages from your store's contact form</Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} md={14}>
            <Input
              placeholder="Search by name, email or subject..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(tab => ({
            key: tab.key,
            label: tab.label,
            children: (
              <Table
                columns={columns}
                dataSource={displayData}
                rowKey="id"
                pagination={{ pageSize: 8, showTotal: (total) => `${total} inquiries` }}
                size="middle"
                scroll={{ x: 'max-content' }}
              />
            ),
          }))}
        />
      </Card>
    </div>
  )
}

