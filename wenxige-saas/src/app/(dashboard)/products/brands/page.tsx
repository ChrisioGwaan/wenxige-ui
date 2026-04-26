'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Card, Col, Form, Input, InputNumber, message, Modal, notification, Popconfirm, Row, Space, Spin, Switch, Table, Tag, Typography, Upload } from 'antd'
import { DeleteOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { RcFile } from 'antd/es/upload'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'

const { Title, Text } = Typography

const BRAND_LOGO_BUCKET = 'brand-logos'
const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_LOGO_BYTES = 2 * 1024 * 1024

interface BrandImageRow {
  id: string
  brand_id: string
  bucket_id: string | null
  object_path: string | null
  url: string | null
}

interface BrandLogo {
  url: string | null
  object_path: string | null
  bucket_id: string | null
}

interface Brand {
  id: string
  name_en: string | null
  name_zh: string | null
  slug: string | null
  description: string | null
  sort_order: number | null
  is_show: boolean
  del_flag: boolean
  product_count: number
  logo: BrandLogo | null
}

interface BrandFormValues {
  name_en: string
  name_zh?: string
  description?: string
  sort_order?: number | null
  is_show?: boolean
}

interface PendingLogo {
  bucket_id: string
  object_path: string
  url: string
}

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

export default function BrandsPage() {
  const { t } = useLanguage()
  const [form] = Form.useForm<BrandFormValues>()
  const [messageApi, contextHolder] = message.useMessage()
  const [notificationApi, notificationHolder] = notification.useNotification({ placement: 'topRight' })
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [search, setSearch] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [pendingLogo, setPendingLogo] = useState<PendingLogo | null>(null)
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null)
  const [logoCleared, setLogoCleared] = useState(false)
  const [logoFieldError, setLogoFieldError] = useState<string | null>(null)

  const loadBrands = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)

    try {
      const [brandsRes, productsRes, logosRes] = await Promise.all([
        supabase.from('brand').select('id, name_en, name_zh, slug, description, sort_order, is_show, del_flag').eq('del_flag', false).order('sort_order', { ascending: true }),
        supabase.from('product').select('brand_id').eq('del_flag', false),
        supabase.from('brand_image').select('id, brand_id, bucket_id, object_path, url').eq('del_flag', false),
      ])

      if (brandsRes.error) throw brandsRes.error
      if (productsRes.error) throw productsRes.error
      if (logosRes.error) throw logosRes.error

      const countMap: Record<string, number> = {}
      productsRes.data?.forEach(product => {
        if (product.brand_id) countMap[product.brand_id] = (countMap[product.brand_id] ?? 0) + 1
      })

      const logoMap: Record<string, BrandImageRow> = {}
      logosRes.data?.forEach(img => {
        if (img.brand_id) logoMap[img.brand_id] = img as BrandImageRow
      })

      setBrands((brandsRes.data ?? []).map(brand => {
        const img = logoMap[brand.id]
        let logo: BrandLogo | null = null
        if (img) {
          let resolvedUrl = img.url
          if (img.object_path && img.bucket_id) {
            const { data } = supabase.storage.from(img.bucket_id).getPublicUrl(img.object_path)
            resolvedUrl = data.publicUrl
          }
          logo = { url: resolvedUrl, object_path: img.object_path, bucket_id: img.bucket_id }
        }
        return {
          ...brand,
          is_show: brand.is_show ?? true,
          product_count: countMap[brand.id] ?? 0,
          logo,
        }
      }))
    } catch (error) {
      messageApi.error(`${t.brands.loadError}${getErrorMessage(error)}`)
    } finally {
      setLoading(false)
    }
  }, [messageApi, t.brands.loadError])

  useEffect(() => {
    void loadBrands()
  }, [loadBrands])

  const nextSortOrder = useMemo(() => {
    return brands.reduce((currentMax, brand) => Math.max(currentMax, brand.sort_order ?? 0), 0) + 1
  }, [brands])

  const filtered = useMemo(() => {
    if (!search.trim()) return brands
    const q = search.toLowerCase()
    return brands.filter(brand =>
      brand.name_en?.toLowerCase().includes(q) ||
      brand.name_zh?.toLowerCase().includes(q) ||
      brand.slug?.toLowerCase().includes(q)
    )
  }, [brands, search])

  const resetLogoState = () => {
    setPendingLogo(null)
    setExistingLogoUrl(null)
    setLogoCleared(false)
    setLogoFieldError(null)
  }

  const openCreateModal = () => {
    setEditingBrand(null)
    form.resetFields()
    form.setFieldsValue({ is_show: true, sort_order: nextSortOrder })
    resetLogoState()
    setModalOpen(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    form.setFieldsValue({
      name_en: brand.name_en ?? '',
      name_zh: brand.name_zh ?? '',
      description: brand.description ?? '',
      sort_order: brand.sort_order,
      is_show: brand.is_show,
    })
    setPendingLogo(null)
    setLogoCleared(false)
    setExistingLogoUrl(brand.logo?.url ?? null)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving || logoUploading) return
    setModalOpen(false)
    setEditingBrand(null)
    form.resetFields()
    resetLogoState()
  }

  const validateLogo = (file: RcFile) => {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      messageApi.error(t.brands.logoTypeError)
      return false
    }
    if (file.size > MAX_LOGO_BYTES) {
      messageApi.error(t.brands.logoSizeError)
      return false
    }
    return true
  }

  const handleLogoUpload = async (file: RcFile) => {
    if (!validateLogo(file)) return false

    const supabase = createClient()
    setLogoUploading(true)

    try {
      const ext = getFileExtension(file)
      const folder = editingBrand?.id ?? 'new'
      const objectPath = `brands/${folder}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(BRAND_LOGO_BUCKET)
        .upload(objectPath, file, { contentType: file.type, upsert: false })

      if (uploadError) throw uploadError

      // If a previous pending upload existed, clean it up so we don't leak files.
      if (pendingLogo?.object_path) {
        await supabase.storage.from(pendingLogo.bucket_id).remove([pendingLogo.object_path])
      }

      const { data } = supabase.storage.from(BRAND_LOGO_BUCKET).getPublicUrl(objectPath)
      setPendingLogo({ bucket_id: BRAND_LOGO_BUCKET, object_path: objectPath, url: data.publicUrl })
      setLogoCleared(false)
      setLogoFieldError(null)
    } catch (error) {
      messageApi.error(`${t.brands.logoUploadError}${getErrorMessage(error)}`)
    } finally {
      setLogoUploading(false)
    }

    return false
  }

  const handleRemoveLogo = async () => {
    if (logoUploading) return
    const supabase = createClient()

    if (pendingLogo) {
      try {
        await supabase.storage.from(pendingLogo.bucket_id).remove([pendingLogo.object_path])
      } catch {
        // Best effort; ignore.
      }
      setPendingLogo(null)
    }

    setExistingLogoUrl(null)
    setLogoCleared(true)
  }

  const persistLogo = async (brandId: string, userId: string | null) => {
    const supabase = createClient()

    if (pendingLogo) {
      const { error: clearError } = await supabase
        .from('brand_image')
        .update({ del_flag: true, modified_by: userId })
        .eq('brand_id', brandId)
        .eq('del_flag', false)
      if (clearError) throw clearError

      const { error: insertError } = await supabase.from('brand_image').insert({
        brand_id: brandId,
        bucket_id: pendingLogo.bucket_id,
        object_path: pendingLogo.object_path,
        url: pendingLogo.url,
        created_by: userId,
        modified_by: userId,
        del_flag: false,
      })
      if (insertError) throw insertError
      return
    }

    if (logoCleared && editingBrand) {
      const { error: clearError } = await supabase
        .from('brand_image')
        .update({ del_flag: true, modified_by: userId })
        .eq('brand_id', brandId)
        .eq('del_flag', false)
      if (clearError) throw clearError
    }
  }

  const handleSave = async () => {
    let values: BrandFormValues

    try {
      values = await form.validateFields()
    } catch {
      return
    }

    const previewUrl = pendingLogo?.url ?? (logoCleared ? null : existingLogoUrl)
    if (!previewUrl) {
      setLogoFieldError(t.brands.logoRequired)
      return
    }
    setLogoFieldError(null)

    const supabase = createClient()
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const userId = user?.id ?? null

      const payload = {
        name_en: normalizeText(values.name_en),
        name_zh: normalizeText(values.name_zh),
        slug: editingBrand?.slug ?? buildSlug(values.name_en),
        description: normalizeText(values.description),
        sort_order: values.sort_order ?? null,
        is_show: values.is_show ?? true,
        modified_by: userId,
      }

      let brandId: string
      if (editingBrand) {
        const { error } = await supabase.from('brand').update(payload).eq('id', editingBrand.id)
        if (error) throw error
        brandId = editingBrand.id
      } else {
        const { data, error } = await supabase
          .from('brand')
          .insert({ ...payload, created_by: userId, del_flag: false })
          .select('id')
          .single()
        if (error) throw error
        brandId = data.id
      }

      await persistLogo(brandId, userId)

      notificationApi.success({
        title: t.common.success,
        description: editingBrand ? t.brands.updateSuccess : t.brands.createSuccess,
      })
      setModalOpen(false)
      setEditingBrand(null)
      form.resetFields()
      resetLogoState()
      await loadBrands()
    } catch (error) {
      notificationApi.error({
        title: t.common.error,
        description: `${t.brands.saveError}${getErrorMessage(error)}`,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (brand: Brand) => {
    const supabase = createClient()
    setDeletingId(brand.id)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('brand')
        .update({ del_flag: true, modified_by: user?.id ?? null })
        .eq('id', brand.id)

      if (error) throw error

      setBrands(currentBrands => currentBrands.filter(currentBrand => currentBrand.id !== brand.id))
      notificationApi.success({
        title: t.common.success,
        description: t.brands.deleteSuccess,
      })
    } catch (error) {
      notificationApi.error({
        title: t.common.error,
        description: `${t.brands.deleteError}${getErrorMessage(error)}`,
      })
    } finally {
      setDeletingId(null)
    }
  }

  const previewLogoUrl = pendingLogo?.url ?? (logoCleared ? null : existingLogoUrl)

  const columns: ColumnsType<Brand> = [
    {
      title: t.brands.colBrand,
      key: 'brand',
      render: (_, r) => (
        <Space>
          <Avatar src={r.logo?.url ?? undefined} size={36} style={{ background: '#f0f4ec', color: '#9AB17A', fontWeight: 700, fontSize: 14 }}>
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
      title: t.brands.colVisibility,
      dataIndex: 'is_show',
      key: 'is_show',
      width: 110,
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'default'}>
          {value ? t.common.visible : t.common.hidden}
        </Tag>
      ),
    },
    {
      title: t.brands.colProducts,
      dataIndex: 'product_count',
      key: 'product_count',
      width: 110,
      render: (v: number) => <Tag color="green">{v} {t.brands.products}</Tag>,
    },
    {
      title: t.common.actions,
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => openEditModal(record)}>{t.common.edit}</Button>
          <Popconfirm
            title={t.brands.deleteConfirmTitle}
            description={t.brands.deleteConfirmDescription}
            okText={t.common.delete}
            cancelText={t.common.cancel}
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" size="small" danger loading={deletingId === record.id} style={{ padding: 0 }}>{t.common.delete}</Button>
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
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>{t.brands.title}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{t.brands.subtitle}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
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

      <Modal
        title={editingBrand ? t.brands.editTitle : t.brands.createTitle}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        okText={editingBrand ? t.common.save : t.common.create}
        confirmLoading={saving}
        okButtonProps={{ disabled: logoUploading }}
        forceRender
      >
        <Form form={form} layout="vertical" initialValues={{ is_show: true }}>
          <Form.Item
            name="name_en"
            label={t.brands.nameEn}
            rules={[{ required: true, message: t.brands.nameRequired }, { max: 120, message: t.brands.nameMax }]}
          >
            <Input placeholder={t.brands.nameEnPlaceholder} />
          </Form.Item>

          <Form.Item name="name_zh" label={t.brands.nameZh} rules={[{ required: true, message: t.brands.nameZhRequired }, { max: 120, message: t.brands.nameMax }]}>
            <Input placeholder={t.brands.nameZhPlaceholder} />
          </Form.Item>

          <Form.Item label={t.brands.logo} extra={t.brands.logoHint} required validateStatus={logoFieldError ? 'error' : undefined} help={logoFieldError ?? undefined}>
            <Space align="start" size={16} wrap>
              <Avatar
                src={previewLogoUrl ?? undefined}
                shape="square"
                size={72}
                style={{ background: '#f0f4ec', color: '#9AB17A', fontWeight: 700, fontSize: 22 }}
              >
                {(form.getFieldValue('name_en') as string | undefined)?.[0] ?? editingBrand?.name_en?.[0] ?? '?'}
              </Avatar>
              <Space>
                <Upload
                  accept={ALLOWED_LOGO_TYPES.join(',')}
                  showUploadList={false}
                  beforeUpload={handleLogoUpload}
                  disabled={logoUploading || saving}
                >
                  <Button icon={<UploadOutlined />} loading={logoUploading}>
                    {previewLogoUrl ? t.brands.replaceLogo : t.brands.uploadLogo}
                  </Button>
                </Upload>
                {previewLogoUrl && (
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={handleRemoveLogo}
                    disabled={logoUploading || saving}
                  >
                    {t.brands.removeLogo}
                  </Button>
                )}
              </Space>
            </Space>
          </Form.Item>

          <Form.Item name="description" label={t.brands.description} rules={[{ required: true, message: t.brands.descriptionRequired }, { max: 500, message: t.brands.descriptionMax }]}>
            <Input.TextArea rows={3} placeholder={t.brands.descriptionPlaceholder} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="sort_order" label={t.brands.sortOrder} rules={[{ required: true, message: t.brands.sortOrderRequired }]}>
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="is_show" label={t.brands.visibility} valuePropName="checked">
                <Switch checkedChildren={t.common.visible} unCheckedChildren={t.common.hidden} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
