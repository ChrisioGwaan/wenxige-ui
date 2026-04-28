'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Image as AntImage,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd'
import { DeleteOutlined, PlusOutlined, SearchOutlined, StarFilled } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { RcFile } from 'antd/es/upload'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'

const { Title, Text } = Typography

const PRODUCT_IMAGE_BUCKET = 'product-images'
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_IMAGES_PER_PRODUCT = 15

interface Product {
  id: string
  name_en: string | null
  name_zh: string | null
  category_id: string | null
  brand_id: string | null
  price: number | null
  compare_at_price: number | null
  stock_qty: number | null
  sku: string | null
  description_en: string | null
  description_zh: string | null
  weight: number | null
  origin: string | null
  is_active: boolean
  is_featured: boolean
  del_flag: boolean
}

interface ProductImageRow {
  id: string
  product_id: string
  bucket_id: string | null
  object_path: string | null
  url: string | null
  sort_order: number | null
  is_primary: boolean | null
}

interface ProductFormValues {
  name_en: string
  name_zh: string
  category_id: string
  brand_id?: string | null
  price: number
  compare_at_price?: number | null
  sku?: string
  stock_qty: number
  weight?: number | null
  origin?: string
  description_en?: string
  description_zh?: string
  is_active?: boolean
  is_featured?: boolean
}

type ImageItem =
  | { kind: 'existing'; id: string; url: string; bucket_id: string | null; object_path: string | null }
  | { kind: 'pending'; tempId: string; bucket_id: string; object_path: string; url: string }

const fmtCurrency = (amount: number | null) =>
  amount != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) : '—'

const normalizeText = (value?: string | null) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

const buildSlug = (fallbackName?: string) => {
  const source = normalizeText(fallbackName)
  if (!source) return null

  const asciiSlug = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return asciiSlug || source
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Unknown error'
}

const getFileExtension = (file: File) => {
  const fromName = file.name.includes('.') ? file.name.split('.').pop() : null
  if (fromName) return fromName.toLowerCase()
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}

