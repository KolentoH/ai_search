'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const searchResponse = await axios.post('/api/rag-search', { query })
      const context = searchResponse.data.organic.map((item: any, index: number) => 
        `[[citation:${index + 1}]] ${item.title}\n${item.snippet}`
      ).join('\n\n')
      
      const chatResponse = await axios.post('/api/chat', { query, context })
      setResult(chatResponse.data.choices[0].message.content)
    } catch (error) {
      console.error('Error:', error)
      setResult('An error occurred while processing your request.')
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Search Engine</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query"
          className="input input-bordered w-full max-w-xs mr-2"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {result && (
        <div className="prose">
          <h2>Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </main>
  )
}
