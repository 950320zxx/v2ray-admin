import request from '@/utils/request'

// login 登陆
export function login(data) {
  return request({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}

//注册
export function reg(data) {
  return request({
    url: '/api/v1/reg',
    method: 'post',
    data
  })
}

//授权登录
export function githubAuth(code) {
  return request({
    url: '/api/v1/github_auth',
    method: 'post',
    data:{
      code
    }
  })
}

// logout 退出
export function logout() {
  return request({
    url: '/api/v1/logout',
    method: 'post'
  })
}

// refreshtoken 刷新token
export function refreshtoken(data) {
  return request({
    url: '/refreshtoken',
    method: 'post',
    data
  })
}

// getInfo 获取用户基本信息
export function getInfo() {
  return request({
    url: '/api/v1/getinfo',
    method: 'get'
  })
}

