import React, { useState, useEffect } from 'react'
import { useProfile, useUpdateProfile, useMe } from '@/api/hooks'
import { Card, Input, Button, Badge } from '@/components/ui'
import { User, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { data: user } = useMe()
  const { data: profile } = useProfile()
  const updateProfile = useUpdateProfile()

  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [institution, setInstitution] = useState('')
  const [studyHours, setStudyHours] = useState(15)

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '')
      setLocation(profile.location || '')
      setInstitution(profile.institution || '')
      setStudyHours(profile.weekly_study_hours || 15)
    }
  }, [profile])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync({
        bio,
        location,
        institution,
        weekly_study_hours: Number(studyHours),
      })
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-text">Learner Profile</h1>
        <p className="text-secondary-text text-sm mt-1">Manage your biographical and academic attributes.</p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-gold-gradient text-royal-night font-bold text-2xl flex items-center justify-center font-display">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-primary-text">{user?.full_name}</h2>
            <p className="text-secondary-text text-xs">{user?.email}</p>
            <Badge variant="gold" className="mt-1 uppercase text-[10px]">{user?.role || 'student'}</Badge>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" />
            <Input label="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. UC Berkeley" />
          </div>

          <Input
            label="Target Weekly Study Hours"
            type="number"
            value={studyHours}
            onChange={(e) => setStudyHours(Number(e.target.value))}
          />

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Biography & Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] border border-border text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/30"
              placeholder="Aspiring software engineer specialized in full-stack architecture..."
            />
          </div>

          <Button variant="gold" size="md" type="submit" loading={updateProfile.isPending}>
            Save Profile Changes
          </Button>
        </form>
      </Card>
    </div>
  )
}

