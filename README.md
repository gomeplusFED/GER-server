# GER

---
GER server,借助ElasticSearch可以帮你快速搭建起你的前端监控系统。

---

## Getting Start

### 安装ElasticSearch

使用本系统需要先安装ElasticSearch，安装教程：

下载地址：https://www.elastic.co/downloads/elasticsearch

依赖官方指定的JAVA版本。

```bash
curl -L -O http://download.elasticsearch.org/PATH/TO/VERSION.zip <1>
unzip elasticsearch-$VERSION.zip
cd  elasticsearch-$VERSION
./bin/elasticsearch 
```

-d 参数可以让elasticsearch在后台执行

下载完毕后可直接启动。

安装入门指南：(无需安装Marvel)
https://es.xiaoleilu.com/010_Intro/10_Installing_ES.html

安装完毕后并启动，需要做一个template，执行下面命令即可。

```
curl -XPUT 127.0.0.1:9200/_template/template_1 -d '{"template":"logstash-web_access*","mappings":{"logs":{"properties":{"@timestamp":{"type":"date"}}}}}'
```

### 安装GER-server

```bash
git clone https://github.com/gomeplusFED/GER-server.git
git submodule init && git submodule update
npm install -d && cd public/GER-UI/ && npm install -d
```

因为前后端分离，所以需要先更新GER-server的子项目GER-UI，然后安装对应依赖，最后再start，就可以启动项目了。

### 配置&&启动

```bash
cp config.default.js config.js
cp plugin/user.default.json plugin/user.json
npm start
```
如果你使用pm2启动服务，可以这样：

```js
pm2 start "/usr/local/bin/npm" --name "GER" -- start
```

修改elasticsearch的配置和用户配置后启动,之后通过浏览器 http://127.0.0.1:8888/ 访问系统即可。
