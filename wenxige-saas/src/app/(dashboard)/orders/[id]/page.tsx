'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  Spin,
  Result,
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
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'

const { Title, Text } = Typography

interface OrderDetail {
  id: string
  order_number: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state_province: string | null
  postal_code: string | null
  country: string | null
  subtotal: number | null
  shipping_cost: number | null
  tax: number | null
  discount: number | null
  total: number | null
  order_status: string
  payment_status: string
  payment_method: string | null
  payment_ref: string | null
  notes: string | null
  created_at: string
}

interface OrderItem {
  id: string
  product_name_en: string | null
  product_name_zh: string | null
  variant_name_en: string | null
  sku: string | null
  unit_price: number | null
  quantity: number
  line_total: number | null
}

interface Shipment {
  id: string
  carrier_code: string | null
  tracking_number: string | null
  tracking_url: string | null
  shipment_status: string
  estimated_delivery: string | null
  shipped_at: string | null
  delivered_at: string | null
}

const fmtDate = (v: string | null) =>
  v
    ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—'

const fmtDateTime = (v: string | null) =>
  v
    ? new Date(v).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

const fmtCurrency = (amount: number | null) =>
  amount != null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    : '—'

const carrierName: Record<string, string> = {
  ems: 'EMS',
  sf_express: 'SF Express',
  dhl: 'DHL',
  ups: 'UPS',
  fedex: 'FedEx',
  china_post: 'China Post',
  yanwen: 'Yanwen',
  cainiao: 'Cainiao',
}

