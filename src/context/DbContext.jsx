// dbApiClient.js
// React SPA "API" context: in DEV mode proxies to JSON-Server; in PROD mode uses static db.json loads + in-memory CRUD/filter + IndexedDB persistence
import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { openDB } from 'idb'

const DBContext = createContext(null)
// Initialize IndexedDB
const dbPromise = openDB('react-blog-app', 1, {
  upgrade(db) {
    db.createObjectStore('users')
    db.createObjectStore('articles')
    db.createObjectStore('comments')
  }
})

// Helpers for IndexedDB
async function idbGet(storeName) {
  const db = await dbPromise
  return (await db.get(storeName, 'all')) || []
}
async function idbSet(storeName, data) {
  const db = await dbPromise
  await db.put(storeName, data, 'all')
}

export function DBProvider({ children }) {

  const [data, setData] = useState({ users: [], articles: [], comments: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isDev = import.meta.env.DEV
  const apiDbUrl = import.meta.env.VITE_API_URL_DB

  // Generic API caller
  const callApi = async ({ method, path, body }) => {

    if (isDev) {
      
      const res = await fetch(`${apiDbUrl}/${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      })

      if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`)
      if (method === 'DELETE') return null
      
      return res.json()
    }

    // PROD: use in-memory CRUD
    if (!path) throw new Error('Path is required for in-memory CRUD')
    const [resource, id] = path.split('/')
  
    switch (resource) {
      case 'users': return inMemoryCRUD('users', id, method, body)
      case 'articles': return inMemoryCRUD('articles', id, method, body)
      case 'comments': return inMemoryCommentCRUD(id, body, method)
      default: throw new Error(`Unknown resource: ${resource}`)
    }
  }

  // In-memory & IndexedDB CRUD for users/articles
  async function inMemoryCRUD(storeName, id, method, body) {

    const list = data[storeName]
    let updatedList, item
    switch (method) {
      case 'GET':
        return id ? list.find(e => e.id === id) : list
      case 'POST':
        item = { id: uuid(), ...body }
        updatedList = [...list, item]
        break
      case 'PUT':
        updatedList = list.map(e => e.id === id ? { ...e, ...body } : e)
        item = updatedList.find(e => e.id === id)
        break
      case 'DELETE':
        updatedList = list.filter(e => e.id !== id)
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
    setData(prev => ({ ...prev, [storeName]: updatedList }))
    await idbSet(storeName, updatedList)
    return item || null
  }

  // In-memory & IndexedDB CRUD specifically for comments
  async function inMemoryCommentCRUD(id, body, method) {
    let newComment, updatedComments, updatedArticles
    switch (method) {
      case 'GET':
        return id ? data.comments.find(c => c.id === id) : data.comments
      case 'POST':
        newComment = { id: uuid(), ...body }
        updatedComments = [...data.comments, newComment]
        updatedArticles = data.articles.map(a =>
          a.id === newComment.articleId
            ? { ...a, comments: [...a.comments, { id: newComment.id, author: newComment.author, content: newComment.content }] }
            : a
        )
        setData(prev => ({ ...prev, comments: updatedComments, articles: updatedArticles }))
        await idbSet('comments', updatedComments)
        await idbSet('articles', updatedArticles)
        return newComment
      case 'PUT':
        updatedComments = data.comments.map(c => c.id === id ? { ...c, ...body } : c)
        updatedArticles = data.articles.map(a => ({
          ...a,
          comments: a.comments.map(c => c.id === id ? { ...c, ...body } : c)
        }))
        setData(prev => ({ ...prev, comments: updatedComments, articles: updatedArticles }))
        await idbSet('comments', updatedComments)
        await idbSet('articles', updatedArticles)
        return updatedComments.find(c => c.id === id)
      case 'DELETE':
        updatedComments = data.comments.filter(c => c.id !== id)
        updatedArticles = data.articles.map(a => ({ ...a, comments: a.comments.filter(c => c.id !== id) }))
        setData(prev => ({ ...prev, comments: updatedComments, articles: updatedArticles }))
        await idbSet('comments', updatedComments)
        await idbSet('articles', updatedArticles)
        return null
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
  }

  // Load data on mount
  useEffect(() => {

    (async () => {

      try {
        let json

        if (isDev) {
          const [users, articles, comments] = await Promise.all([
            callApi({ method: 'GET', path: 'users' }),
            callApi({ method: 'GET', path: 'articles' }),
            callApi({ method: 'GET', path: 'comments' })
          ])
          json = { users, articles, comments }
        }
        else {
          // PROD: try IndexedDB first
          const [users, articles, comments] = await Promise.all([
            idbGet('users'),
            idbGet('articles'),
            idbGet('comments')
          ])
          
          if (users.length || articles.length || comments.length) {
            json = { users, articles, comments }
          } else {
            json = await fetch(apiDbUrl).then(r => r.json())
            await idbSet('users', json.users)
            await idbSet('articles', json.articles)
            await idbSet('comments', json.comments)
          }
        }
        setData(json)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Exposed methods including dual-filter for articles
  return (
    <DBContext.Provider value={{
      data,
      loading,
      error,
      listUsers: filter => callApi({ method: 'GET', path: 'users' }).then(users =>
        filter?.username ? users.filter(u => u.username.includes(filter.username)) : users
      ),
      getUser: id => callApi({ method: 'GET', path: `users/${id}` }),
      getUserByCredentials: (username, password) => {
        if (isDev) {
          return fetch(`${apiDbUrl}/users?username=${username}&password=${password}`)
            .then(r => r.json())
            .then(arr => arr[0] || null)
        }
        return Promise.resolve(
          data.users.find(u => u.username === username && u.password === password) || null
        )
      },
      getUserByName: (username) => {
        if (isDev) {
          return fetch(`${apiDbUrl}/users?username=${username}`)
            .then(r => r.json())
            .then(arr => arr[0] || null)
        }
        return Promise.resolve(
          data.users.find(u => u.username === username) || null
        )
      },
      addUser: user => callApi({ method: 'POST', path: 'users', body: user }),
      editUser: (id, changes) => callApi({ method: 'PUT', path: `users/${id}`, body: changes }),
      removeUser: id => callApi({ method: 'DELETE', path: `users/${id}` }),

      listArticles: filter => callApi({ method: 'GET', path: 'articles' }).then(arts => {
        let results = arts
        console.log('listArticles', arts)
        if (filter?.category) {
          results = results.filter(a =>
            a.category.toLowerCase().includes(filter.category.toLowerCase())
          )
        }
        if (filter?.title) {
          results = results.filter(a =>
            a.title.toLowerCase().includes(filter.title.toLowerCase())
          )
        }
        return results
      }),
      getArticle: id => callApi({ method: 'GET', path: `articles/${id}` }),
      addArticle: art => callApi({ method: 'POST', path: 'articles', body: art }),
      editArticle: (id, changes) => callApi({ method: 'PUT', path: `articles/${id}`, body: changes }),
      removeArticle: id => callApi({ method: 'DELETE', path: `articles/${id}` }),

      listComments: filter => callApi({ method: 'GET', path: 'comments' }).then(comms =>
        filter?.articleId ? comms.filter(c => c.articleId === filter.articleId) : comms
      ),
      getComment: id => callApi({ method: 'GET', path: `comments/${id}` }),
      getCommentsByArticleId: articleId => callApi({ method: 'GET', path: 'comments' }).then(comms => comms.filter(c => c.articleId === articleId)),
      addComment: comm => callApi({ method: 'POST', path: 'comments', body: comm }),
      editComment: (id, changes) => callApi({ method: 'PUT', path: `comments/${id}`, body: changes }),
      removeComment: id => callApi({ method: 'DELETE', path: `comments/${id}` })
    }}>
      {children}
    </DBContext.Provider>
  )
}

export function useDB() {
  const ctx = useContext(DBContext)
  if (!ctx) throw new Error('useDB must be inside DBProvider')
  return ctx
}
