import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import { baseURL } from '../../config/url.js'
import store from '../store/index.js'

axios.defaults.baseURL = baseURL;
// axios.defaults.headers.common['token'] = store.state.login.token;

// create an axios instance
const service = axios.create({
  baseURL: baseURL, // api 的 base_url
  timeout: 20 * 1000 // request timeout
})


// request拦截
service.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截
service.interceptors.response.use(response => {
  return response
}, error => {
  Message({
    message: error.message,
    type: 'error',
    duration: 20 * 1000
  })
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    // 如果不需要除了data之外的数据，可以直接 return response.data
    return response.data;
  } else {
    // 异常状态下，把错误信息返回去
    return {
      status: -404,
      msg: '网络异常'
    }
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    alert(res.msg)
  }
  return res;
}

export default {
  post (url, data) {
    return service({
      method: 'post',
      url,
      data: qs.stringify(data, {arrayFormat: 'repeat'}),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },

  download(url, data, filename) {
    return service({
      method: 'post',
      url,
      data: qs.stringify(data, {arrayFormat: 'repeat'}),
      // headers: {
      //   'X-Requested-With': 'XMLHttpRequest',
      //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      // },
      responseType: 'blob'
    }).then(
      function(res) {
        var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
        var contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.style.display = 'none';
        downloadElement.href = href;
        downloadElement.download =filename ; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      }
    ).catch(function(error) {
      console.log(error);
    });
  },
  get (url, params) {
    return service({
      method: 'get',
      url,
      params, // get 请求时带的参数
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  put (url, params) {
    return service({
      method: 'put',
      url,
      params: params, // put 请求时带的参数
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  del (url, params) {
    return service({
      method: 'delete',
      url,
      params :  params, // delete 请求时带的参数
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false })
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}