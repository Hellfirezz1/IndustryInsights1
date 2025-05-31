import { Metadata } from 'next'
import { DigestContent } from '@/components/digest/digest-content'

export const metadata: Metadata = {
  title: 'Digest',
  description: 'View your personalized content digest',
}

interface DigestPageProps {
  params: {
    id: string
  }
}

export default function DigestPage({ params }: DigestPageProps) {
  return <DigestContent digestId={params.id} />
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}