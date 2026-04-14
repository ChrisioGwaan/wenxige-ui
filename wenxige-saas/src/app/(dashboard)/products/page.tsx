'use client'

import { Card, Table, Tag, Button, Input, Space, Typography, Select, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface Product {
  key: string
  name_en: string
  name_zh: string
  category: string
  brand: string
  price: string
  stock_qty: number
  sku: string
  is_active: boolean
  is_featured: boolean
}

const mockProducts: Product[] = [
  { key: '1', name_en: 'Dragon Well Green Tea', name_zh: '西湖龙井', category: 'Tea', brand: 'Wenxige', price: '$28.00', stock_qty: 45, sku: 'TEA-DW-50G', is_active: true, is_featured: true },
  { key: '2', name_en: 'Aged Pu-erh Tea Cake', name_zh: '普洱茶饼', category: 'Tea', brand: 'Wenxige', price: '$89.00', stock_qty: 12, sku: 'TEA-PE-357G', is_active: true, is_featured: true },
  { key: '3', name_en: 'Tieguanyin Oolong Tea', name_zh: '铁观音', category: 'Tea', brand: 'Wenxige', price: '$45.00', stock_qty: 28, sku: 'TEA-TGY-100G', is_active: true, is_featured: false },
  { key: '4', name_en: 'Yixing Zisha Teapot', name_zh: '宜兴紫砂壶', category: 'Teapot', brand: 'Yixing Craft', price: '$185.00', stock_qty: 8, sku: 'POT-YX-200ML', is_active: true, is_featured: true },
  { key: '5', name_en: 'White Porcelain Gaiwan', name_zh: '白瓷盖碗', category: 'Teapot', brand: 'Jingdezhen', price: '$42.00', stock_qty: 22, sku: 'POT-GW-150ML', is_active: true, is_featured: false },
  { key: '6', name_en: 'Bamboo Tea Tray', name_zh: '竹制茶盘', category: 'Accessory', brand: 'Wenxige', price: '$56.00', stock_qty: 15, sku: 'ACC-BT-L', is_active: true, is_featured: false },
  { key: '7', name_en: 'Chinese Ink Landscape Painting', name_zh: '山水水墨画', category: 'Painting', brand: 'Original Art', price: '$280.00', stock_qty: 3, sku: 'ART-INK-01', is_active: true, is_featured: true },
  { key: '8', name_en: 'Jasmine Silver Needle White Tea', name_zh: '茉莉银针', category: 'Tea', brand: 'Wenxige', price: '$68.00', stock_qty: 18, sku: 'TEA-JAS-50G', is_active: true, is_featured: false },
  { key: '9', name_en: 'Phoenix Dan Cong Oolong', name_zh: '凤凰单枞', category: 'Tea', brand: 'Wenxige', price: '$55.00', stock_qty: 0, sku: 'TEA-PDC-100G', is_active: false, is_featured: false },
  { key: '10', name_en: 'Celadon Ceramic Cup Set', name_zh: '青瓷茶杯套装', category: 'Teapot', brand: 'Longquan', price: '$98.00', stock_qty: 10, sku: 'CUP-CEL-SET4', is_active: true, is_featured: false },
]

const columns: ColumnsType<Product> = [
  {
    title: 'Product',
    key: 'product',
    render: (_, r) => (
      <div>
        <Text strong style={{ display: 'block' }}>{r.name_en}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>{r.name_zh}</Text>
      </div>
    ),
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text>,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (v: string) => <Tag>{v}</Tag>,
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
    render: (v: string) => <Text type="secondary">{v}</Text>,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (v: string) => <Text strong>{v}</Text>,
  },
  {
    title: 'Stock',
    dataIndex: 'stock_qty',
    key: 'stock_qty',
    render: (v: number) => (
      <Tag color={v === 0 ? 'red' : v < 10 ? 'orange' : 'green'}>
        {v === 0 ? 'Out of stock' : `${v} in stock`}
      </Tag>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    render: (_, r) => (
      <Space size={4}>
        <Tag color={r.is_active ? 'green' : 'default'}>
          {r.is_active ? 'Active' : 'Inactive'}
        </Tag>
        {r.is_featured && <Tag color="gold">Featured</Tag>}
      </Space>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <Space>
        <Button type="link" size="small" style={{ padding: 0, color: '#16a34a' }}>
          Edit
        </Button>
        <Button type="link" size="small" danger style={{ padding: 0 }}>
          Delete
        </Button>
      </Space>
    ),
  },
]

export default function ProductsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Products</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage your product catalog
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#16a34a', borderColor: '#16a34a' }}
        >
          Add Product
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ maxWidth: 320 }}
            />
          </Col>
          <Col>
            <Select placeholder="All Categories" style={{ width: 160 }} allowClear>
              <Select.Option value="Tea">Tea</Select.Option>
              <Select.Option value="Teapot">Teapot</Select.Option>
              <Select.Option value="Painting">Painting</Select.Option>
              <Select.Option value="Accessory">Accessory</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select placeholder="All Status" style={{ width: 140 }} allowClear>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="featured">Featured</Select.Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={mockProducts}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="middle"
        />
      </Card>
    </div>
  )
}
