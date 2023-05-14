import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { setUser } from '../../redux/features/userSlice'
import { pushRotate as Menu } from 'react-burger-menu'
import '../../css/custom-burger.css'


const AppLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate('/login')
      } else {
        dispatch(setUser(user))
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Box sx={{
        display: 'flex',
        // maxWidth: '100%'
      }}
      id="outer-container"
      >
        {/* <Menu  /> */}
        
        <Menu isOpen  pageWrapId={ "page-wrap" } >
          <Sidebar id="sidebar" />
        </Menu>
        
          <Box sx={{
            flexGrow: 1,
            p: 1,
            width: 'max-content',
            marginTop: '70px'
          }}
          id="page-wrap">
            <Outlet />
          </Box>
        
      </Box>
    )
  )
}

export default AppLayout