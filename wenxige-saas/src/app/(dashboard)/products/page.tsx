'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Input, Space, Typography, Select, Row, Col, Spin } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'

const { Title, Text } = Typography

interface Product {
  id: string
  name_en: string | null
  name_zh: string | null
  category_id: string | null
  brand_id: string | null
  price: number | null
  stock_qty: number | null
  sku: string | null
  is_active: boolean
  is_featured: boolean
  del_flag: boolean
}

const fmtCurrency = (amount: number | null) =>
  amount != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) : '—'


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [catMap, setCatMap] = useState<Map<string, string>>(new Map())
  const [brandMap, setBrandMap] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [{ data: prods }, { data: cats }, { data: brands }] = await Promise.all([
        supabase.from('product').select('id, name_en, name_zh, category_id, brand_id, price, stock_qty, sku, is_active, is_featured, del_flag').eq('del_flag', false),
        supabase.from('category').select('id, name_en'),
        supabase.from('brand').select('id, name_en'),
      ])
      setProducts(prods ?? [])
      setCatMap(new Map(cats?.map(c => [c.id, c.name_en]) ?? []))
      setBrandMap(new Map(brands?.map(b => [b.id, b.name_en]) ?? []))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let list = products
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name_en?.toLowerCase().includes(q) ||
        p.name_zh?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      )
    }
    if (filterCat) list = list.filter(p => p.category_id === filterCat)
    if (filterStatus === 'active') list = list.filter(p => p.is_active)
    if (filterStatus === 'inactive') list = list.filter(p => !p.is_active)
    if (filterStatus === 'featured') list = list.filter(p => p.is_featured)
    return list
  }, [products, search, filterCat, filterStatus])

  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    products.forEach(p => {
      if (p.category_id && catMap.has(p.category_id)) {
        seen.set(p.category_id, catMap.get(p.category_id)!)
      }
    })
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [products, catMap])

  const columns: ColumnsType<Product> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, r) => (
        <div>
          <Text strong style={{ display: 'block' }}>{r.name_en ?? '—'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.name_zh}</Text>
        </div>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      responsive: ['md'],
      render: (v: string | null) => v ? <Text code style={{ fontSize: 11 }}>{v}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category',
      render: (v: string | null) => <Tag>{catMap.get(v ?? '') ?? '—'}</Tag>,
    },
    {
      title: 'Brand',
      dataIndex: 'brand_id',
      key: 'brand',
      responsive: ['sm'],
      render: (v: string | null) => <Text type="secondary">{brandMap.get(v ?? '') ?? '—'}</Text>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (v: number | null) => <Text strong>{fmtCurrency(v)}</Text>,
    },
    {
      title: 'Stock',
      dataIndex: 'stock_qty',
      key: 'stock_qty',
      render: (v: number | null) => {
        const qty = v ?? 0
        return (
          <Tag color={qty === 0 ? 'red' : qty < 10 ? 'orange' : 'green'}>
            {qty === 0 ? 'Out of stock' : `${qty} in stock`}
          </Tag>
        )
      },
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
          <Button type="link" size="small" style={{ padding: 0 }}>Edit</Button>
          <Button type="link" size="small" danger style={{ padding: 0 }}>Delete</Button>
        </Space>
      ),
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Products</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage your product catalog
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Product
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={10}>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} md={7}>
            <Select placeholder="All Categories" style={{ width: '100%' }} allowClear value={filterCat} onChange={v => setFilterCat(v ?? null)}>
              {categories.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={7}>
            <Select placeholder="All Status" style={{ width: '100%' }} allowClear value={filterStatus} onChange={v => setFilterStatus(v ?? null)}>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="featured">Featured</Select.Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  )
}