const orderStatusColors: Record<string, string> = {
  pending: 'orange',
  processing: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

const shipmentStatusColors: Record<string, string> = {
  pending: 'default',
  picked_up: 'blue',
  in_transit: 'cyan',
  out_for_delivery: 'purple',
  delivered: 'green',
  exception: 'red',
  returned: 'orange',
}

const paymentStatusColors: Record<string, string> = {
  pending: 'orange',
  paid: 'green',
  failed: 'red',
  refunded: 'default',
}

export default function OrderDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const id = params?.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: t.orders.colProduct,
      key: 'product',
      render: (_, r) => (
        <div>
          <Text strong>{r.product_name_en ?? '—'}</Text>
          {r.variant_name_en && (
            <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
              {r.variant_name_en}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: t.orders.colSKU,
      dataIndex: 'sku',
      key: 'sku',
      responsive: ['sm'],
      render: (v: string | null) =>
        v ? (
          <Text code style={{ fontSize: 11 }}>
            {v}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: t.orders.colUnitPrice,
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (v: number | null) => <Text>{fmtCurrency(v)}</Text>,
    },
    { title: t.orders.colQty, dataIndex: 'quantity', key: 'quantity', width: 60 },
    {
      title: t.orders.colLineTotal,
      dataIndex: 'line_total',
      key: 'line_total',
      render: (v: number | null) => <Text strong>{fmtCurrency(v)}</Text>,
    },
  ]

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    async function load() {
      const [{ data: orderData, error }, { data: itemsData }, { data: shipmentData }] =
        await Promise.all([
          supabase.from('order').select('*').eq('id', id).single(),
          supabase
            .from('order_item')
            .select(
              'id, product_name_en, product_name_zh, variant_name_en, sku, unit_price, quantity, line_total',
            )
            .eq('order_id', id),
          supabase
            .from('order_shipment')
            .select(
              'id, carrier_code, tracking_number, tracking_url, shipment_status, estimated_delivery, shipped_at, delivered_at',
            )
            .eq('order_id', id)
            .maybeSingle(),
        ])
      if (error || !orderData) {
        setNotFound(true)
      } else {
        setOrder(orderData)
        setItems(itemsData ?? [])
        setShipment(shipmentData ?? null)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <Result
        status="404"
        title={t.orders.notFound}
        subTitle={t.orders.notFoundDesc}
        extra={
          <Link href="/orders">
            <Button type="primary">{t.orders.backToOrders}</Button>
          </Link>
        }
      />
    )
  }

  const orderStatusColor = orderStatusColors[order.order_status] ?? 'default'
  const orderStatusLabel =
    (t.orders as Record<string, string>)[order.order_status] ?? order.order_status

  const timelineItems = [
    {
      color: 'green',
      children: (
        <>
          <Text strong>{t.orders.orderPlaced}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {fmtDateTime(order.created_at)} — {t.orders.paymentReceived.toLowerCase()}{' '}
            {order.payment_status}
            {order.payment_method
              ? ` ${t.orders.via} ${order.payment_method.replace(/_/g, ' ')}`
              : ''}
          </Text>
        </>
      ),
    },
  ]

  if (order.payment_status === 'paid') {
    timelineItems.push({
      color: 'blue',
      children: (
        <>
          <Text strong>{t.orders.paymentReceived}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {fmtCurrency(order.total)} {t.orders.charged}
            {order.payment_ref ? ` — ${t.orders.ref}: ${order.payment_ref}` : ''}
          </Text>
        </>
      ),
    })
  }

  if (shipment?.shipped_at) {
    timelineItems.push({
      color: 'cyan',
      children: (
        <>
          <Text strong>{(t.orders as Record<string, string>)['shipped'] ?? 'Shipped'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {fmtDateTime(shipment.shipped_at)} —{' '}
            {carrierName[shipment.carrier_code ?? ''] ?? shipment.carrier_code}
            {shipment.tracking_number ? ` · ${shipment.tracking_number}` : ''}
          </Text>
        </>
      ),
    })
  }

  if (shipment?.delivered_at) {
    timelineItems.push({
      color: 'green',
      children: (
        <>
          <Text strong>{(t.orders as Record<string, string>)['delivered'] ?? 'Delivered'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {fmtDateTime(shipment.delivered_at)}
          </Text>
        </>
      ),
    })
  } else if (order.order_status !== 'cancelled') {
    timelineItems.push({
      color: 'gray' as string,
      children: <Text type="secondary">{t.orders.awaitingUpdate}</Text>,
    })
  }

  const shippingAddress = [
    order.address_line1,
    order.address_line2,
    [order.city, order.state_province, order.postal_code].filter(Boolean).join(', '),
    order.country,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <Link href="/orders">
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: '#64748b' }}>
            {t.orders.backToOrders}
          </Button>
        </Link>
        <Divider orientation="vertical" />
        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>
          {order.order_number}
        </Title>
        <Tag color={orderStatusColor} style={{ marginLeft: 4 }}>
          {orderStatusLabel}
        </Tag>
      </div>

      <Row gutter={[16, 16]}>
        {/* Order Items */}
        <Col span={24}>
          <Card title={t.orders.orderItems} style={{ borderRadius: 12 }}>
            <Table
              columns={itemColumns}
              dataSource={items}
              rowKey="id"
              pagination={false}
              size="middle"
              scroll={{ x: 'max-content' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 16,
                gap: 8,
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Space style={{ fontSize: 13 }}>
                <Text type="secondary">{t.orders.subtotal}:</Text>
                <Text>{fmtCurrency(order.subtotal)}</Text>
              </Space>
              <Space style={{ fontSize: 13 }}>
                <Text type="secondary">{t.orders.shipping}:</Text>
                <Text>{fmtCurrency(order.shipping_cost)}</Text>
              </Space>
              {(order.tax ?? 0) > 0 && (
                <Space style={{ fontSize: 13 }}>
                  <Text type="secondary">{t.orders.tax}:</Text>
                  <Text>{fmtCurrency(order.tax)}</Text>
                </Space>
              )}
              {(order.discount ?? 0) > 0 && (
                <Space style={{ fontSize: 13 }}>
                  <Text type="secondary">{t.orders.discount}:</Text>
                  <Text style={{ color: '#9AB17A' }}>-{fmtCurrency(order.discount)}</Text>
                </Space>
              )}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ fontSize: 16 }}>
                <Text strong>{t.orders.total}:</Text>
                <Text strong style={{ color: '#9AB17A' }}>
                  {fmtCurrency(order.total)}
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Customer */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <UserOutlined /> {t.orders.customerSection}
              </Space>
            }
            style={{ borderRadius: 12, height: '100%' }}
          >
            <Descriptions
              column={1}
              size="small"
              styles={{ label: { color: '#64748b', width: 100 } }}
            >
              <Descriptions.Item label={t.orders.name}>
                {[order.first_name, order.last_name].filter(Boolean).join(' ') || '—'}
              </Descriptions.Item>
              <Descriptions.Item label={t.orders.email}>{order.email ?? '—'}</Descriptions.Item>
              <Descriptions.Item label={t.orders.phone}>{order.phone ?? '—'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Shipping Address */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined /> {t.orders.shippingAddress}
              </Space>
            }
            style={{ borderRadius: 12, height: '100%' }}
          >
            <Text style={{ whiteSpace: 'pre-line', fontSize: 13 }}>{shippingAddress || '—'}</Text>
          </Card>
        </Col>

        {/* Payment */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <DollarOutlined /> {t.orders.paymentSection}
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <Descriptions
              column={1}
              size="small"
              styles={{ label: { color: '#64748b', width: 120 } }}
            >
              <Descriptions.Item label={t.orders.paymentMethod}>
                {order.payment_method
                  ? order.payment_method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                  : '—'}
              </Descriptions.Item>
              <Descriptions.Item label={t.orders.paymentStatus}>
                {(() => {
                  const color = paymentStatusColors[order.payment_status] ?? 'default'
                  const label =
                    (t.orders as Record<string, string>)[order.payment_status] ??
                    order.payment_status
                  return <Tag color={color}>{label}</Tag>
                })()}
              </Descriptions.Item>
              {order.payment_ref && (
                <Descriptions.Item label={t.orders.paymentRef}>
                  {order.payment_ref}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Shipment */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <CarOutlined /> {t.orders.shipmentSection}
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            {shipment ? (
              <Descriptions
                column={1}
                size="small"
                styles={{ label: { color: '#64748b', width: 120 } }}
              >
                <Descriptions.Item label={t.orders.shipmentStatus}>
                  {(() => {
                    const color = shipmentStatusColors[shipment.shipment_status] ?? 'default'
                    const label =
                      (t.shipments as Record<string, string>)[shipment.shipment_status] ??
                      shipment.shipment_status
                    return <Tag color={color}>{label}</Tag>
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label={t.orders.carrier}>
                  {carrierName[shipment.carrier_code ?? ''] ?? shipment.carrier_code ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label={t.orders.tracking}>
                  {shipment.tracking_number ? (
                    shipment.tracking_url ? (
                      <a href={shipment.tracking_url} target="_blank" rel="noopener noreferrer">
                        {shipment.tracking_number}
                      </a>
                    ) : (
                      <Text code style={{ fontSize: 11 }}>
                        {shipment.tracking_number}
                      </Text>
                    )
                  ) : (
                    '—'
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={t.orders.estDelivery}>
                  {fmtDate(shipment.estimated_delivery)}
                </Descriptions.Item>
                {shipment.delivered_at && (
                  <Descriptions.Item label={t.orders.deliveredAt}>
                    {fmtDateTime(shipment.delivered_at)}
                  </Descriptions.Item>
                )}
              </Descriptions>
            ) : (
              <>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  {t.common.noShipmentYet}
                </Text>
                <Button type="dashed" size="small" icon={<CarOutlined />} style={{ width: '100%' }}>
                  {t.common.addShipment}
                </Button>
              </>
            )}
          </Card>
        </Col>

        {/* Timeline */}
        <Col span={24}>
          <Card title={t.orders.orderTimeline} style={{ borderRadius: 12 }}>
            <Timeline items={timelineItems} />
          </Card>
        </Col>

        {order.notes && (
          <Col span={24}>
            <Card title={t.orders.notes} style={{ borderRadius: 12 }}>
              <Text>{order.notes}</Text>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}
