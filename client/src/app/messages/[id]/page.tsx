'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function RedirectMessageId() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  useEffect(() => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id
    if (id) router.replace(`/messages?cid=${encodeURIComponent(String(id))}`)
    else router.replace('/messages')
  }, [params, router])
  return null
}