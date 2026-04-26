'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, InputNumber, message, Modal, notification, Popconfirm, Row, Space, Spin, Switch, Table, Tag, Typography } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'

const { Title, Text } = Typography

interface Category {
  id: string
  name_en: string | null
  name_zh: string | null
  slug: string | null
  description: string | null
  sort_order: number | null
  is_show: boolean
  del_flag: boolean
  product_count: number
}

interface CategoryFormValues {
  name_en: string
  name_zh?: string
  description?: string
  sort_order?: number | null
  is_show?: boolean
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

export default function CategoriesPage() {
  const { t } = useLanguage()
  const [form] = Form.useForm<CategoryFormValues>()
  const [messageApi, contextHolder] = message.useMessage()
  const [notificationApi, notificationHolder] = notification.useNotification({ placement: 'topRight' })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [search, setSearch] = useState('')

  const loadCategories = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)

    try {
      const [{ data: cats, error: categoriesError }, { data: prods, error: productsError }] = await Promise.all([
        supabase.from('category').select('id, name_en, name_zh, slug, description, sort_order, is_show, del_flag').eq('del_flag', false).order('sort_order', { ascending: true }),
        supabase.from('product').select('category_id').eq('del_flag', false),
      ])

      if (categoriesError) throw categoriesError
      if (productsError) throw productsError

      const countMap: Record<string, number> = {}
      prods?.forEach(product => {
        if (product.category_id) countMap[product.category_id] = (countMap[product.category_id] ?? 0) + 1
      })

      setCategories((cats ?? []).map(category => ({ ...category, is_show: category.is_show ?? true, product_count: countMap[category.id] ?? 0 })))
    } catch (error) {
      messageApi.error(`${t.categories.loadError}${getErrorMessage(error)}`)
    } finally {
      setLoading(false)
    }
  }, [messageApi, t.categories.loadError])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const nextSortOrder = useMemo(() => {
    return categories.reduce((currentMax, category) => Math.max(currentMax, category.sort_order ?? 0), 0) + 1
  }, [categories])

  const filtered = useMemo(() => {
    if (!search.trim()) return categories
    const q = search.toLowerCase()
    return categories.filter(category =>
      category.name_en?.toLowerCase().includes(q) ||
      category.name_zh?.toLowerCase().includes(q) ||
      category.slug?.toLowerCase().includes(q)
    )
  }, [categories, search])

  const openCreateModal = () => {
    setEditingCategory(null)
    form.resetFields()
    form.setFieldsValue({ is_show: true, sort_order: nextSortOrder })
    setModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    form.setFieldsValue({
      name_en: category.name_en ?? '',
      name_zh: category.name_zh ?? '',
      description: category.description ?? '',
      sort_order: category.sort_order,
      is_show: category.is_show,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditingCategory(null)
    form.resetFields()
  }

  const handleSave = async () => {
    let values: CategoryFormValues

    try {
      values = await form.validateFields()
    } catch {
      return
    }

    const supabase = createClient()
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const payload = {
        name_en: normalizeText(values.name_en),
        name_zh: normalizeText(values.name_zh),
        slug: editingCategory?.slug ?? buildSlug(values.name_en),
        description: normalizeText(values.description),
        sort_order: values.sort_order ?? null,
        is_show: values.is_show ?? true,
        modified_by: user?.id ?? null,
      }

      const result = editingCategory
        ? await supabase.from('category').update(payload).eq('id', editingCategory.id)
        : await supabase.from('category').insert({ ...payload, created_by: user?.id ?? null, del_flag: false })

      if (result.error) throw result.error

      notificationApi.success({
        title: t.common.success,
        description: editingCategory ? t.categories.updateSuccess : t.categories.createSuccess,
      })
      setModalOpen(false)
      setEditingCategory(null)
      form.resetFields()
      await loadCategories()
    } catch (error) {
      notificationApi.error({
        title: t.common.error,
        description: `${t.categories.saveError}${getErrorMessage(error)}`,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    const supabase = createClient()
    setDeletingId(category.id)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('category')
        .update({ del_flag: true, modified_by: user?.id ?? null })
        .eq('id', category.id)

      if (error) throw error

      setCategories(currentCategories => currentCategories.filter(currentCategory => currentCategory.id !== category.id))
      notificationApi.success({
        title: t.common.success,
        description: t.categories.deleteSuccess,
      })
    } catch (error) {
      notificationApi.error({
        title: t.common.error,
        description: `${t.categories.deleteError}${getErrorMessage(error)}`,
      })
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnsType<Category> = [
    {
      title: t.categories.colName,
      key: 'name',
      render: (_, r) => (
        <div>
          <Text strong>{r.name_en ?? '—'}</Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{r.name_zh}</Text>
        </div>
      ),
    },
    {
      title: t.categories.colSlug,
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['sm'],
      render: (v: string | null) => v ? <Text code style={{ fontSize: 12 }}>{v}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: t.categories.colSort,
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      responsive: ['sm'],
      render: (v: number | null) => <Text type="secondary">{v ?? '—'}</Text>,
    },
    {
      title: t.categories.colVisibility,
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
      title: t.categories.colProducts,
      dataIndex: 'product_count',
      key: 'product_count',
      width: 100,
      render: (v: number) => <Tag color="blue">{v} {t.categories.products}</Tag>,
    },
    {
      title: t.common.actions,
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" style={{ padding: 0 }} onClick={() => openEditModal(record)}>{t.common.edit}</Button>
          <Popconfirm
            title={t.categories.deleteConfirmTitle}
            description={t.categories.deleteConfirmDescription}
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
          <Title level={4} style={{ margin: 0, color: '#0f172a' }}>{t.categories.title}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{t.categories.subtitle}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          {t.categories.addCategory}
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={10}>
            <Input
              placeholder={t.categories.searchPlaceholder}
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
        title={editingCategory ? t.categories.editTitle : t.categories.createTitle}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        okText={editingCategory ? t.common.save : t.common.create}
        confirmLoading={saving}
        forceRender
      >
        <Form form={form} layout="vertical" initialValues={{ is_show: true }}>
          <Form.Item
            name="name_en"
            label={t.categories.nameEn}
            rules={[{ required: true, message: t.categories.nameRequired }, { max: 120, message: t.categories.nameMax }]}
          >
            <Input placeholder={t.categories.nameEnPlaceholder} />
          </Form.Item>

          <Form.Item name="name_zh" label={t.categories.nameZh} rules={[{ required: true, message: t.categories.nameZhRequired }, { max: 120, message: t.categories.nameMax }]}>
            <Input placeholder={t.categories.nameZhPlaceholder} />
          </Form.Item>

          <Form.Item name="description" label={t.categories.description} rules={[{ required: true, message: t.categories.descriptionRequired }, { max: 500, message: t.categories.descriptionMax }]}>
            <Input.TextArea rows={3} placeholder={t.categories.descriptionPlaceholder} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="sort_order" label={t.categories.sortOrder} rules={[{ required: true, message: t.categories.sortOrderRequired }]}>
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="is_show" label={t.categories.visibility} valuePropName="checked">
                <Switch checkedChildren={t.common.visible} unCheckedChildren={t.common.hidden} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
