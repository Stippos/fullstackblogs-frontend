import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    ) 
  }, [])

  useEffect(() => {
    setUser(JSON.parse(window.localStorage.getItem('loggedBlogger')))
  }, [])

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogger')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogger', JSON.stringify(user))
      console.log(user)
      blogService.setToken(user.token)
      //console.log(user)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      //setErrorMessage('wrong credentials')
      setTimeout(() => {
        //setErrorMessage(null)
      }, 5000)
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.postNewBlog({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }, user)

      setNewBlogAuthor('')
      setNewBlogTitle('')
      setNewBlogUrl('')
    } catch(error) {
      console.log('Pieleen meni')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )



    if (user === null){
      return (loginForm())
    }else{
      return (
        <div>
        <h1>Blogs</h1>
        <div>{user.name} logged in</div>
        <form onSubmit={handleLogout}>
        <button type='submit'>Log Out</button>
        </form>
        
        <h2>Insert new blog</h2>
        <form onSubmit={handleNewBlog}>
          <div>Title:<input value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)}/></div>
          <div>Author:<input value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)}/></div>
          <div>Url:<input value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)}/></div>
          <div><button type='submit'>Create</button></div>
        </form>
        <h2>Hot Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      )
    }
  
}

export default App