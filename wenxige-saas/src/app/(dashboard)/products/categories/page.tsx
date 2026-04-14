'use client'

import { Card, Table, Button, Input, Space, Typography, Tag } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface Category {
  key: string
  name_en: string
  name_zh: string
  slug: string
  sort_order: number
  product_count: number
}

const mockCategories: Category[] = [
  { key: '1', name_en: 'Tea', name_zh: '茶叶', slug: 'tea', sort_order: 1, product_count: 24 },
  { key: '2', name_en: 'Teapot & Cups', name_zh: '茶壶茶杯', slug: 'teapot', sort_order: 2, product_count: 12 },
  { key: '3', name_en: 'Tea Accessories', name_zh: '茶具配件', slug: 'accessory', sort_order: 3, product_count: 8 },
  { key: '4', name_en: 'Chinese Painting', name_zh: '中国画', slug: 'painting', sort_order: 4, product_count: 6 },
  { key: '5', name_en: 'Tea Sets', name_zh: '茶具套装', slug: 'tea-sets', sort_order: 5, product_count: 5 },
  { key: '6', name_en: 'Gift Sets', name_zh: '礼品套装', slug: 'gift-sets', sort_order: 6, product_count: 4 },
  { key: '7', name_en: 'Tea Storage', name_zh: '茶叶罐', slug: 'tea-storage', sort_order: 7, product_count: 3 },
]

const columns: ColumnsType<Category> = [
  {
    title: 'Name',
    key: 'name',
    render: (_, r) => (
      <div>
        <Text strong>{r.name_en}</Text>
        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{r.name_zh}</Text>
      </div>
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
    width: 100,
    render: (v: number) => <Tag color="blue">{v} products</Tag>,
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

export default function CategoriesPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Categories</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Organize your product catalog</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#16a34a', borderColor: '#16a34a' }}>
          Add Category
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Input
          placeholder="Search categories..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          style={{ maxWidth: 300, marginBottom: 16 }}
        />
        <Table columns={columns} dataSource={mockCategories} pagination={false} size="middle" />
      </Card>
    </div>
  )
}
