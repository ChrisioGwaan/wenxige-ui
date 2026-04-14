'use client'

import { Card, Table, Button, Input, Space, Typography, Tag, Avatar } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface Brand {
  key: string
  name_en: string
  name_zh: string
  slug: string
  sort_order: number
  product_count: number
}

const mockBrands: Brand[] = [
  { key: '1', name_en: 'Wenxige', name_zh: '文喜阁', slug: 'wenxige', sort_order: 1, product_count: 28 },
  { key: '2', name_en: 'Yixing Craft', name_zh: '宜兴工艺', slug: 'yixing-craft', sort_order: 2, product_count: 9 },
  { key: '3', name_en: 'Jingdezhen', name_zh: '景德镇', slug: 'jingdezhen', sort_order: 3, product_count: 7 },
  { key: '4', name_en: 'Longquan Celadon', name_zh: '龙泉青瓷', slug: 'longquan', sort_order: 4, product_count: 5 },
  { key: '5', name_en: 'Original Art', name_zh: '原创艺术', slug: 'original-art', sort_order: 5, product_count: 4 },
]

const columns: ColumnsType<Brand> = [
  {
    title: 'Brand',
    key: 'brand',
    render: (_, r) => (
      <Space>
        <Avatar
          size={36}
          style={{ background: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: 14 }}
        >
          {r.name_en[0]}
        </Avatar>
        <div>
          <Text strong>{r.name_en}</Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{r.name_zh}</Text>
        </div>
      </Space>
    ),
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
    key: 'slug',
    render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text>,
  },
  {
    title: 'Sort',
    dataIndex: 'sort_order',
    key: 'sort_order',
    width: 80,
    render: (v: number) => <Text type="secondary">{v}</Text>,
  },
  {
    title: 'Products',
    dataIndex: 'product_count',
    key: 'product_count',
    width: 110,
    render: (v: number) => <Tag color="green">{v} products</Tag>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    render: () => (
      <Space>
        <Button type="link" size="small" style={{ padding: 0, color: '#16a34a' }}>Edit</Button>
        <Button type="link" size="small" danger style={{ padding: 0 }}>Delete</Button>
      </Space>
    ),
  },
]

export default function BrandsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Brands</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Manage product brands and suppliers</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#16a34a', borderColor: '#16a34a' }}>
          Add Brand
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Input
          placeholder="Search brands..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          style={{ maxWidth: 300, marginBottom: 16 }}
        />
        <Table columns={columns} dataSource={mockBrands} pagination={false} size="middle" />
      </Card>
    </div>
  )
}
