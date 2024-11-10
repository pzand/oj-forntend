# oj-frontend

## 项目安装

```
npm install
```

### 编译并启动服务

```
npm run serve
```

### 构建服务

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### 根据后台，使用openapi生成接口

```shell
openapi --input http://localhost:8121/api/v3/api-docs --output ./generated --client axios
```

### Customize configuration
- 前端组件：https://arco.design/vue/component/form
- markdown组件：https://github.com/pd4d10/bytemd
- 代码高亮组件：https://github.com/microsoft/monaco-editor
- 日期组件: https://github.com/moment/moment
