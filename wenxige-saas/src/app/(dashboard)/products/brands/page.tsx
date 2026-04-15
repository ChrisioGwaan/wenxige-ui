'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, Table, Button, Input, Space, Typography, Tag, Avatar, Row, Col, Spin } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'

const { Title, Text } = Typography

interface Brand {
  id: string
  name_en: string | null
  name_zh: string | null
  slug: string | null
  sort_order: number | null
  del_flag: boolean
  product_count: number
}

export default function BrandsPage() {
  const { t } = useLanguage()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [{ data: bs }, { data: prods }] = await Promise.all([
        supabase.from('brand').select('id, name_en, name_zh, slug, sort_order, del_flag').order('sort_order', { ascending: true }),
        supabase.from('product').select('brand_id').eq('del_flag', false),
      ])
      const countMap: Record<string, number> = {}
      prods?.forEach(p => {
        if (p.brand_id) countMap[p.brand_id] = (countMap[p.brand_id] ?? 0) + 1
      })
      setBrands((bs ?? []).map(b => ({ ...b, product_count: countMap[b.id] ?? 0 })))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return brands
    const q = search.toLowerCase()
    return brands.filter(b =>
      b.name_en?.toLowerCase().includes(q) ||
      b.name_zh?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q)
    )
  }, [brands, search])

  const columns: ColumnsType<Brand> = [
    {
      title: t.brands.colBrand,
      key: 'brand',
      render: (_, r) => (
        <Space>
          <Avatar size={36} style={{ background: '#f0f4ec', color: '#9AB17A', fontWeight: 700, fontSize: 14 }}>
            {r.name_en?.[0] ?? '?'}
          </Avatar>
          <div>
            <Text strong>{r.name_en ?? '—'}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{r.name_zh}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: t.brands.colSlug,
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['sm'],
      render: (v: string | null) => v ? <Text code style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: t.brands.colSort,
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      responsive: ['sm'],
      render: (v: number | null) => <Text type="secondary">{v ?? '—'}</Text>,
    },
    {
      title: t.brands.colProducts,
      dataIndex: 'product_count',
      key: 'product_count',
      width: 110,
      render: (v: number) => <Tag color="green">{v} {t.brands.products}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" style={{ padding: 0 }}>{t.common.edit}</Button>
          <Button type="link" size="small" danger style={{ padding: 0 }}>{t.common.delete}</Button>
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
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>{t.brands.title}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{t.brands.subtitle}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          {t.brands.addBrand}
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={10}>
            <Input
              placeholder={t.brands.searchPlaceholder}
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