export default function ProductsPage() {
  const { t } = useLanguage()
  const [form] = Form.useForm<ProductFormValues>()
  const [messageApi, contextHolder] = message.useMessage()
  const [notificationApi, notificationHolder] = notification.useNotification({ placement: 'topRight' })

  const [products, setProducts] = useState<Product[]>([])
  const [primaryImageMap, setPrimaryImageMap] = useState<Map<string, string>>(new Map())
  const [catList, setCatList] = useState<Array<{ id: string; name_en: string | null; name_zh: string | null }>>([])
  const [brandList, setBrandList] = useState<Array<{ id: string; name_en: string | null; name_zh: string | null }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imageItems, setImageItems] = useState<ImageItem[]>([])
  const [removedExistingIds, setRemovedExistingIds] = useState<string[]>([])
  const [imageUploading, setImageUploading] = useState(false)
  const [imagesError, setImagesError] = useState<string | null>(null)

  const catMap = useMemo(() => new Map(catList.map(c => [c.id, c.name_en ?? c.name_zh ?? '—'])), [catList])
  const brandMap = useMemo(() => new Map(brandList.map(b => [b.id, b.name_en ?? b.name_zh ?? '—'])), [brandList])

  const loadAll = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    try {
      const [prodsRes, catsRes, brandsRes, imagesRes] = await Promise.all([
        supabase
          .from('product')
          .select('id, name_en, name_zh, category_id, brand_id, price, compare_at_price, stock_qty, sku, description_en, description_zh, weight, origin, is_active, is_featured, del_flag')
          .eq('del_flag', false)
          .order('modified_at', { ascending: false }),
        supabase.from('category').select('id, name_en, name_zh').eq('del_flag', false).order('sort_order', { ascending: true }),
        supabase.from('brand').select('id, name_en, name_zh').eq('del_flag', false).order('sort_order', { ascending: true }),
        supabase.from('product_image').select('product_id, bucket_id, object_path, url, is_primary, sort_order').eq('del_flag', false),
      ])

      if (prodsRes.error) throw prodsRes.error
      if (catsRes.error) throw catsRes.error
      if (brandsRes.error) throw brandsRes.error
      if (imagesRes.error) throw imagesRes.error

      setProducts(prodsRes.data ?? [])
      setCatList(catsRes.data ?? [])
      setBrandList(brandsRes.data ?? [])

      // Pick a representative thumbnail per product (primary first, then lowest sort_order).
      type ImgListItem = { product_id: string | null; bucket_id: string | null; object_path: string | null; url: string | null; is_primary: boolean | null; sort_order: number | null }
      const grouped: Record<string, ImgListItem[]> = {}
      ;(imagesRes.data ?? []).forEach((img: ImgListItem) => {
        if (!img.product_id) return
        ;(grouped[img.product_id] ||= []).push(img)
      })
      const thumbMap = new Map<string, string>()
      Object.entries(grouped).forEach(([pid, imgs]) => {
        const sorted = [...imgs].sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1
          if (!a.is_primary && b.is_primary) return 1
          return (a.sort_order ?? 0) - (b.sort_order ?? 0)
        })
        const first = sorted[0]
        if (!first) return
        let resolved = first.url
        if (first.object_path && first.bucket_id) {
          const { data } = supabase.storage.from(first.bucket_id).getPublicUrl(first.object_path)
          resolved = data.publicUrl
        }
        if (resolved) thumbMap.set(pid, resolved)
      })
      setPrimaryImageMap(thumbMap)
    } catch (error) {
      messageApi.error(`${t.products.loadError}${getErrorMessage(error)}`)
    } finally {
      setLoading(false)
    }
  }, [messageApi, t.products.loadError])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const filtered = useMemo(() => {
    let list = products
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        p =>
          p.name_en?.toLowerCase().includes(q) ||
          p.name_zh?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q),
      )
    }
    if (filterCat) list = list.filter(p => p.category_id === filterCat)
    if (filterStatus === 'active') list = list.filter(p => p.is_active)
    if (filterStatus === 'inactive') list = list.filter(p => !p.is_active)
    if (filterStatus === 'featured') list = list.filter(p => p.is_featured)
    return list
  }, [products, search, filterCat, filterStatus])

  const categoryOptions = useMemo(() => {
    const seen = new Map<string, string>()
    products.forEach(p => {
      if (p.category_id && catMap.has(p.category_id)) seen.set(p.category_id, catMap.get(p.category_id)!)
    })
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [products, catMap])

  const resetImageState = () => {
    setImageItems([])
    setRemovedExistingIds([])
    setImagesError(null)
  }

  const loadImagesForEdit = useCallback(async (productId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('product_image')
      .select('id, product_id, bucket_id, object_path, url, sort_order, is_primary')
      .eq('product_id', productId)
      .eq('del_flag', false)
      .order('sort_order', { ascending: true })

    if (error) {
      messageApi.error(`${t.products.loadError}${getErrorMessage(error)}`)
      return
    }

    const items: ImageItem[] = (data ?? []).map((img: ProductImageRow) => {
      let resolved = img.url ?? ''
      if (img.object_path && img.bucket_id) {
        const { data: pub } = supabase.storage.from(img.bucket_id).getPublicUrl(img.object_path)
        resolved = pub.publicUrl
      }
      return {
        kind: 'existing',
        id: img.id,
        url: resolved,
        bucket_id: img.bucket_id,
        object_path: img.object_path,
      }
    })
    setImageItems(items)
  }, [messageApi, t.products.loadError])

  const openCreateModal = () => {
    setEditingProduct(null)
    form.resetFields()
    form.setFieldsValue({ is_active: true, is_featured: false, stock_qty: 0, price: 0 })
    resetImageState()
    setModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    form.setFieldsValue({
      name_en: product.name_en ?? '',
      name_zh: product.name_zh ?? '',
      category_id: product.category_id ?? undefined,
      brand_id: product.brand_id ?? undefined,
      price: product.price ?? 0,
      compare_at_price: product.compare_at_price,
      sku: product.sku ?? '',
      stock_qty: product.stock_qty ?? 0,
      weight: product.weight,
      origin: product.origin ?? '',
      description_en: product.description_en ?? '',
      description_zh: product.description_zh ?? '',
      is_active: product.is_active,
      is_featured: product.is_featured,
    })
    resetImageState()
    void loadImagesForEdit(product.id)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving || imageUploading) return
    setModalOpen(false)
    setEditingProduct(null)
    form.resetFields()
    resetImageState()
  }

  const handleAddImage = async (file: RcFile) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      messageApi.error(t.products.imageTypeError)
      return false
    }
    if (file.size > MAX_IMAGE_BYTES) {
      messageApi.error(t.products.imageSizeError)
      return false
    }
    if (imageItems.length >= MAX_IMAGES_PER_PRODUCT) {
      messageApi.error(t.products.imageMaxError)
      return false
    }

    const supabase = createClient()
    setImageUploading(true)
    try {
      const ext = getFileExtension(file)
      const folder = editingProduct?.id ?? 'new'
      const objectPath = `products/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(objectPath, file, { contentType: file.type, upsert: false })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(objectPath)
      setImageItems(prev => [
        ...prev,
        {
          kind: 'pending',
          tempId: `${Date.now()}-${Math.random()}`,
          bucket_id: PRODUCT_IMAGE_BUCKET,
          object_path: objectPath,
          url: data.publicUrl,
        },
      ])
      setImagesError(null)
    } catch (error) {
      messageApi.error(`${t.products.imageUploadError}${getErrorMessage(error)}`)
    } finally {
      setImageUploading(false)
    }
    return false
  }

  const handleRemoveImage = async (index: number) => {
    const item = imageItems[index]
    if (!item) return

    if (item.kind === 'pending') {
      const supabase = createClient()
      try {
        await supabase.storage.from(item.bucket_id).remove([item.object_path])
      } catch {
        // best effort cleanup
      }
    } else {
      setRemovedExistingIds(prev => [...prev, item.id])
    }
    setImageItems(prev => prev.filter((_, i) => i !== index))
  }

  const persistImages = async (productId: string, userId: string | null) => {
    const supabase = createClient()

    // Soft-delete removed existing rows
    if (removedExistingIds.length > 0) {
      const { error } = await supabase
        .from('product_image')
        .update({ del_flag: true, modified_by: userId })
        .in('id', removedExistingIds)
      if (error) throw error
    }

    // Insert new pending uploads, preserving order vs. existing kept items.
    const pendingWithIndex = imageItems
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => it.kind === 'pending') as Array<{ it: Extract<ImageItem, { kind: 'pending' }>; idx: number }>

    if (pendingWithIndex.length > 0) {
      const insertRows = pendingWithIndex.map(({ it, idx }) => ({
        product_id: productId,
        bucket_id: it.bucket_id,
        object_path: it.object_path,
        url: it.url,
        sort_order: idx,
        is_primary: idx === 0,
        created_by: userId,
        modified_by: userId,
        del_flag: false,
      }))
      const { error } = await supabase.from('product_image').insert(insertRows)
      if (error) throw error
    }

    // Update sort_order / is_primary for kept existing rows
    const existingItems = imageItems
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => it.kind === 'existing') as Array<{ it: Extract<ImageItem, { kind: 'existing' }>; idx: number }>

    for (const { it, idx } of existingItems) {
      const { error } = await supabase
        .from('product_image')
        .update({ sort_order: idx, is_primary: idx === 0, modified_by: userId })
        .eq('id', it.id)
      if (error) throw error
    }
  }

  const handleSave = async () => {
    let values: ProductFormValues
    try {
      values = await form.validateFields()
    } catch {
      return
    }

    if (imageItems.length === 0) {
      setImagesError(t.products.imagesRequired)
      return
    }
    setImagesError(null)

    const supabase = createClient()
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const userId = user?.id ?? null

      const basePayload = {
        name_en: normalizeText(values.name_en),
        name_zh: normalizeText(values.name_zh),
        category_id: values.category_id,
        brand_id: values.brand_id ?? null,
        price: values.price,
        compare_at_price: values.compare_at_price ?? null,
        sku: normalizeText(values.sku),
        stock_qty: values.stock_qty ?? 0,
        weight: values.weight ?? null,
        origin: normalizeText(values.origin),
        description_en: normalizeText(values.description_en),
        description_zh: normalizeText(values.description_zh),
        is_active: values.is_active ?? true,
        is_featured: values.is_featured ?? false,
        modified_by: userId,
      }

      let productId: string
      if (editingProduct) {
        const { error } = await supabase.from('product').update(basePayload).eq('id', editingProduct.id)
        if (error) throw error
        productId = editingProduct.id
      } else {
        const insertPayload = { ...basePayload, slug: buildSlug(values.name_en), created_by: userId, del_flag: false }
        const { data, error } = await supabase
          .from('product')
          .insert(insertPayload)
          .select('id')
          .single()
        if (error) throw error
        productId = data.id
      }

      await persistImages(productId, userId)

      notificationApi.success({
        message: t.common.success,
        description: editingProduct ? t.products.updateSuccess : t.products.createSuccess,
      })
      setModalOpen(false)
      setEditingProduct(null)
      form.resetFields()
      resetImageState()
      await loadAll()
    } catch (error) {
      notificationApi.error({
        message: t.common.error,
        description: `${t.products.saveError}${getErrorMessage(error)}`,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    const supabase = createClient()
    setDeletingId(product.id)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('product')
        .update({ del_flag: true, modified_by: user?.id ?? null })
        .eq('id', product.id)
      if (error) throw error

      setProducts(prev => prev.filter(p => p.id !== product.id))
      notificationApi.success({
        message: t.common.success,
        description: t.products.deleteSuccess,
      })
    } catch (error) {
      notificationApi.error({
        message: t.common.error,
        description: `${t.products.deleteError}${getErrorMessage(error)}`,
      })
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: t.products.colProduct,
      key: 'product',
      render: (_, r) => {
        const thumb = primaryImageMap.get(r.id)
        return (
          <Space>
            {thumb ? (
              <AntImage
                src={thumb}
                alt={r.name_en ?? ''}
                width={40}
                height={40}
                style={{ objectFit: 'cover', borderRadius: 6 }}
                preview={false}
              />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 6, background: '#f0f4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AB17A', fontWeight: 700 }}>
                {r.name_en?.[0] ?? '?'}
              </div>
            )}
            <div>
              <Text strong style={{ display: 'block' }}>{r.name_en ?? '—'}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{r.name_zh}</Text>
            </div>
          </Space>
        )
      },
    },
    {
      title: t.products.colSKU,
      dataIndex: 'sku',
      key: 'sku',
      responsive: ['md'],
      render: (v: string | null) => (v ? <Text code style={{ fontSize: 11 }}>{v}</Text> : <Text type="secondary">—</Text>),
    },
    {
      title: t.products.colCategory,
      dataIndex: 'category_id',
      key: 'category',
      render: (v: string | null) => <Tag>{catMap.get(v ?? '') ?? '—'}</Tag>,
    },
    {
      title: t.products.colBrand,
      dataIndex: 'brand_id',
      key: 'brand',
      responsive: ['sm'],
      render: (v: string | null) => <Text type="secondary">{brandMap.get(v ?? '') ?? '—'}</Text>,
    },
    {
      title: t.products.colPrice,
      dataIndex: 'price',
      key: 'price',
      render: (v: number | null) => <Text strong>{fmtCurrency(v)}</Text>,
    },
    {
      title: t.products.colStock,
      dataIndex: 'stock_qty',
      key: 'stock_qty',
      render: (v: number | null) => {
        const qty = v ?? 0
        return (
          <Tag color={qty === 0 ? 'red' : qty < 10 ? 'orange' : 'green'}>
            {qty === 0 ? t.products.outOfStock : `${qty} ${t.products.inStock}`}
          </Tag>
        )
      },
    },
    {
      title: t.products.colStatus,
      key: 'status',
      render: (_, r) => (
        <Space size={4}>
          <Tag color={r.is_active ? 'green' : 'default'}>
            {r.is_active ? t.products.active : t.products.inactive}
          </Tag>
          {r.is_featured && <Tag color="gold">{t.products.featured}</Tag>}
        </Space>
      ),
    },
    {
      title: t.common.actions,
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => openEditModal(record)}>
            {t.common.edit}
          </Button>
          <Popconfirm
            title={t.products.deleteConfirmTitle}
            description={t.products.deleteConfirmDescription}
            okText={t.common.delete}
            cancelText={t.common.cancel}
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" size="small" danger loading={deletingId === record.id} style={{ padding: 0 }}>
              {t.common.delete}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (loading) {
    return (
      <>
        {contextHolder}
        {notificationHolder}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Spin size="large" />
        </div>
      </>
    )
  }

  return (
    <div>
      {contextHolder}
      {notificationHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>{t.products.title}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{t.products.subtitle}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          {t.products.addProduct}
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={10}>
            <Input
              placeholder={t.products.searchPlaceholder}
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} md={7}>
            <Select placeholder={t.products.allCategories} style={{ width: '100%' }} allowClear value={filterCat} onChange={v => setFilterCat(v ?? null)}>
              {categoryOptions.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={7}>
            <Select placeholder={t.products.allStatus} style={{ width: '100%' }} allowClear value={filterStatus} onChange={v => setFilterStatus(v ?? null)}>
              <Select.Option value="active">{t.products.active}</Select.Option>
              <Select.Option value="inactive">{t.products.inactive}</Select.Option>
              <Select.Option value="featured">{t.products.featured}</Select.Option>
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

      <Modal
        title={editingProduct ? t.products.editTitle : t.products.createTitle}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        okText={editingProduct ? t.common.save : t.common.create}
        confirmLoading={saving}
        okButtonProps={{ disabled: imageUploading }}
        width={760}
        forceRender
      >
        <Form form={form} layout="vertical" initialValues={{ is_active: true, is_featured: false, stock_qty: 0, price: 0 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name_en" label={t.products.nameEn} rules={[{ required: true, message: t.products.nameRequired }, { max: 200, message: t.products.nameMax }]}>
                <Input placeholder={t.products.nameEnPlaceholder} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="name_zh" label={t.products.nameZh} rules={[{ required: true, message: t.products.nameZhRequired }, { max: 200, message: t.products.nameMax }]}>
                <Input placeholder={t.products.nameZhPlaceholder} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="category_id" label={t.products.category} rules={[{ required: true, message: t.products.categoryRequired }]}>
                <Select placeholder={t.products.categoryPlaceholder} showSearch optionFilterProp="children">
                  {catList.map(c => (
                    <Select.Option key={c.id} value={c.id}>{c.name_en ?? c.name_zh}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="brand_id" label={t.products.brand}>
                <Select placeholder={t.products.brandPlaceholder} allowClear showSearch optionFilterProp="children">
                  {brandList.map(b => (
                    <Select.Option key={b.id} value={b.id}>{b.name_en ?? b.name_zh}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="price" label={t.products.price} rules={[{ required: true, message: t.products.priceRequired }]}>
                <InputNumber min={0} step={0.01} precision={2} style={{ width: '100%' }} prefix="$" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="compare_at_price" label={t.products.compareAtPrice}>
                <InputNumber min={0} step={0.01} precision={2} style={{ width: '100%' }} prefix="$" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="stock_qty" label={t.products.stockQty} rules={[{ required: true, message: t.products.stockRequired }]}>
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="sku" label={t.products.sku}>
                <Input placeholder={t.products.skuPlaceholder} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="weight" label={t.products.weight}>
                <InputNumber min={0} step={0.1} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="origin" label={t.products.origin}>
                <Input placeholder={t.products.originPlaceholder} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description_en" label={t.products.descriptionEn}>
            <Input.TextArea rows={3} placeholder={t.products.descriptionPlaceholder} />
          </Form.Item>
          <Form.Item name="description_zh" label={t.products.descriptionZh}>
            <Input.TextArea rows={3} placeholder={t.products.descriptionPlaceholder} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="is_active" label={t.products.isActive} valuePropName="checked">
                <Switch checkedChildren={t.products.active} unCheckedChildren={t.products.inactive} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="is_featured" label={t.products.isFeatured} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={`${t.products.images} (${imageItems.length}/${MAX_IMAGES_PER_PRODUCT})`}
            extra={t.products.imagesHint}
            required
            validateStatus={imagesError ? 'error' : undefined}
            help={imagesError ?? undefined}
          >
            <Space wrap size={12}>
              {imageItems.map((item, idx) => (
                <div
                  key={item.kind === 'existing' ? `e-${item.id}` : `p-${item.tempId}`}
                  style={{
                    position: 'relative',
                    width: 96,
                    height: 96,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {idx === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        background: 'rgba(154,177,122,0.95)',
                        color: 'white',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <StarFilled style={{ fontSize: 10 }} />
                      {t.products.primary}
                    </div>
                  )}
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    type="primary"
                    onClick={() => handleRemoveImage(idx)}
                    disabled={saving || imageUploading}
                    style={{ position: 'absolute', top: 4, right: 4, padding: '0 4px', height: 20, lineHeight: 1 }}
                  />
                </div>
              ))}
              {imageItems.length < MAX_IMAGES_PER_PRODUCT && (
                <Upload
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                  showUploadList={false}
                  beforeUpload={handleAddImage}
                  disabled={imageUploading || saving}
                >
                  <Button
                    style={{ width: 96, height: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    loading={imageUploading}
                  >
                    <PlusOutlined />
                    <div style={{ fontSize: 12, marginTop: 4 }}>{t.products.addImage}</div>
                  </Button>
                </Upload>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
