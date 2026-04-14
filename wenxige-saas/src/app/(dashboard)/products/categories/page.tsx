'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, Table, Button, Input, Space, Typography, Tag, Row, Col, Spin } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'

const { Title, Text } = Typography

interface Category {
  id: string
  name_en: string | null
  name_zh: string | null
  slug: string | null
  sort_order: number | null
  del_flag: boolean
  product_count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('category').select('id, name_en, name_zh, slug, sort_order, del_flag').order('sort_order', { ascending: true }),
        supabase.from('product').select('category_id').eq('del_flag', false),
      ])
      const countMap: Record<string, number> = {}
      prods?.forEach(p => {
        if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1
      })
      setCategories((cats ?? []).map(c => ({ ...c, product_count: countMap[c.id] ?? 0 })))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return categories
    const q = search.toLowerCase()
    return categories.filter(c =>
      c.name_en?.toLowerCase().includes(q) ||
      c.name_zh?.toLowerCase().includes(q) ||
      c.slug?.toLowerCase().includes(q)
    )
  }, [categories, search])

  const columns: ColumnsType<Category> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, r) => (
        <div>
          <Text strong>{r.name_en ?? '—'}</Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{r.name_zh}</Text>
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['sm'],
      render: (v: string | null) => v ? <Text code style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      responsive: ['sm'],
      render: (v: number | null) => <Text type="secondary">{v ?? '—'}</Text>,
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
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Categories</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Organize your product catalog</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Category
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={10}>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Table columns={columns} dataSource={filtered} rowKey="id" pagination={false} size="middle" scroll={{ x: 'max-content' }} />
      </Card>
    </div>
  )
}
