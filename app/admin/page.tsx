'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'

// Add your admin emails here
const ADMIN_EMAILS = ['admin@prezumi.ai', 'alisherovuz@gmail.com']

interface Stats {
  totalUsers: number
  totalResumes: number
  totalCoverLetters: number
  todaySignups: number
}

interface UserData {
  id: string
  email: string
  created_at: string
  user_metadata: { name?: string }
  resumes_count: number
  cover_letters_count: number
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalResumes: 0, totalCoverLetters: 0, todaySignups: 0 })
  const [users, setUsers] = useState<UserData[]>([])
  const [resumes, setResumes] = useState<any[]>([])
  const [coverLetters, setCoverLetters] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await getSupabase().auth.getUser()
      
      if (!user) {
        window.location.href = '/auth/login'
        return
      }

      // Check if user is admin
      if (!ADMIN_EMAILS.includes(user.email || '')) {
        window.location.href = '/dashboard'
        return
      }

      setIsAdmin(true)
      await loadData()
    } catch (error) {
      console.error('Admin check error:', error)
      window.location.href = '/dashboard'
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      // Load resumes
      const { data: resumesData, count: resumesCount } = await getSupabase()
        .from('resumes')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50)

      // Load cover letters
      const { data: lettersData, count: lettersCount } = await getSupabase()
        .from('cover_letters')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50)

      setResumes(resumesData || [])
      setCoverLetters(lettersData || [])

      // Get unique users from resumes and cover letters
      const allUserIds = new Set([
        ...(resumesData || []).map(r => r.user_id),
        ...(lettersData || []).map(l => l.user_id)
      ])

      // Count resumes and cover letters per user
      const userStats: Record<string, { resumes: number; letters: number }> = {}
      
      resumesData?.forEach(r => {
        if (!userStats[r.user_id]) userStats[r.user_id] = { resumes: 0, letters: 0 }
        userStats[r.user_id].resumes++
      })
      
      lettersData?.forEach(l => {
        if (!userStats[l.user_id]) userStats[l.user_id] = { resumes: 0, letters: 0 }
        userStats[l.user_id].letters++
      })

      // Create user list from available data
      const userList: UserData[] = Array.from(allUserIds).map(id => ({
        id: id as string,
        email: `User ${(id as string).slice(0, 8)}...`,
        created_at: new Date().toISOString(),
        user_metadata: {},
        resumes_count: userStats[id as string]?.resumes || 0,
        cover_letters_count: userStats[id as string]?.letters || 0
      }))

      setUsers(userList)

      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      const todayResumes = resumesData?.filter(r => r.created_at.startsWith(today)).length || 0
      const todayLetters = lettersData?.filter(l => l.created_at.startsWith(today)).length || 0

      setStats({
        totalUsers: allUserIds.size,
        totalResumes: resumesCount || 0,
        totalCoverLetters: lettersCount || 0,
        todaySignups: todayResumes + todayLetters
      })

    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const deleteResume = async (id: string) => {
    if (!confirm('Delete this resume?')) return
    try {
      await getSupabase().from('resumes').delete().eq('id', id)
      setResumes(resumes.filter(r => r.id !== id))
      setStats(prev => ({ ...prev, totalResumes: prev.totalResumes - 1 }))
    } catch (error) {
      alert('Failed to delete')
    }
  }

  const deleteCoverLetter = async (id: string) => {
    if (!confirm('Delete this cover letter?')) return
    try {
      await getSupabase().from('cover_letters').delete().eq('id', id)
      setCoverLetters(coverLetters.filter(l => l.id !== id))
      setStats(prev => ({ ...prev, totalCoverLetters: prev.totalCoverLetters - 1 }))
    } catch (error) {
      alert('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </Link>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">Admin</span>
          </div>
          <button onClick={loadData} className="text-sm text-gray-500 hover:text-gray-700">
            ↻ Refresh
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalResumes}</p>
                <p className="text-sm text-gray-500">Resumes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCoverLetters}</p>
                <p className="text-sm text-gray-500">Cover Letters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todaySignups}</p>
                <p className="text-sm text-gray-500">Today's Activity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'resumes', 'cover-letters', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                activeTab === tab ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[...resumes.slice(0, 5), ...coverLetters.slice(0, 5)]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 10)
                  .map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.company_name ? 'bg-purple-100' : 'bg-green-100'}`}>
                        {item.company_name ? '✉️' : '📄'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title || 'Untitled'}</p>
                        <p className="text-sm text-gray-500">
                          {item.company_name ? 'Cover Letter' : 'Resume'} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'resumes' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Template</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resumes.map(resume => (
                    <tr key={resume.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{resume.title || 'Untitled'}</td>
                      <td className="px-6 py-4 capitalize">{resume.template || 'classic'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(resume.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteResume(resume.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {resumes.length === 0 && <p className="p-6 text-center text-gray-500">No resumes yet</p>}
            </div>
          )}

          {activeTab === 'cover-letters' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coverLetters.map(letter => (
                    <tr key={letter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{letter.title || 'Untitled'}</td>
                      <td className="px-6 py-4">{letter.company_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(letter.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteCoverLetter(letter.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {coverLetters.length === 0 && <p className="p-6 text-center text-gray-500">No cover letters yet</p>}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User ID</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Resumes</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cover Letters</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{user.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4">{user.resumes_count}</td>
                      <td className="px-6 py-4">{user.cover_letters_count}</td>
                      <td className="px-6 py-4 font-medium">{user.resumes_count + user.cover_letters_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="p-6 text-center text-gray-500">No users yet</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
