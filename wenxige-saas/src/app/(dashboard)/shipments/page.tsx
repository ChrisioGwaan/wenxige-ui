'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Input, Space, Typography, Select, Row, Col, Spin } from 'antd'
import { SearchOutlined, LinkOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'

const { Title, Text } = Typography

interface Shipment {
  id: string
  order_id: string
  carrier_code: string | null
  tracking_number: string | null
  tracking_url: string | null
  shipment_status: string
  estimated_delivery: string | null
  shipped_at: string | null
  delivered_at: string | null
  order_number?: string
}

const fmtDate = (v: string | null) =>
  v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const carrierName: Record<string, string> = {
  ems: 'EMS', sf_express: 'SF Express', dhl: 'DHL',
  ups: 'UPS', fedex: 'FedEx', china_post: 'China Post', yanwen: 'Yanwen', cainiao: 'Cainiao',
}

const carrierColors: Record<string, string> = {
  ems: 'blue', sf_express: 'orange', dhl: 'red',
  ups: 'gold', fedex: 'purple', china_post: 'cyan', yanwen: 'green', cainiao: 'default',
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'default', label: 'Pending' },
  picked_up: { color: 'blue', label: 'Picked Up' },
  in_transit: { color: 'cyan', label: 'In Transit' },
  out_for_delivery: { color: 'purple', label: 'Out for Delivery' },
  delivered: { color: 'green', label: 'Delivered' },
  exception: { color: 'red', label: 'Exception' },
  returned: { color: 'orange', label: 'Returned' },
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCarrier, setFilterCarrier] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: rows } = await supabase
        .from('order_shipment')
        .select('id, order_id, carrier_code, tracking_number, tracking_url, shipment_status, estimated_delivery, shipped_at, delivered_at')
        .order('shipped_at', { ascending: false, nullsFirst: true })

      if (!rows?.length) {
        setShipments([])
        setLoading(false)
        return
      }

      const orderIds = [...new Set(rows.map(r => r.order_id))]
      const { data: orders } = await supabase
        .from('order')
        .select('id, order_number')
        .in('id', orderIds)
      const orderMap = new Map(orders?.map(o => [o.id, o.order_number]) ?? [])

      setShipments(rows.map(r => ({ ...r, order_number: orderMap.get(r.order_id) ?? r.order_id })))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let list = shipments
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.order_number?.toLowerCase().includes(q) ||
        s.tracking_number?.toLowerCase().includes(q)
      )
    }
    if (filterCarrier) list = list.filter(s => s.carrier_code === filterCarrier)
    if (filterStatus) list = list.filter(s => s.shipment_status === filterStatus)
    return list
  }, [shipments, search, filterCarrier, filterStatus])

  const carriers = useMemo(() => {
    const seen = new Set<string>()
    shipments.forEach(s => { if (s.carrier_code) seen.add(s.carrier_code) })
    return Array.from(seen)
  }, [shipments])

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
      dataIndex: 'carrier_code',
      key: 'carrier',
      render: (v: string | null) => v
        ? <Tag color={carrierColors[v] ?? 'default'}>{carrierName[v] ?? v}</Tag>
        : <Text type="secondary">—</Text>,
    },
    {
      title: 'Tracking #',
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      render: (v: string | null, r) => v ? (
        <Space>
          <Text code style={{ fontSize: 11 }}>{v}</Text>
          {r.tracking_url && (
            <Button type="text" size="small" icon={<LinkOutlined />} href={r.tracking_url} target="_blank" style={{ color: '#9AB17A', padding: 0 }} />
          )}
        </Space>
      ) : <Text type="secondary">—</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'shipment_status',
      key: 'shipment_status',
      render: (v: string) => {
        const cfg = statusConfig[v] ?? { color: 'default', label: v }
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
    {
      title: 'Est. Delivery',
      dataIndex: 'estimated_delivery',
      key: 'estimated_delivery',
      render: (v: string | null) => <Text type="secondary">{fmtDate(v)}</Text>,
    },
    {
      title: 'Shipped',
      dataIndex: 'shipped_at',
      key: 'shipped_at',
      responsive: ['md'],
      render: (v: string | null) => <Text type="secondary">{fmtDate(v)}</Text>,
    },
    {
      title: 'Delivered',
      dataIndex: 'delivered_at',
      key: 'delivered_at',
      responsive: ['md'],
      render: (v: string | null) => (
        <Text style={{ color: v ? '#9AB17A' : '#94a3b8' }}>{fmtDate(v)}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <Button type="link" size="small" style={{ padding: 0, color: '#9AB17A' }}>Update</Button>
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
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>Shipments</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Track all outgoing shipments</Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Search by order # or tracking number..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Select placeholder="All Carriers" style={{ width: '100%' }} allowClear value={filterCarrier} onChange={v => setFilterCarrier(v ?? null)}>
              {carriers.map(c => (
                <Select.Option key={c} value={c}>{carrierName[c] ?? c}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select placeholder="All Status" style={{ width: '100%' }} allowClear value={filterStatus} onChange={v => setFilterStatus(v ?? null)}>
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
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `${total} shipments` }}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  )
}

