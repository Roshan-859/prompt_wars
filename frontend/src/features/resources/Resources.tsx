import React, { useState } from 'react'
import { useRecommendedResources, useResources } from '@/api/hooks'
import { Card, Badge, Button } from '@/components/ui'
import { BookOpen, ExternalLink, Clock, Star, Sparkles } from 'lucide-react'
import type { Resource } from '@/types'

const FORMATS = ['All', 'course', 'doc', 'video', 'exercise', 'project', 'challenge']

export default function Resources() {
  const [filter, setFilter] = useState('All')
  const { data: recommended } = useRecommendedResources()
  const { data: allResources } = useResources(filter !== 'All' ? filter : undefined)

  function ResourceCard({ res }: { res: Resource }) {
    return (
      <Card className="p-5 flex flex-col justify-between hover:border-royal-gold/40 transition-all">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <Badge variant="gold" className="text-[10px] uppercase">{res.resource_type}</Badge>
            <span className="text-xs text-secondary-text font-medium">{res.platform}</span>
          </div>
          <h3 className="font-semibold text-sm text-primary-text line-clamp-2">{res.title}</h3>
          <p className="text-xs text-secondary-text mt-1.5 line-clamp-2">{res.description}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <span className="flex items-center gap-0.5 text-royal-gold font-bold">
              <Star className="w-3.5 h-3.5 fill-royal-gold" /> {res.rating}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {res.duration_hours || 4}h
            </span>
          </div>

          {res.url && (
            <a href={res.url} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="sm" className="text-xs py-1 px-3 gap-1">
                Start <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-text">Resource Recommendations</h1>
        <p className="text-secondary-text text-sm mt-1">
          Targeted learning media tailored to your exact prerequisite gaps by the Resource Discovery Agent.
        </p>
      </div>

      {/* Recommended Section */}
      {recommended && recommended.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-royal-gold" />
            <h2 className="font-display font-bold text-lg text-primary-text">High-Priority Matches for Your Skill Gaps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommended.slice(0, 3).map((r) => (
              <ResourceCard key={r.id} res={r} />
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-primary-text">Complete Resource Catalog</h2>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFilter(fmt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                filter === fmt
                  ? 'bg-royal-gold/20 border-royal-gold text-deep-gold'
                  : 'border-border bg-white text-secondary-text hover:border-royal-gold/30'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {allResources?.map((r) => (
            <ResourceCard key={r.id} res={r} />
          ))}
        </div>
      </div>
    </div>
  )
}

