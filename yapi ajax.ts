var Fly = require("./dist/npm/wx");
var fly = new Fly();
fly.interceptors.request.use((request:any) => {
  let token = '111';
  request.headers["token"] = token;
  if ((request.method === "post" || request.method === "POST") &&typeof request.data === "object") {
    let data = "";
    for (let key in request.data) {
      if (data) {
        data += "&";
      }
      data +=encodeURIComponent(key) + "=" + encodeURIComponent(request.data[key]);
    }
    request.body = data;
  }
  return request;
});
// @cc: 检测 fly 响应状态
function onStatusError(error: any) {
  const err =
    'response' in error && error.response
      ? {
          code: error.response.status,
          message: error.response.statusText
        }
      : { code: 10001, message: error.message };
  if (err.code === 401 || err.code === 403) {
    // @todo 未登录未授权
    // EventCenter.emit('common.user.status', err);
  }
  return err;
}
fly.interceptors.response.use(
  (response:any) => {
   
    if (response.data.error == 401) {
      
    }
    return response;
  },
  (err:any) => {
    return err;
  }
);


 class ajax {
  /**
   * @description ajax 方法
   */
   ajax(
    { method, url, data, form, query, header, extra }: WrappedFetchParams,
    path?: string,
    basePath?: string
  ) {
    let config = {
      ...extra,
      method: method.toLocaleLowerCase(),
      headers: { ...header }
    };
    // json
    if (data) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/json'
        },
        data
      };
    }
    // form
    if (form) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(form)
      };
    }
      return fly.request({ ...config, url, params: query })
    .then((res:any) =>res.data)
    .catch(onStatusError)
  }


}
export type AjaxPromise<R> = Promise<R>;
export interface ExtraFetchParams {
  extra?: any;
}

export interface WrappedFetchParams extends ExtraFetchParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD';
  url: string;
  data?: any; // post json
  form?: any; // post form
  query?: any;
  header?: any;
  path?: any;
}

export default new ajax();

